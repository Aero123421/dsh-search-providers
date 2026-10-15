import { PROVIDERS, SearchError, providerOf, type Capability, type ProviderId, type SearchResult } from './catalog.ts'
import type { SearchAdapter } from './adapters.ts'

export function quotaLimited(error: unknown): error is SearchError {
  return error instanceof SearchError && error.code === 'rate-limited'
}
function skipFallback(error: unknown): boolean {
  return error instanceof SearchError && (error.code === 'missing-key' || error.code === 'provider-disabled' || error.code === 'authentication-failed' || quotaLimited(error))
}
/** Tries the selected provider, then other enabled providers that support the same search, once each. */
export async function searchWithFallback(options: {
  primary: ProviderId
  adapters: ReadonlyMap<ProviderId, SearchAdapter>
  request: { query: string; maxResults?: number }
  signal?: AbortSignal
  capability?: Capability
}): Promise<SearchResult> {
  const { primary, adapters, request, signal, capability } = options
  const primaryAdapter = adapters.get(primary)
  if (!primaryAdapter) throw new SearchError('invalid-request', 'Unknown search provider')
  let primaryError: SearchError | undefined
  try { return await primaryAdapter.search(request, signal, capability) }
  catch (error) {
    if (signal?.aborted || !quotaLimited(error)) throw error
    primaryError = error
  }
  for (const row of PROVIDERS) {
    const provider = providerOf(row.id)
    if (provider.id === primary || provider.webSearch === false) continue
    if (capability && !provider.capabilities.includes(capability)) continue
    const adapter = adapters.get(provider.id)
    if (!adapter?.available()) continue
    try { return await adapter.search(request, signal, capability) }
    catch (error) {
      if (signal?.aborted || !skipFallback(error)) throw error
    }
  }
  throw primaryError
}
