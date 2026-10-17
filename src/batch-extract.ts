import { SearchError, object, type ProviderId } from './catalog.ts'
import { publicUrl } from './http.ts'

/** Official request maxima: TinyFish 10, Parallel 20, Exa 100 (2026-10-18).
 * Use ten everywhere to bound tool output and URL-based costs, not API capacity.
 * The injected adapter request still enforces its shared gate, lifetime and 2 MiB HTTP limit.
 */
export const BATCH_LIMITS = Object.freeze({
  maxUrls: 10,
  providerMaxUrls: Object.freeze({ tinyfish: 10, parallel: 20, exa: 100 }),
  maxUrlLength: 2048,
  maxCharsPerPage: 100_000,
  maxCharsTotal: 200_000,
})
export interface BatchExtractError { code: string; message: string; providerCode?: string; status?: number }
export interface BatchExtractSuccess { inputUrl: string; ok: true; url: string; content: string; truncated: boolean; title?: string }
export interface BatchExtractFailure { inputUrl: string; ok: false; error: BatchExtractError }
export type BatchExtractItem = BatchExtractSuccess | BatchExtractFailure
export interface BatchExtractResult { provider: ProviderId; results: BatchExtractItem[]; truncated: boolean }

type Row = Record<string, unknown>
type Page = { ok: true; url: string; content: string; title?: string } | { ok: false; error: BatchExtractError }
type Request = (url: string | URL, body: object | undefined, signal?: AbortSignal) => Promise<Record<string, unknown>>

function rows(value: unknown): Row[] {
  if (!Array.isArray(value)) throw new SearchError('invalid-response', 'Missing batch API results or errors')
  return value.map(object)
}
function failure(code: string, message: string): Page { return { ok: false, error: { code, message } } }
function providerFailure(code: unknown, status: unknown): Page {
  const error: BatchExtractError = { code: 'extract-failed', message: 'The provider could not extract this page' }
  // Do not forward upstream messages, error-page content or arbitrary error objects.
  if (typeof code === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(code)) error.providerCode = code
  if (typeof status === 'number' && Number.isInteger(status) && status >= 100 && status <= 599) error.status = status
  return { ok: false, error }
}
function key(value: unknown): string | undefined {
  try { return publicUrl(value) } catch { return undefined }
}
function group(entries: Row[], identity: (row: Row) => string | undefined): Map<string, Row[]> {
  const grouped = new Map<string, Row[]>()
  for (const row of entries) {
    const id = identity(row)
    if (id !== undefined) grouped.set(id, [...grouped.get(id) ?? [], row])
  }
  return grouped
}
function page(row: Row, content: unknown, finalUrl: unknown): Page {
  let url: string
  try { url = publicUrl(finalUrl) } catch { return failure('invalid-response', 'The provider returned an unsafe or invalid final URL') }
  if (typeof content !== 'string' || !content.trim()) return failure('extract-failed', 'The provider did not return page text')
  return { ok: true, url, content, ...typeof row.title === 'string' ? { title: row.title.slice(0, 1000) } : {} }
}
function normalize(provider: 'tinyfish' | 'parallel' | 'exa', response: Row, urls: string[]): Map<string, Page> {
  const requested = new Set(urls)
  const resultRows = rows(response.results)
  // Exa's published schema permits omitted statuses; an explicit null/non-array is malformed.
  const errorRows = rows(provider === 'exa' ? response.statuses === undefined ? [] : response.statuses : response.errors)
  // A response may omit entries, but cannot legitimately return more than one per unique request.
  if (resultRows.length > urls.length || errorRows.length > urls.length) throw new SearchError('invalid-response', 'Too many batch API entries')
  const results = group(resultRows, row => {
    // Exa IDs can be opaque document IDs; only URL IDs matching an input prove association.
    const id = provider === 'exa' ? key(row.id) : undefined
    return id && requested.has(id) ? id : key(row.url)
  })
  const errors = group(errorRows, row => key(provider === 'exa' ? row.id : row.url))
  const pages = new Map<string, Page>()
  for (const url of urls) {
    const matches = results.get(url) ?? [], statuses = errors.get(url) ?? []
    let value: Page
    if (matches.length > 1 || statuses.length > 1 || (provider !== 'exa' && matches.length && statuses.length)) {
      value = failure('invalid-response', 'The provider returned ambiguous entries for this URL')
    } else if (provider === 'exa') {
      const status = statuses[0]
      if (!status) value = matches[0] ? page(matches[0], matches[0].text, matches[0].url) : failure('invalid-response', 'The provider omitted the result for this URL')
      else if (status.status !== 'success' && status.status !== 'error') value = failure('invalid-response', 'The provider did not return a valid status for this URL')
      else if (status.status === 'error') {
        const error = status.error && typeof status.error === 'object' && !Array.isArray(status.error) ? status.error as Row : {}
        value = providerFailure(error.tag, error.httpStatusCode)
      } else if (status.error !== undefined && status.error !== null) value = failure('invalid-response', 'The provider returned conflicting status information')
      else if (!matches[0]) value = failure('invalid-response', 'The provider omitted the result for this URL')
      else value = page(matches[0], matches[0].text, matches[0].url)
    } else if (statuses[0]) {
      const error = statuses[0]
      value = providerFailure(provider === 'tinyfish' ? error.error : error.error_type, provider === 'tinyfish' ? error.status : error.http_status_code)
    } else if (!matches[0]) value = failure('invalid-response', 'The provider omitted the result for this URL')
    else {
      const row = matches[0]
      if (row.error !== undefined && row.error !== null) value = providerFailure(row.error, row.status)
      else value = page(row, provider === 'tinyfish' ? row.text : row.full_content, provider === 'tinyfish' ? row.final_url ?? row.url : row.url)
    }
    pages.set(url, value)
  }
  return pages
}

/** One provider batch request; no fallback, retry, per-URL fanout, or single-extract changes. */
export async function batchExtract(provider: ProviderId, inputs: string[], request: Request, signal?: AbortSignal): Promise<BatchExtractResult> {
  signal?.throwIfAborted()
  if (provider !== 'tinyfish' && provider !== 'parallel' && provider !== 'exa') throw new SearchError('unsupported-capability', 'This provider does not support batch extraction')
  if (!Array.isArray(inputs) || inputs.length < 1 || inputs.length > BATCH_LIMITS.maxUrls) throw new SearchError('invalid-request', `Batch extraction requires 1–${BATCH_LIMITS.maxUrls} URLs`)
  // Validate every input before any request, including duplicates and later entries.
  const originalInputs = Array.from(inputs)
  const validated = originalInputs.map(input => {
    const url = publicUrl(input)
    if (input.length > BATCH_LIMITS.maxUrlLength || url.length > BATCH_LIMITS.maxUrlLength) throw new SearchError('invalid-request', 'Batch URLs must be at most 2048 characters')
    return url
  })
  const urls = [...new Set(validated)]
  const perPage = BATCH_LIMITS.maxCharsPerPage + 1
  const endpoint = provider === 'tinyfish' ? 'https://api.fetch.tinyfish.ai' : provider === 'parallel' ? 'https://api.parallel.ai/v1/extract' : 'https://api.exa.ai/contents'
  const body = provider === 'tinyfish' ? { urls, format: 'markdown', per_url_timeout_ms: 40_000 }
    : provider === 'parallel' ? { urls, advanced_settings: { full_content: { max_chars_per_result: perPage } } }
      : { urls, text: { maxCharacters: perPage } }
  signal?.throwIfAborted()
  const response = await request(endpoint, body, signal)
  signal?.throwIfAborted()
  const pages = normalize(provider, object(response), urls)
  let remaining = BATCH_LIMITS.maxCharsTotal
  const results: BatchExtractItem[] = validated.map((url, index) => {
    const value = pages.get(url)!, inputUrl = originalInputs[index]!
    if (!value.ok) return { inputUrl, ok: false, error: { ...value.error } }
    // Duplicate expansions count toward the total output budget too.
    const content = value.content.slice(0, Math.min(BATCH_LIMITS.maxCharsPerPage, remaining))
    remaining -= content.length
    return { inputUrl, ok: true, url: value.url, content, truncated: content.length < value.content.length, ...value.title !== undefined ? { title: value.title } : {} }
  })
  return { provider, results, truncated: results.some(result => result.ok && result.truncated) }
}
