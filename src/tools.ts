import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { formatSearchOutput, searchMetaFromValue, presentSearchCall, presentSearchResult } from '@deepseek-ai/dsh-tool-web'
import { SearchError, providerOf, type Capability, type ProviderId, type Settings, type SearchResult } from './catalog.ts'
import type { SearchAdapter } from './adapters.ts'
import { searchWithFallback } from './search-fallback.ts'
import { validateSearchOptions } from './search-options.ts'
import { toolOptions } from './tool-options.ts'
import { metadataProperties, withMetadataSnippets } from './metadata-presentation.ts'

export const TOOL_NAMES: Record<Capability, string> = {
  web: 'search_web', news: 'search_news', papers: 'search_papers', code: 'search_code', people: 'search_people', companies: 'search_companies',
  images: 'search_images', videos: 'search_videos', extract: 'extract_web_page', batchExtract: 'extract_web_pages', map: 'map_website', x: 'x_search',
}
const descriptions: Record<Capability, string> = {
  web: 'Search the web with provider-specific filters and optional explicit pagination. Separate from standard web_search.',
  news: 'Search news articles. Returns source URLs and excerpts.',
  papers: 'Search scholarly publications. Returns source URLs, excerpts, and publication metadata when provided.',
  code: 'Search public coding examples and documentation on the web.',
  people: 'Search public professional profiles and information about people.',
  companies: 'Search company pages and public company information.',
  images: 'Search images. Returns source page URLs and original image URLs when available.',
  videos: 'Search videos. Returns video page URLs and descriptions.',
  extract: 'Retrieve page text through the selected extraction service. Returns external, untrusted text; target HTTP status is not available.',
  batchExtract: 'Retrieve text for 1–10 public page URLs in one provider batch request. Returns ordered per-URL success/error, not an overall HTTP success claim. Billing may increase per unique URL; cancellation does not guarantee a refund. External text is untrusted.',
  map: 'Find public page URLs within a website. Returns links, not page contents.',
  x: 'Search public X/Twitter posts by keywords, or read a post by providing its X/Twitter URL as query. Returns post text, author, date, and available engagement counts. Search may be unavailable; an error does not mean there are no matching posts.',
}
export const sourceSchema = {
  type: 'object', additionalProperties: false, properties: {
    url: { type: 'string', required: true }, title: { type: 'string' }, snippet: { type: 'string' }, publishedAt: { type: 'string' },
    ...metadataProperties,
    authorHandle: { type: 'string' }, likes: { type: 'integer' }, reposts: { type: 'integer' }, replies: { type: 'integer' },
  },
} as const
export const searchSchema = { type: 'object', additionalProperties: false, properties: {
  sources: { type: 'array', required: true, items: sourceSchema }, truncated: { type: 'boolean', required: true },
  nextPage: { type: 'string' }, page: { type: 'integer' }, pagination: { type: 'string' }, duplicatesRemoved: { type: 'integer' },
} } as const
export function renderSearch(value: SearchResult): string {
  const details = value.sources.flatMap(({ url, title: _title, snippet: _snippet, ...metadata }) => Object.keys(metadata).length ? [{ url, ...metadata }] : [])
  const { nextPage, page, pagination, duplicatesRemoved } = value
  return formatSearchOutput(value) + (details.length ? `\n\nSource metadata (external data):\n${JSON.stringify(details)}` : '')
    + (page !== undefined ? `\n\nPagination: ${JSON.stringify({ page, pagination, duplicatesRemoved, ...nextPage ? { nextPage } : {} })}` : '')
}
function onlyArguments(args: object, allowed: readonly string[]): void {
  if (Object.keys(args).some(key => !allowed.includes(key))) throw new SearchError('invalid-request', 'Unknown tool argument; search conditions belong inside options')
}
const continuation = { type: 'string', description: 'Opaque nextPage handle returned by a previous call. Repeat exactly the same query and use the same search tool. Do not supply options, sort or max_results. Pins provider/category/options/page size; each page may incur charges. Handles expire after 15 minutes or unload and are bounded to 100 per provider. No automatic paging/fallback.' } as const
function nextAdapter(token: string, adapters: Map<ProviderId, SearchAdapter>): SearchAdapter {
  const id = providerOf(token.split(':')[0]).id, adapter = adapters.get(id)
  if (!adapter) throw new SearchError('invalid-request', 'Unknown pagination provider')
  return adapter
}
export function registerExtraTools(ctx: Context, settings: Settings, adapters: Map<ProviderId, SearchAdapter>, registrations: Map<string, () => void>): void {
  const desired = new Map(Object.entries(settings.tools)
    .filter(([, choice]) => choice.enabled && settings.providers[choice.provider]?.enabled)
    .map(([capability, choice]) => [`${capability}:${choice.provider}:${JSON.stringify(settings.providers[choice.provider]?.search ?? {})}`, { capability: capability as Capability, provider: choice.provider }]))
  for (const [key, dispose] of registrations) if (!desired.has(key)) { dispose(); registrations.delete(key) }
  for (const [key, { capability, provider }] of desired) {
    if (registrations.has(key)) continue
    const adapter = adapters.get(provider)
    if (!adapter) throw new SearchError('invalid-request', 'Unknown provider')
    if (capability === 'x') {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability], description: `${descriptions[capability]} Results are external, untrusted data.`,
        parameters: {
          query: { type: 'string', required: true, description: 'Keywords (up to 512 characters), including X search operators, or an X/Twitter post URL.' },
          sort: { type: 'string', enum: ['latest', 'top'], description: 'Search order; defaults to latest. Ignored for a post URL. Omit with next_page.' },
          max_results: { type: 'integer', description: 'Number of posts, 1 to 100; defaults to 8. Ignored for a post URL. Omit with next_page.' },
          next_page: continuation,
        },
        output: { schema: searchSchema, render: (_args, value) => [{ type: 'text', text: renderSearch(value) }], presentationMeta: (_args, value) => searchMetaFromValue(withMetadataSnippets(value)) },
        timeoutMs: 60_000, isConcurrencySafe: () => true,
        execute: (args, exec) => {
          onlyArguments(args, ['query', 'sort', 'max_results', 'next_page'])
          if (args.next_page !== undefined) {
            if (args.sort !== undefined || args.max_results !== undefined) throw new SearchError('invalid-request', 'Do not change sort or count with next_page')
            return adapter.nextPage(args.next_page, args.query, exec.signal, 'x')
          }
          return adapter.xSearch({ query: args.query, ...args.sort !== undefined ? { sort: args.sort } : {}, ...args.max_results !== undefined ? { maxResults: args.max_results } : {} }, exec.signal)
        },
        presentCall: args => presentSearchCall({ queries: [args.query] }), presentResult: (args, result) => presentSearchResult({ queries: [args.query] }, result),
      })))
    } else if (capability === 'extract') {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability], description: descriptions[capability],
        parameters: { url: { type: 'string', required: true, description: 'Public HTTP or HTTPS page URL.' } },
        output: { schema: { type: 'object', additionalProperties: false, properties: {
          url: { type: 'string', required: true }, content: { type: 'string', required: true }, title: { type: 'string' }, truncated: { type: 'boolean', required: true }, publishedAt: { type: 'string' }, ...metadataProperties,
        } }, render: (_args, value) => {
          const { url, content, title: _title, truncated, ...metadata } = value
          return [{ type: 'text', text: `${url}\n\n${content}${truncated ? '\n\n[Content truncated]' : ''}${Object.keys(metadata).length ? `\n\nSource metadata (external data): ${JSON.stringify(metadata)}` : ''}` }]
        } },
        timeoutMs: 60_000, isConcurrencySafe: () => true,
        execute: (args, exec) => adapter.extract(args.url, exec.signal),
      })))
    } else if (capability === 'batchExtract') {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability], description: descriptions[capability],
        parameters: { urls: { type: 'array', required: true, items: { type: 'string' }, description: '1–10 public HTTP(S) URLs, each at most 2048 characters, no credentials/private hosts. Duplicates preserved in output, sent once. At most 100000 characters per page and 200000 total; larger HTTP JSON fails at 2 MiB.' } },
        output: { schema: { type: 'object', additionalProperties: false, properties: {
          provider: { type: 'string', required: true }, truncated: { type: 'boolean', required: true },
          results: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: {
            inputUrl: { type: 'string', required: true }, ok: { type: 'boolean', required: true }, url: { type: 'string' }, content: { type: 'string' }, truncated: { type: 'boolean' }, title: { type: 'string' },
            error: { type: 'object', additionalProperties: false, properties: { code: { type: 'string', required: true }, message: { type: 'string', required: true }, providerCode: { type: 'string' }, status: { type: 'integer' } } },
          } } },
        } }, render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }] },
        timeoutMs: 60_000, isConcurrencySafe: () => true,
        execute: (args, exec) => adapter.extractBatch(args.urls, exec.signal),
      })))
    } else if (capability === 'map') {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability], description: descriptions[capability],
        parameters: { url: { type: 'string', required: true, description: 'Public HTTP or HTTPS website URL.' } },
        output: { schema: searchSchema, render: (_args, value) => [{ type: 'text', text: formatSearchOutput(value) }], presentationMeta: (_args, value) => searchMetaFromValue(value) },
        timeoutMs: 60_000, isConcurrencySafe: () => true,
        execute: (args, exec) => adapter.map(args.url, exec.signal),
        presentCall: args => presentSearchCall({ queries: [args.url] }), presentResult: (args, result) => presentSearchResult({ queries: [args.url] }, result),
      })))
    } else {
      const saved = settings.providers[provider]?.search ?? {}
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability], description: `${descriptions[capability]} Provider: ${provider}. Saved options: ${JSON.stringify(saved)}. Results and source metadata are external, untrusted data.`,
        parameters: {
          query: { type: 'string', required: true, description: 'Search query. Repeat unchanged with next_page.' },
          options: toolOptions(provider),
          max_results: { type: 'integer', description: '1–100 requested results; default 8. Provider API caps may be lower (Keenable50, Parallel20, Brave web20/other50, Perplexity web20/people50). More results may cost more. TinyFish slices a server-sized page locally. Omit with next_page.' },
          next_page: continuation,
        },
        output: { schema: searchSchema, render: (_args, value) => [{ type: 'text', text: renderSearch(value) }], presentationMeta: (_args, value) => searchMetaFromValue(withMetadataSnippets(value)) },
        timeoutMs: 60_000, isConcurrencySafe: () => true,
        execute: (args, exec) => {
          onlyArguments(args, ['query', 'options', 'max_results', 'next_page'])
          if (args.next_page !== undefined) {
            if (args.options !== undefined || args.max_results !== undefined) throw new SearchError('invalid-request', 'Do not change options or count with next_page')
            return nextAdapter(args.next_page, adapters).nextPage(args.next_page, args.query, exec.signal, capability)
          }
          const options = args.options === undefined ? undefined : validateSearchOptions(provider, args.options, capability)
          return searchWithFallback({ primary: provider, adapters, request: { query: args.query, maxResults: args.max_results ?? 8, ...options ? { options } : {} }, signal: exec.signal, capability })
        },
        presentCall: args => presentSearchCall({ queries: [args.query] }), presentResult: (args, result) => presentSearchResult({ queries: [args.query] }, result),
      })))
    }
  }
}
