import { PROVIDERS, SearchError, object, providerOf, capabilityOf, type Settings, type ProviderId, type Capability } from './catalog.ts'
export interface ProviderView { id: ProviderId; label: string; capabilities: readonly Capability[]; enabled: boolean; configured: boolean; writable: boolean; keyOptional: boolean; supportsKeys: boolean; webSearch: boolean; source?: string }
export interface Snapshot { entries: ProviderView[]; revision: number; searchProvider: string; searchRevision: string; nativeSearchProvider: string; tools: Settings['tools'] }
function string(value: unknown): string {
  if (typeof value !== 'string' || value.length > 300) throw new SearchError('invalid-response', 'Invalid settings value')
  return value
}
function boolean(value: unknown): boolean {
  if (typeof value !== 'boolean') throw new SearchError('invalid-response', 'Invalid settings state')
  return value
}
export function parseSnapshot(value: unknown): Snapshot {
  const row = object(value)
  if (!Number.isSafeInteger(row.revision) || !Array.isArray(row.entries) || row.entries.length !== PROVIDERS.length) throw new SearchError('invalid-response', 'Invalid settings snapshot')
  const ids = new Set<ProviderId>()
  const entries = row.entries.map(raw => {
    const entry = object(raw), provider = providerOf(entry.id)
    if (ids.has(provider.id)) throw new SearchError('invalid-response', 'Duplicate search provider')
    ids.add(provider.id)
    return { ...provider, enabled: boolean(entry.enabled), configured: boolean(entry.configured), writable: boolean(entry.writable),
      keyOptional: !!provider.keyOptional, supportsKeys: !!provider.env, webSearch: provider.webSearch !== false,
      ...entry.source === undefined ? {} : { source: string(entry.source) } }
  })
  const tools: Settings['tools'] = {}
  for (const [id, raw] of Object.entries(object(row.tools))) {
    const capability = capabilityOf(id), profile = object(raw), provider = providerOf(profile.provider)
    if (!provider.capabilities.includes(capability)) throw new SearchError('invalid-response', 'Unsupported search capability')
    tools[capability] = { provider: provider.id, enabled: boolean(profile.enabled) }
  }
  return { entries, tools, revision: row.revision as number, searchProvider: string(row.searchProvider), searchRevision: string(row.searchRevision), nativeSearchProvider: string(row.nativeSearchProvider) }
}
