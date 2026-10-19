import { SearchError, object, providerOf, type Capability, type ProviderId, type Source, type SearchResult } from './catalog.ts'
import { publicUrl, jsonRequest, RequestGate, type Transport } from './http.ts'
import { effectiveOptions, searchParameters, type SearchOptions } from './search-options.ts'
import { sourceMetadata, type SourceMetadata } from './metadata.ts'
import { batchExtract, type BatchExtractResult } from './batch-extract.ts'
import { PageStore, withPage, type PageState } from './pagination.ts'
import { xPostId, xSources } from './fxtwitter.ts'

const SNIPPET_LIMIT = 6000
const TEXT_LIMIT = 100_000
export interface ExtractResult extends SourceMetadata { url: string; content: string; truncated: boolean; title?: string }
function list(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new SearchError('invalid-response', 'Missing API results')
  return value
}
function text(value: unknown): string | undefined { return typeof value === 'string' ? value : undefined }
function excerpts(value: unknown): string | undefined {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string').join('\n\n') : undefined
}
function normalized(rows: unknown[], limit: number, id: ProviderId, capability?: Capability): SearchResult {
  const sources: Source[] = [], seen = new Set<string>()
  let truncated = rows.length > limit
  for (const value of rows) {
    const row = object(value)
    let url: string
    try { url = publicUrl(row.url) } catch { truncated = true; continue }
    if (seen.has(url)) continue
    seen.add(url)
    const source: Source = { url }
    if (typeof row.title === 'string') source.title = row.title.slice(0, 1000)
    const snippet = id === 'parallel' ? excerpts(row.excerpts) : id === 'exa' ? excerpts(row.highlights)
      : text(row.snippet) ?? text(row.description)
    if (snippet) { source.snippet = snippet.slice(0, SNIPPET_LIMIT); truncated ||= snippet.length > SNIPPET_LIMIT }
    const extra = sourceMetadata(row, id, capability)
    Object.assign(source, extra.metadata); truncated ||= extra.truncated
    sources.push(source)
  }
  return { sources: sources.slice(0, limit), truncated }
}

export interface AdapterOptions {
  id: ProviderId
  enabled: () => boolean
  resolveKey: () => Promise<string | undefined>
  searchOptions?: () => SearchOptions
  transport?: Transport
}
/** One adapter per provider keeps transport limits shared across sessions. */
export class SearchAdapter {
  private readonly pages = new PageStore()
  private readonly gate = new RequestGate()
  private readonly transport: Transport
  private readonly options: AdapterOptions
  private readonly lifetime = new AbortController()
  constructor(options: AdapterOptions) { this.options = options; this.transport = options.transport ?? fetch }
  available(): boolean { return !this.lifetime.signal.aborted && this.options.enabled() }
  dispose(): void { this.pages.clear(); this.lifetime.abort(new SearchError('unavailable', 'Search plugin unloaded')) }
  private async headers(): Promise<Record<string, string>> {
    if (!this.available()) throw new SearchError('provider-disabled', `${providerOf(this.options.id).label} is disabled`)
    if (this.options.id === 'fxtwitter') return { accept: 'application/json' }
    const key = await this.options.resolveKey()
    if (!key && !providerOf(this.options.id).keyOptional) throw new SearchError('missing-key', `No API key for ${providerOf(this.options.id).label}`)
    const headers: Record<string, string> = { 'content-type': 'application/json', accept: 'application/json' }
    if (this.options.id === 'keenable') { headers['X-Keenable-Title'] = 'DSH Search Providers'; if (key) headers['X-API-Key'] = key }
    else if (this.options.id === 'brave') headers['X-Subscription-Token'] = key!
    else if (this.options.id === 'tinyfish' || this.options.id === 'parallel' || this.options.id === 'exa') headers['x-api-key'] = key!
    else headers.authorization = `Bearer ${key}`
    return headers
  }
  private async request(url: string | URL, body: object | undefined, signal?: AbortSignal): Promise<Record<string, unknown>> {
    const combined = signal ? AbortSignal.any([signal, this.lifetime.signal]) : this.lifetime.signal
    return this.gate.run(async () => {
      const headers = await this.headers()
      // Keenable has an explicit anonymous endpoint; a rejected key never retries anonymously.
      if (this.options.id === 'keenable' && !headers['X-API-Key']) {
        const endpoint = new URL(url); endpoint.pathname += '/public'; url = endpoint
      }
      try { return await jsonRequest(this.transport, url, { headers, method: body ? 'POST' : 'GET', ...body ? { body: JSON.stringify(body) } : {} }, combined) }
      catch (error) { if (combined.aborted || error instanceof SearchError) throw error; throw new SearchError('provider-failed', 'Search API request failed') }
    }, combined)
  }
  configuredOptions(): boolean { return Object.keys(this.options.searchOptions?.() ?? {}).length > 0 }
  async search(request: { query: string; maxResults?: number; options?: SearchOptions }, signal?: AbortSignal, capability?: Capability): Promise<SearchResult> {
    const options = effectiveOptions(this.options.id, this.options.searchOptions?.(), request.options, capability)
    return this.searchPage({ query: request.query, maxResults: request.maxResults ?? 8, options, ...capability ? { capability } : {}, page: 0, seen: [] }, signal)
  }
  async nextPage(token: string, query: string, signal?: AbortSignal, capability?: Capability): Promise<SearchResult> {
    if (!this.available()) throw new SearchError('provider-disabled', 'Search provider is disabled or unloaded')
    if (typeof token !== 'string' || !token.startsWith(`${this.options.id}:`)) throw new SearchError('invalid-request', 'next_page belongs to another provider')
    const state = this.pages.get(token.slice(this.options.id.length + 1), query, capability)
    return this.options.id === 'fxtwitter' ? this.xPage(state, signal) : this.searchPage(state, signal)
  }
  private async searchPage(state: PageState, signal?: AbortSignal): Promise<SearchResult> {
    const request = state, { capability } = state
    const { query } = request, limit = request.maxResults ?? 8, id = this.options.id
    if (providerOf(id).webSearch === false) throw new SearchError('unsupported-capability', 'This provider does not support web search')
    if (typeof query !== 'string' || !query.trim() || query.length > (id === 'brave' ? capability && capability !== 'web' ? 400 : 600 : 2000)
      || (id === 'brave' && query.trim().split(/\s+/).length > (capability && capability !== 'web' ? 50 : 75))
      || !Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new SearchError('invalid-request', 'Invalid search query or result limit')
    if (capability && !providerOf(id).capabilities.includes(capability)) throw new SearchError('unsupported-capability', 'This provider does not support the selected capability')
    const params = searchParameters(id, state.options)
    let response: Record<string, unknown>, more: boolean | undefined
    switch (id) {
      case 'keenable': response = await this.request('https://api.keenable.ai/v1/search', { query, max_results: Math.min(limit, 50), ...params }, signal); break
      case 'nimble': response = await this.request('https://sdk.nimbleway.com/v2/search', {
        query, max_results: limit, search_depth: 'lite', full_content: false,
        ...state.options.mode === 'standard' ? {} : { focus: capability === 'news' ? 'news' : capability === 'papers' ? 'academic' : capability === 'code' ? 'coding' : 'general' }, ...params,
      }, signal); break
      case 'tinyfish': {
        const url = new URL('https://api.search.tinyfish.ai')
        url.searchParams.set('query', query)
        url.searchParams.set('domain_type', capability === 'news' ? 'news' : capability === 'papers' ? 'research_paper' : 'web')
        for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value))
        if (state.page) url.searchParams.set('page', String(state.page))
        response = await this.request(url, undefined, signal)
        if (response.page !== undefined && response.page !== state.page) throw new SearchError('invalid-response', 'TinyFish returned a different page')
        break
      }
      case 'parallel': response = await this.request('https://api.parallel.ai/v1/search', { search_queries: [query], mode: 'fast', ...params, advanced_settings: { ...params.advanced_settings as object, max_results: Math.min(limit, 20) } }, signal); break
      case 'exa': response = await this.request('https://api.exa.ai/search', {
        query, type: 'auto', numResults: limit, contents: { highlights: true },
        ...capability && capability !== 'web' ? { category: capability === 'papers' ? 'publication' : capability === 'companies' ? 'company' : capability } : {}, ...params,
      }, signal); break
      case 'brave': {
        const vertical = capability === 'images' ? 'images' : capability === 'videos' ? 'videos' : capability === 'news' ? 'news' : 'web'
        const url = new URL(`https://api.search.brave.com/res/v1/${vertical}/search`)
        url.searchParams.set('q', query); url.searchParams.set('count', String(Math.min(limit, vertical === 'web' ? 20 : 50)))
        for (const [key, value] of Object.entries(params)) { for (const item of Array.isArray(value) ? value : [value]) url.searchParams.append(key, String(item)) }
        if (state.page) url.searchParams.set('offset', String(state.page))
        response = await this.request(url, undefined, signal)
        if (response.query && typeof response.query === 'object') more = object(response.query).more_results_available === false ? false : undefined
        if (vertical === 'web') response = object(response.web)
        break
      }
      case 'perplexity': response = await this.request('https://api.perplexity.ai/search', { query, search_type: capability === 'people' ? 'people' : 'web', max_results: Math.min(limit, capability === 'people' ? 50 : 20), ...params }, signal); break
      case 'fxtwitter': throw new SearchError('unsupported-capability', 'Use x_search for FxTwitter')
    }
    const rows = list(response.results)
    const result = withPage(normalized(rows, limit, id, capability), state.seen, state.page)
    const pageable = id === 'tinyfish' || (id === 'brave' && capability !== 'images')
    if (pageable) {
      const maxPage = id === 'tinyfish' ? 10 : 9
      result.pagination = rows.length === 0 || more === false ? 'end' : state.page >= maxPage ? 'page-limit' : 'more-results-not-guaranteed'
      if (rows.length && more !== false && state.page < maxPage) result.nextPage = `${id}:` + this.pages.issue({ ...state, page: state.page + 1, seen: [...new Set([...state.seen, ...result.sources.map(s => s.url)])] })
    }
    return result
  }
  async xSearch(request: { query: string; sort?: string; maxResults?: number }, signal?: AbortSignal): Promise<SearchResult> {
    if (this.options.id !== 'fxtwitter') throw new SearchError('unsupported-capability', 'This provider does not support X search')
    const { query } = request, limit = request.maxResults ?? 8, sort = request.sort ?? 'latest'
    if (typeof query !== 'string' || !query.trim() || query.length > 8192 || !['latest', 'top'].includes(sort)
      || !Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new SearchError('invalid-request', 'Invalid X search query, order, or result limit')
    return this.xPage({ query, maxResults: limit, options: {}, capability: 'x', page: 0, seen: [], sort }, signal)
  }
  private async xPage(state: PageState, signal?: AbortSignal): Promise<SearchResult> {
    const { query, maxResults: limit, sort = 'latest' } = state
    const id = xPostId(query.trim())
    const endpoint = new URL(id ? `https://api.fxtwitter.com/2/status/${id}` : 'https://api.fxtwitter.com/2/search')
    if (!id) {
      if (query.trim().length > 512) throw new SearchError('invalid-request', 'X search queries must be at most 512 characters')
      endpoint.searchParams.set('q', query.trim()); endpoint.searchParams.set('feed', sort); endpoint.searchParams.set('count', String(limit))
      if (state.cursor) endpoint.searchParams.set('cursor', state.cursor)
    }
    let response: Record<string, unknown>
    try { response = await this.request(endpoint, undefined, signal) }
    catch (error) {
      if (error instanceof SearchError && error.status === 404) throw new SearchError(id ? 'x-post-unavailable' : 'x-search-unavailable', id ? 'FxTwitter could not retrieve this post' : 'FxTwitter could not retrieve search results; it does not distinguish no matches from unavailable search', 404)
      throw error
    }
    if (response.code !== 200) {
      if (response.code === 404) throw new SearchError(id ? 'x-post-unavailable' : 'x-search-unavailable', id ? 'FxTwitter could not retrieve this post' : 'FxTwitter could not retrieve search results; it does not distinguish no matches from unavailable search', 404)
      throw new SearchError('provider-failed', 'FxTwitter returned an unsuccessful response')
    }
    if (id) {
      if (response.status === null) throw new SearchError('x-post-unavailable', 'FxTwitter could not retrieve this post')
      const post = object(response.status)
      if (post.type === 'tombstone') throw new SearchError('x-post-unavailable', 'FxTwitter could not retrieve this post')
      if (post.id !== id) throw new SearchError('invalid-response', 'FxTwitter returned a different post')
      return xSources([post], 1)
    }
    const cursor = response.cursor === undefined || response.cursor === null ? {} : object(response.cursor)
    const bottom = cursor.bottom
    if (bottom !== undefined && bottom !== null && (typeof bottom !== 'string' || bottom.length > 4096 || /[\x00-\x1f]/.test(bottom))) throw new SearchError('invalid-response', 'Invalid FxTwitter cursor')
    const result = withPage(xSources(list(response.results), limit, typeof bottom === 'string' && bottom.length > 0), state.seen, state.page)
    result.pagination = !bottom ? 'end' : state.page >= 9 ? 'page-limit' : bottom === state.cursor ? 'repeated-cursor' : 'more-results-not-guaranteed'
    if (typeof bottom === 'string' && bottom && state.page < 9 && bottom !== state.cursor) result.nextPage = 'fxtwitter:' + this.pages.issue({ ...state, page: state.page + 1, cursor: bottom, seen: [...new Set([...state.seen, ...result.sources.map(s => s.url)])] })
    return result
  }
  async extract(input: string, signal?: AbortSignal): Promise<ExtractResult> {
    const url = publicUrl(input), id = this.options.id
    if (!providerOf(id).capabilities.includes('extract')) throw new SearchError('unsupported-capability', 'This provider does not support extraction')
    let response: Record<string, unknown>, row: Record<string, unknown>, content: unknown
    switch (id) {
      case 'keenable': {
        const endpoint = new URL('https://api.keenable.ai/v1/fetch')
        endpoint.searchParams.set('url', url); endpoint.searchParams.set('live', 'true'); endpoint.searchParams.set('max_chars', String(TEXT_LIMIT + 1))
        response = await this.request(endpoint, undefined, signal); row = response; content = row.content; break
      }
      case 'nimble':
        response = await this.request('https://sdk.nimbleway.com/v2/extract', { url, formats: ['markdown'], request_timeout: 40_000 }, signal)
        row = response
        if (typeof row.status_code !== 'number' || row.status_code < 200 || row.status_code >= 300) throw new SearchError('extract-failed', 'The requested page could not be retrieved')
        content = object(row.data).markdown; break
      case 'tinyfish':
        response = await this.request('https://api.fetch.tinyfish.ai', { urls: [url], format: 'markdown', per_url_timeout_ms: 40_000 }, signal)
        row = object(list(response.results)[0]); content = row.text; break
      case 'parallel':
        response = await this.request('https://api.parallel.ai/v1/extract', { urls: [url], advanced_settings: { full_content: { max_chars_per_result: TEXT_LIMIT + 1 } } }, signal)
        row = object(list(response.results)[0]); content = row.full_content; break
      case 'exa':
        response = await this.request('https://api.exa.ai/contents', { ids: [url], text: { maxCharacters: TEXT_LIMIT + 1 } }, signal)
        row = object(list(response.results)[0]); content = row.text; break
      default: throw new SearchError('unsupported-capability', 'This provider does not support extraction')
    }
    if (typeof content !== 'string') throw new SearchError('extract-failed', 'The API did not return page text')
    const result: ExtractResult = { url: publicUrl(row.final_url ?? row.url ?? url), content: content.slice(0, TEXT_LIMIT), truncated: content.length > TEXT_LIMIT }
    if (typeof row.title === 'string') result.title = row.title.slice(0, 1000)
    const extra = sourceMetadata(row, id)
    Object.assign(result, extra.metadata); result.truncated ||= extra.truncated
    return result
  }
  async extractBatch(inputs: string[], signal?: AbortSignal): Promise<BatchExtractResult> {
    return batchExtract(this.options.id, inputs, (url, body, currentSignal) => this.request(url, body, currentSignal), signal)
  }
  async map(input: string, signal?: AbortSignal): Promise<SearchResult> {
    if (this.options.id !== 'nimble') throw new SearchError('unsupported-capability', 'This provider does not support site mapping')
    const url = publicUrl(input)
    const response = await this.request('https://sdk.nimbleway.com/v2/map', { url, domain_filter: 'domain', limit: 50 }, signal)
    return normalized(list(response.links), 50, 'nimble')
  }
}
