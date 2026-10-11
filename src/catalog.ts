export const NS = 'dsh-search-providers'
export const CAPABILITIES = ['news', 'papers', 'code', 'people', 'companies', 'images', 'videos', 'extract', 'map'] as const
export type Capability = typeof CAPABILITIES[number]
export const PROVIDERS = [
  { id: 'keenable', label: 'Keenable', env: 'KEENABLE_API_KEY', keyOptional: true, capabilities: ['extract'] },
  { id: 'nimble', label: 'Nimble', env: 'NIMBLE_API_KEY', capabilities: ['news', 'papers', 'code', 'extract', 'map'] },
  { id: 'tinyfish', label: 'TinyFish', env: 'TINYFISH_API_KEY', capabilities: ['news', 'papers', 'extract'] },
  { id: 'parallel', label: 'Parallel', env: 'PARALLEL_API_KEY', capabilities: ['extract'] },
  { id: 'exa', label: 'Exa', env: 'EXA_API_KEY', capabilities: ['news', 'papers', 'people', 'companies', 'extract'] },
  { id: 'brave', label: 'Brave', env: 'BRAVE_API_KEY', capabilities: ['news', 'images', 'videos'] },
  { id: 'perplexity', label: 'Perplexity', env: 'PERPLEXITY_API_KEY', capabilities: ['people'] },
] as const satisfies readonly { id: string; label: string; env: string; keyOptional?: boolean; capabilities: readonly Capability[] }[]
export type ProviderId = typeof PROVIDERS[number]['id']
export type Provider = { id: ProviderId; label: string; env: string; keyOptional?: boolean; capabilities: readonly Capability[] }
export function providerOf(id: unknown): Provider {
  const provider = PROVIDERS.find(row => row.id === id)
  if (!provider) throw new SearchError('invalid-request', 'Unknown search provider')
  return provider
}
export const providerRoute = (id: ProviderId) => `${NS}-${id}`
export function capabilityOf(value: unknown): Capability {
  const capability = CAPABILITIES.find(id => id === value)
  if (!capability) throw new SearchError('invalid-request', 'Unknown search capability')
  return capability
}
export class SearchError extends Error {
  readonly code: string
  readonly status: number | undefined
  constructor(code: string, message: string, status?: number) { super(message); this.code = code; this.status = status }
}
export interface Source { url: string; title?: string; snippet?: string; publishedAt?: string; mediaUrl?: string; authors?: string[]; year?: number; venue?: string; doi?: string }
export interface SearchResult { sources: Source[]; truncated: boolean }
export interface ProviderSettings { enabled?: boolean }
export interface ToolSettings { provider: ProviderId; enabled: boolean }
export interface Settings { providers: Partial<Record<ProviderId, ProviderSettings>>; tools: Partial<Record<Capability, ToolSettings>> }
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new SearchError('invalid-response', 'Expected an object')
  return value as Record<string, unknown>
}
export function validateSettings(settings: Settings): void {
  for (const [id, profile] of Object.entries(settings.providers)) {
    providerOf(id)
    if (profile.enabled !== undefined && typeof profile.enabled !== 'boolean') throw new SearchError('invalid-request', 'Invalid provider state')
  }
  for (const [id, profile] of Object.entries(settings.tools)) {
    const feature = capabilityOf(id), provider = providerOf(profile.provider)
    if (typeof profile.enabled !== 'boolean' || !provider.capabilities.includes(feature)) throw new SearchError('invalid-request', 'Unsupported capability')
  }
}
