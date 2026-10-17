import { validateSearchOptions, type SearchOptions } from './search-options.ts'
import type { SourceMetadata } from './metadata.ts'
export const NS = 'dsh-search-providers'
export const CAPABILITIES = ['web', 'news', 'papers', 'code', 'people', 'companies', 'images', 'videos', 'extract', 'batchExtract', 'map', 'x'] as const
export type Capability = typeof CAPABILITIES[number]
export const PROVIDERS = [
  { id: 'keenable', label: 'Keenable', env: 'KEENABLE_API_KEY', keyOptional: true, capabilities: ['web', 'extract'] },
  { id: 'nimble', label: 'Nimble', env: 'NIMBLE_API_KEY', capabilities: ['web', 'news', 'papers', 'code', 'extract', 'map'] },
  { id: 'tinyfish', label: 'TinyFish', env: 'TINYFISH_API_KEY', capabilities: ['web', 'news', 'papers', 'extract', 'batchExtract'] },
  { id: 'parallel', label: 'Parallel', env: 'PARALLEL_API_KEY', capabilities: ['web', 'extract', 'batchExtract'] },
  { id: 'exa', label: 'Exa', env: 'EXA_API_KEY', capabilities: ['web', 'news', 'papers', 'people', 'companies', 'extract', 'batchExtract'] },
  { id: 'brave', label: 'Brave', env: 'BRAVE_API_KEY', capabilities: ['web', 'news', 'images', 'videos'] },
  { id: 'perplexity', label: 'Perplexity', env: 'PERPLEXITY_API_KEY', capabilities: ['web', 'people'] },
  { id: 'fxtwitter', label: 'FxTwitter', keyOptional: true, webSearch: false, capabilities: ['x'] },
] as const satisfies readonly { id: string; label: string; env?: string; keyOptional?: boolean; webSearch?: boolean; capabilities: readonly Capability[] }[]
export type ProviderId = typeof PROVIDERS[number]['id']
export type Provider = { id: ProviderId; label: string; env?: string; keyOptional?: boolean; webSearch?: boolean; capabilities: readonly Capability[] }
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
export interface Source extends SourceMetadata { url: string; title?: string; snippet?: string; publishedAt?: string; mediaUrl?: string; authors?: string[]; year?: number; venue?: string; doi?: string; author?: string; authorHandle?: string; likes?: number; reposts?: number; replies?: number; views?: number }
export interface SearchResult { sources: Source[]; truncated: boolean; nextPage?: string; page?: number; pagination?: string; duplicatesRemoved?: number }
export interface ProviderSettings { enabled?: boolean; search?: SearchOptions }
export interface ToolSettings { provider: ProviderId; enabled: boolean }
export interface Settings { providers: Partial<Record<ProviderId, ProviderSettings>>; tools: Partial<Record<Capability, ToolSettings>> }
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new SearchError('invalid-response', 'Expected an object')
  return value as Record<string, unknown>
}
export function validateSettings(settings: Settings): void {
  for (const [id, profile] of Object.entries(settings.providers)) {
    const provider = providerOf(id)
    if (profile.search !== undefined) validateSearchOptions(provider.id, profile.search)
    if (profile.enabled !== undefined && typeof profile.enabled !== 'boolean') throw new SearchError('invalid-request', 'Invalid provider state')
  }
  for (const [id, profile] of Object.entries(settings.tools)) {
    const feature = capabilityOf(id), provider = providerOf(profile.provider)
    if (typeof profile.enabled !== 'boolean' || !provider.capabilities.includes(feature)) throw new SearchError('invalid-request', 'Unsupported capability')
  }
}
