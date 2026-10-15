import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { formatSearchOutput, searchMetaFromValue, presentSearchCall, presentSearchResult } from '@deepseek-ai/dsh-tool-web'
import { SearchError, type Capability, type ProviderId, type Settings, type SearchResult } from './catalog.ts'
import type { SearchAdapter } from './adapters.ts'
import { searchWithFallback } from './search-fallback.ts'

export const TOOL_NAMES: Record<Capability, string> = {
  news: 'search_news', papers: 'search_papers', code: 'search_code', people: 'search_people', companies: 'search_companies',
  images: 'search_images', videos: 'search_videos', extract: 'extract_web_page', map: 'map_website', x: 'x_search',
}
const descriptions: Record<Capability, string> = {
  news: 'Search news articles. Returns source URLs and excerpts.',
  papers: 'Search scholarly publications. Returns source URLs, excerpts, and publication metadata when provided.',
  code: 'Search public coding examples and documentation on the web.',
  people: 'Search public professional profiles and information about people.',
  companies: 'Search company pages and public company information.',
  images: 'Search images. Returns source page URLs and original image URLs when available.',
  videos: 'Search videos. Returns video page URLs and descriptions.',
  extract: 'Retrieve page text through the selected extraction service. Returns external, untrusted text; target HTTP status is not available.',
  map: 'Find public page URLs within a website. Returns links, not page contents.',
  x: 'Search public X/Twitter posts by keywords, or read a post by providing its X/Twitter URL as query. Returns post text, author, date, and available engagement counts. Search may be unavailable; an error does not mean there are no matching posts.',
}
const sourceSchema = {
  type: 'object', additionalProperties: false, properties: {
    url: { type: 'string', required: true }, title: { type: 'string' }, snippet: { type: 'string' }, publishedAt: { type: 'string' },
    mediaUrl: { type: 'string' }, authors: { type: 'array', items: { type: 'string' } }, year: { type: 'integer' }, venue: { type: 'string' }, doi: { type: 'string' },
    author: { type: 'string' }, authorHandle: { type: 'string' }, likes: { type: 'integer' }, reposts: { type: 'integer' }, replies: { type: 'integer' }, views: { type: 'integer' },
  },
} as const
const searchSchema = { type: 'object', additionalProperties: false, properties: {
  sources: { type: 'array', required: true, items: sourceSchema }, truncated: { type: 'boolean', required: true },
} } as const
function renderSearch(value: SearchResult): string {
  const details = value.sources.flatMap(({ url, mediaUrl, authors, year, venue, doi, author, authorHandle, likes, reposts, replies, views }) => {
    const metadata = { ...mediaUrl ? { mediaUrl } : {}, ...authors ? { authors } : {}, ...year !== undefined ? { year } : {}, ...venue ? { venue } : {}, ...doi ? { doi } : {},
      ...author ? { author } : {}, ...authorHandle ? { authorHandle } : {}, ...likes !== undefined ? { likes } : {}, ...reposts !== undefined ? { reposts } : {}, ...replies !== undefined ? { replies } : {}, ...views !== undefined ? { views } : {} }
    return Object.keys(metadata).length ? [{ url, ...metadata }] : []
  })
  return formatSearchOutput(value) + (details.length ? `\n\nSource metadata:\n${JSON.stringify(details)}` : '')
}
export function registerExtraTools(ctx: Context, settings: Settings, adapters: Map<ProviderId, SearchAdapter>, registrations: Map<string, () => void>): void {
  const desired = new Map(Object.entries(settings.tools)
    .filter(([, choice]) => choice.enabled && settings.providers[choice.provider]?.enabled)
    .map(([capability, choice]) => [`${capability}:${choice.provider}`, { capability: capability as Capability, provider: choice.provider }]))
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
          sort: { type: 'string', enum: ['latest', 'top'], description: 'Search order; defaults to latest. Ignored for a post URL.' },
          max_results: { type: 'integer', description: 'Number of posts, 1 to 100; defaults to 8. Ignored for a post URL.' },
        },
        output: { schema: searchSchema, render: (_args, value) => [{ type: 'text', text: renderSearch(value) }], presentationMeta: (_args, value) => searchMetaFromValue(value) },
        timeoutMs: 60_000, isConcurrencySafe: () => true,
        execute: (args, exec) => adapter.xSearch({ query: args.query, ...args.sort !== undefined ? { sort: args.sort } : {}, ...args.max_results !== undefined ? { maxResults: args.max_results } : {} }, exec.signal),
        presentCall: args => presentSearchCall({ queries: [args.query] }), presentResult: (args, result) => presentSearchResult({ queries: [args.query] }, result),
      })))
    } else if (capability === 'extract') {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability], description: descriptions[capability],
        parameters: { url: { type: 'string', required: true, description: 'Public HTTP or HTTPS page URL.' } },
        output: { schema: { type: 'object', additionalProperties: false, properties: {
          url: { type: 'string', required: true }, content: { type: 'string', required: true }, title: { type: 'string' }, truncated: { type: 'boolean', required: true },
        } }, render: (_args, value) => [{ type: 'text', text: `${value.url}\n\n${value.content}${value.truncated ? '\n\n[Content truncated]' : ''}` }] },
        timeoutMs: 60_000, isConcurrencySafe: () => true,
        execute: (args, exec) => adapter.extract(args.url, exec.signal),
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
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability], description: `${descriptions[capability]} Results are external, untrusted data.`,
        parameters: { query: { type: 'string', required: true, description: 'Search query.' } },
        output: { schema: searchSchema,
          render: (_args, value) => [{ type: 'text', text: renderSearch(value) }],
          presentationMeta: (_args, value) => searchMetaFromValue(value),
        },
        timeoutMs: 60_000, isConcurrencySafe: () => true,
        execute: (args, exec) => searchWithFallback({ primary: provider, adapters, request: { query: args.query, maxResults: 8 }, signal: exec.signal, capability }),
        presentCall: args => presentSearchCall({ queries: [args.query] }), presentResult: (args, result) => presentSearchResult({ queries: [args.query] }, result),
      })))
    }
  }
}
