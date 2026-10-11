import { SearchError, object } from './catalog.ts'

export function httpUrl(value: unknown): string {
  if (typeof value !== 'string' || value.length > 8192) throw new SearchError('invalid-request', 'Invalid URL')
  let url: URL
  try { url = new URL(value) } catch { throw new SearchError('invalid-request', 'Invalid URL') }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new SearchError('invalid-request', 'Expected an HTTP URL without credentials')
  return url.href
}
// A remote extractor must not be asked to read loopback, local names, or cloud metadata.
export function publicUrl(value: unknown): string {
  const parsed = new URL(httpUrl(value)), host = parsed.hostname.toLowerCase().replace(/\.$/, '')
  if (!host.includes('.') || ['.local', '.localhost', '.internal', '.lan', '.home'].some(suffix => host.endsWith(suffix)) || host === 'localhost'
    || host.includes(':') || /^(?:0|10|127)\./.test(host) || /^169\.254\./.test(host)
    || /^192\.168\./.test(host) || /^172\.(?:1[6-9]|2\d|3[01])\./.test(host)
    || /^100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(host) || /^198\.(?:18|19)\./.test(host)
    || /^(?:22[4-9]|23\d|24\d|25[0-5])\./.test(host)) throw new SearchError('blocked-url', 'Expected a public web URL')
  return parsed.href
}
export type Transport = (url: string | URL, init?: RequestInit) => Promise<Response>
export const MAX_RESPONSE_BYTES = 2 * 1024 * 1024
export async function jsonRequest(transport: Transport, url: string | URL, init: RequestInit, signal?: AbortSignal): Promise<Record<string, unknown>> {
  const deadline = AbortSignal.timeout(45_000)
  const combined = signal ? AbortSignal.any([signal, deadline]) : deadline
  combined.throwIfAborted()
  const response = await transport(url, { ...init, redirect: 'error', signal: combined })
  if (!response.ok) {
    await response.body?.cancel()
    throw new SearchError(response.status === 429 ? 'rate-limited' : response.status === 401 || response.status === 403 ? 'authentication-failed' : 'provider-failed', `Search API returned HTTP ${response.status}`, response.status)
  }
  if (!response.body) throw new SearchError('invalid-response', 'Empty API response')
  const reader = response.body.getReader(), chunks: Uint8Array[] = []
  let length = 0
  try {
    while (true) {
      combined.throwIfAborted()
      const { done, value } = await reader.read()
      if (done) break
      length += value.length
      if (length > MAX_RESPONSE_BYTES) throw new SearchError('response-too-large', 'Search API response exceeds the size limit')
      chunks.push(value)
    }
  } catch (error) { await reader.cancel().catch(() => {}); throw error } finally { reader.releaseLock() }
  combined.throwIfAborted()
  try { return object(JSON.parse(Buffer.concat(chunks).toString('utf8'))) }
  catch (error) { if (error instanceof SearchError) throw error; throw new SearchError('invalid-response', 'Invalid JSON response') }
}
/** Shared by concurrent sessions. Cancellation removes queued work before it sends a request. */
export class RequestGate {
  private active = 0
  private readonly queue: { resolve(): void; signal?: AbortSignal; abort(): void }[] = []
  constructor(limit = 4) {
    if (!Number.isSafeInteger(limit) || limit < 1) throw new Error('Invalid request concurrency limit')
    this.limit = limit
  }
  private readonly limit: number
  async run<T>(operation: () => Promise<T>, signal?: AbortSignal): Promise<T> {
    signal?.throwIfAborted()
    if (this.active >= this.limit) await new Promise<void>((resolve, reject) => {
      const ticket = { resolve, ...signal ? { signal } : {}, abort: () => {
        const index = this.queue.indexOf(ticket)
        if (index !== -1) this.queue.splice(index, 1)
        reject(signal?.reason)
      } }
      this.queue.push(ticket); signal?.addEventListener('abort', ticket.abort, { once: true })
    })
    else this.active++
    try {
      signal?.throwIfAborted()
      return await operation()
    } finally {
      const next = this.queue.shift()
      if (next) { next.signal?.removeEventListener('abort', next.abort); next.resolve() }
      else this.active--
    }
  }
}
