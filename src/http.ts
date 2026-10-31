import { SearchError, object } from './catalog.ts'

export function httpUrl(value: unknown): string {
  if (typeof value !== 'string' || value.length > 8192) throw new SearchError('invalid-request', 'Invalid URL')
  let url: URL
  try { url = new URL(value) } catch { throw new SearchError('invalid-request', 'Invalid URL') }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new SearchError('invalid-request', 'Expected an HTTP URL without credentials')
  return url.href
}
const LOCAL_SUFFIXES = ['.local', '.localhost', '.internal', '.lan', '.home']
// These names encode an address in the labels. A private address there is still a private target.
const ADDRESS_DNS = ['.nip.io', '.sslip.io', '.xip.io']
function ipv4(host: string): [number, number, number, number] | undefined {
  const parts = host.split('.')
  if (parts.length !== 4) return
  const octets = parts.map(part => /^(?:0|[1-9]\d{0,2})$/.test(part) ? Number(part) : Number.NaN)
  if (octets.some(octet => !Number.isInteger(octet) || octet > 255)) return
  return [octets[0]!, octets[1]!, octets[2]!, octets[3]!]
}
function privateIPv4(host: string): boolean {
  const octets = ipv4(host)
  if (!octets) return false
  const a = octets[0], b = octets[1]
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 192 && b === 168)
    || (a === 172 && b >= 16 && b <= 31) || (a === 100 && b >= 64 && b <= 127)
    || (a === 198 && (b === 18 || b === 19)) || a >= 224
}
function embeddedPrivateAddress(host: string): boolean {
  if (!ADDRESS_DNS.some(suffix => host.endsWith(suffix))) return false
  const labels = host.split('.')
  for (let index = 0; index + 3 < labels.length; index++) if (privateIPv4(labels.slice(index, index + 4).join('.'))) return true
  return false
}
// A remote extractor must not be asked to read loopback, local names, or cloud metadata.
// Private ranges apply to a canonical IPv4 hostname. A public name that merely starts with the same digits is not an address.
export function publicUrl(value: unknown): string {
  const parsed = new URL(httpUrl(value)), host = parsed.hostname.toLowerCase().replace(/\.$/, '')
  if (!host.includes('.') || LOCAL_SUFFIXES.some(suffix => host.endsWith(suffix)) || host === 'localhost'
    || host.includes(':') || privateIPv4(host) || embeddedPrivateAddress(host)) throw new SearchError('blocked-url', 'Expected a public web URL')
  return parsed.href
}
export type Transport = (url: string | URL, init?: RequestInit) => Promise<Response>
export const MAX_RESPONSE_BYTES = 2 * 1024 * 1024
function rethrowTransport(error: unknown, caller: AbortSignal | undefined, deadline: AbortSignal): never {
  if (error instanceof SearchError || caller?.aborted) throw error
  if (deadline.aborted || error instanceof Error && error.name === 'TimeoutError') throw new SearchError('timeout', 'Search API request timed out')
  throw error
}
export async function jsonRequest(transport: Transport, url: string | URL, init: RequestInit, signal?: AbortSignal): Promise<Record<string, unknown>> {
  const deadline = AbortSignal.timeout(45_000)
  const combined = signal ? AbortSignal.any([signal, deadline]) : deadline
  try {
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
  } catch (error) { rethrowTransport(error, signal, deadline) }
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
    let released = false
    const release = () => {
      if (released) return
      released = true
      const next = this.queue.shift()
      if (next) { next.signal?.removeEventListener('abort', next.abort); next.resolve() }
      else this.active--
    }
    const onAbort = () => release()
    signal?.addEventListener('abort', onAbort, { once: true })
    try {
      signal?.throwIfAborted()
      return await operation()
    } finally {
      signal?.removeEventListener('abort', onAbort)
      release()
    }
  }
}
