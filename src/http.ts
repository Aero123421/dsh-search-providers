import { SearchError, object } from './catalog.ts'

export function httpUrl(value: unknown): string {
  // WHATWG strips tabs and newlines before parsing, and turns "\" into "/". Reject both so a second parser cannot retarget the host.
  if (typeof value !== 'string' || value.length > 8192 || /[\\\u0000-\u001f\u007f]/.test(value)) throw new SearchError('invalid-request', 'Invalid URL')
  let url: URL
  try { url = new URL(value) } catch { throw new SearchError('invalid-request', 'Invalid URL') }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new SearchError('invalid-request', 'Expected an HTTP URL without credentials')
  return url.href
}
const BLOCKED_SUFFIXES = ['.local', '.localhost', '.internal', '.lan', '.home', '.home.arpa', '.localdomain', '.localtest.me', '.lvh.me']
const BLOCKED_NAMES = new Set(['localhost', 'localtest.me', 'lvh.me', 'home.arpa', 'localdomain'])
function blockedIPv4(address: string): boolean {
  return /^(?:0|10|127)\./.test(address) || /^169\.254\./.test(address)
    || /^192\.168\./.test(address) || /^172\.(?:1[6-9]|2\d|3[01])\./.test(address)
    || /^100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(address) || /^198\.(?:18|19)\./.test(address)
    || /^(?:22[4-9]|23\d|24\d|25[0-5])\./.test(address)
}
function blockedQuad(parts: readonly string[]): boolean {
  if (parts.length !== 4 || parts.some(part => !/^\d{1,3}$/.test(part) || Number(part) > 255)) return false
  // Leading zeros are octal in some resolvers (0177.0.0.1 is 127.0.0.1).
  if (parts.some(part => part.length > 1 && part.startsWith('0'))) return true
  return blockedIPv4(parts.map(part => String(Number(part))).join('.'))
}
function blockedSslipIPv6(label: string): boolean {
  // sslip.io writes IPv6 by turning ":" into "-" and "::" into "--".
  if (!label.includes('--') || label.split('--').length !== 2 || !/^[0-9a-f-]+$/i.test(label)) return false
  const candidate = label.replace('--', '\0').replaceAll('-', ':').replaceAll('\0', '::')
  let bare: string
  try {
    const host = new URL(`http://[${candidate}]`).hostname
    if (!host.startsWith('[') || !host.endsWith(']')) return false
    bare = host.slice(1, -1).toLowerCase()
  } catch { return false }
  if (bare === '::' || bare === '::1') return true
  const mapped = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i.exec(bare)
  if (mapped) {
    const hi = Number.parseInt(mapped[1] ?? '', 16), lo = Number.parseInt(mapped[2] ?? '', 16)
    return blockedIPv4(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`)
  }
  const first = bare.split(':')[0]
  if (!first) return false
  const value = Number.parseInt(first, 16)
  if (!Number.isFinite(value)) return false
  // fe80::/10, fc00::/7, fec0::/10, ff00::/8.
  return (value & 0xffc0) === 0xfe80 || (value & 0xfe00) === 0xfc00 || (value & 0xffc0) === 0xfec0 || (value & 0xff00) === 0xff00
}
function embeddedBlockedAddress(host: string): boolean {
  const labels = host.split('.')
  for (let index = 0; index + 3 < labels.length; index++) if (blockedQuad(labels.slice(index, index + 4))) return true
  for (const label of labels) {
    if (blockedSslipIPv6(label)) return true
    for (const match of label.matchAll(/(?:^|-)(\d{1,3})-(\d{1,3})-(\d{1,3})-(\d{1,3})(?=-|$)/g)) {
      if (blockedQuad([match[1] ?? '', match[2] ?? '', match[3] ?? '', match[4] ?? ''])) return true
    }
  }
  return false
}
// A remote extractor must not be asked to read loopback, local names, or cloud metadata.
// Callers must send the returned canonical URL, not the original input.
export function publicUrl(value: unknown): string {
  const parsed = new URL(httpUrl(value))
  let host = parsed.hostname.toLowerCase()
  // One trailing dot is the DNS absolute form. A second dot (or %2e) is an empty label and defeats a single strip.
  if (host.includes('..') || host.startsWith('.')) throw new SearchError('blocked-url', 'Expected a public web URL')
  host = host.replace(/\.$/, '')
  if (!host.includes('.') || BLOCKED_NAMES.has(host) || BLOCKED_SUFFIXES.some(suffix => host.endsWith(suffix))
    || host.includes(':') || blockedQuad(host.split('.')) || embeddedBlockedAddress(host)) throw new SearchError('blocked-url', 'Expected a public web URL')
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
