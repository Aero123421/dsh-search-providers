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
export const PROBLEM_REASONS = ['unknown-provider', 'unknown-capability', 'unsupported-capability', 'invalid-search', 'invalid-state', 'malformed'] as const
export type ProblemReason = typeof PROBLEM_REASONS[number]
/** A saved entry the running plugin will not apply. `id` is empty when the whole section is unreadable. */
export interface SettingsProblem { scope: 'providers' | 'tools'; id: string; reason: ProblemReason }
function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}
/**
 * Keep known providers and features from a saved document.
 * Unknown ids, unsupported features, and values that fail the save-time checks are omitted and reported.
 * This does not delete the saved document.
 */
export function readSettings(raw: unknown): { settings: Settings; problems: SettingsProblem[] } {
  const problems: SettingsProblem[] = [], settings: Settings = { providers: {}, tools: {} }
  if (!record(raw)) {
    if (raw !== undefined) problems.push({ scope: 'providers', id: '', reason: 'malformed' })
    return { settings, problems }
  }
  readProviders(raw.providers, settings, problems)
  readTools(raw.tools, settings, problems)
  return { settings, problems }
}
function readProviders(raw: unknown, settings: Settings, problems: SettingsProblem[]): void {
  if (raw === undefined) return
  if (!record(raw)) { problems.push({ scope: 'providers', id: '', reason: 'malformed' }); return }
  for (const [id, profile] of Object.entries(raw)) {
    const provider = PROVIDERS.find(row => row.id === id)
    if (!provider) { problems.push({ scope: 'providers', id, reason: 'unknown-provider' }); continue }
    if (!record(profile)) { problems.push({ scope: 'providers', id, reason: 'malformed' }); continue }
    const next: ProviderSettings = {}
    if (profile.enabled !== undefined) {
      if (typeof profile.enabled === 'boolean') next.enabled = profile.enabled
      else problems.push({ scope: 'providers', id, reason: 'invalid-state' })
    }
    if (profile.search !== undefined) {
      try { next.search = validateSearchOptions(provider.id, profile.search) }
      catch { problems.push({ scope: 'providers', id, reason: 'invalid-search' }) }
    }
    settings.providers[provider.id] = next
  }
}
function readTools(raw: unknown, settings: Settings, problems: SettingsProblem[]): void {
  if (raw === undefined) return
  if (!record(raw)) { problems.push({ scope: 'tools', id: '', reason: 'malformed' }); return }
  for (const [id, profile] of Object.entries(raw)) {
    const capability = CAPABILITIES.find(item => item === id)
    if (!capability) { problems.push({ scope: 'tools', id, reason: 'unknown-capability' }); continue }
    if (!record(profile) || typeof profile.provider !== 'string') { problems.push({ scope: 'tools', id, reason: 'malformed' }); continue }
    const provider = PROVIDERS.find(row => row.id === profile.provider)
    if (!provider) { problems.push({ scope: 'tools', id, reason: 'unknown-provider' }); continue }
    const capabilities: readonly Capability[] = provider.capabilities
    if (!capabilities.includes(capability)) { problems.push({ scope: 'tools', id, reason: 'unsupported-capability' }); continue }
    if (typeof profile.enabled !== 'boolean') { problems.push({ scope: 'tools', id, reason: 'invalid-state' }); continue }
    settings.tools[capability] = { provider: provider.id, enabled: profile.enabled }
  }
}
/** Path of one ignored entry. Search and on/off problems remove only that field. */
export function ignoredPath(problem: SettingsProblem): string[] {
  if (!problem.id) return [problem.scope]
  if (problem.reason === 'invalid-search') return ['providers', problem.id, 'search']
  if (problem.scope === 'providers' && problem.reason === 'invalid-state') return ['providers', problem.id, 'enabled']
  return [problem.scope, problem.id]
}
