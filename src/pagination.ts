import { SearchError, type Capability, type SearchResult } from './catalog.ts'
import type { SearchOptions } from './search-options.ts'

export interface PageState {
  query: string; maxResults: number; capability?: Capability; options: SearchOptions
  page: number; cursor?: string; sort?: string; seen: string[]
}
const TTL = 15 * 60_000, MAX_STATES = 100
/** Host-only, bounded, ephemeral handles: no URLs/queries/credentials are encoded into a token. */
export class PageStore {
  private readonly states = new Map<string, { expires: number; value: PageState }>()
  clear(): void { this.states.clear() }
  issue(value: PageState): string {
    this.prune()
    if (this.states.size >= MAX_STATES) this.states.delete(this.states.keys().next().value!)
    const token = crypto.randomUUID()
    this.states.set(token, { expires: Date.now() + TTL, value: structuredClone(value) })
    return token
  }
  get(token: string, query: string, capability?: Capability): PageState {
    this.prune()
    if (typeof token !== 'string' || !/^[a-f0-9-]{36}$/.test(token)) throw new SearchError('invalid-request', 'Invalid next_page handle')
    const row = this.states.get(token)
    if (!row) throw new SearchError('invalid-request', 'Unknown or expired next_page; start a new search')
    if (row.value.query !== query || row.value.capability !== capability) throw new SearchError('invalid-request', 'next_page belongs to a different query or search category')
    return structuredClone(row.value)
  }
  private prune(): void { for (const [token, row] of this.states) if (row.expires <= Date.now()) this.states.delete(token) }
}
export function withPage(result: SearchResult, previous: string[], page: number): SearchResult {
  const seen = new Set(previous), sources = result.sources.filter(source => {
    if (seen.has(source.url)) return false
    seen.add(source.url); return true
  })
  return { ...result, sources, page, duplicatesRemoved: result.sources.length - sources.length }
}
