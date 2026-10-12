import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-settings'
import type {} from '@deepseek-ai/dsh-credentials'
import type {} from '@deepseek-ai/dsh-config-editor'
import { credentialKey, credentialRef } from '@deepseek-ai/dsh-credentials'
import { createHash } from 'node:crypto'
import { NS, PROVIDERS, SearchError, object, providerOf, capabilityOf, providerRoute, type Settings, type ProviderId } from './catalog.ts'
import type { Snapshot } from './state.ts'

type Services = Pick<Context, 'credentials' | 'settings' | 'configEditor'>
export type { ProviderView, Snapshot } from './state.ts'
const fingerprint = (config: object) => createHash('sha256').update(JSON.stringify(config)).digest('hex')
export class SearchBroker {
  private readonly ctx: Services
  constructor(ctx: Services) { this.ctx = ctx }
  private section() {
    const section = this.ctx.settings.describe({ redactSecrets: true }).find(row => row.ns === NS)
    if (!section) throw new SearchError('unavailable', 'Search settings are unavailable')
    return section
  }
  private webEntry() {
    const entry = this.ctx.configEditor.entries().find(row => row.options.id === 'web' && row.options.name === '@deepseek-ai/dsh-web')
    if (!entry) throw new SearchError('unavailable', 'The standard web service is unavailable')
    return entry
  }
  async key(id: ProviderId): Promise<string | undefined> {
    const env = providerOf(id).env
    if (!env) return undefined
    const saved = await this.ctx.credentials.readRecord(credentialKey(NS, id))
    if (saved?.kind === 'api-key' && saved.key) return saved.key
    return (await this.ctx.credentials.resolve(credentialRef(env)))?.value
  }
  private async credential(id: ProviderId) {
    const env = providerOf(id).env
    if (!env) return { configured: false, writable: false }
    const saved = await this.ctx.credentials.describeRecord(credentialKey(NS, id))
    const ambient = await this.ctx.credentials.describe(credentialRef(env))
    return { configured: saved.configured || ambient.configured, writable: saved.writable,
      ...saved.configured ? { source: 'saved' } : ambient.configured ? { source: env } : {} }
  }
  async snapshot(): Promise<Snapshot> {
    const section = this.section(), value = object(section.value), providers = object(value.providers ?? {}), config = this.webEntry().options.config ?? {}
    const searchProvider = typeof config.searchProvider === 'string' ? config.searchProvider : process.env.DSH_WEB_SEARCH_PROVIDER ?? 'deepseek-official'
    return {
      revision: section.revision, searchProvider, searchRevision: fingerprint(config),
      nativeSearchProvider: typeof value.nativeSearchProvider === 'string' ? value.nativeSearchProvider : 'deepseek-official',
      tools: value.tools as Settings['tools'],
      entries: await Promise.all(PROVIDERS.map(async row => {
        const provider = providerOf(row.id)
        return { ...provider, keyOptional: !!provider.keyOptional, supportsKeys: !!provider.env, webSearch: provider.webSearch !== false,
          enabled: Object.hasOwn(providers, row.id) && object(providers[row.id]).enabled === true, ...await this.credential(row.id) }
      })),
    }
  }
  private checkRevision(revision: unknown): number {
    if (!Number.isSafeInteger(revision)) throw new SearchError('invalid-request', 'Invalid settings revision')
    const current = this.section().revision
    if (revision !== current) throw new SearchError('settings-changed', 'Settings changed in another window')
    return current
  }
  async dispatch(method: string, payload: unknown): Promise<unknown> {
    const data = object(payload)
    if (method === 'list') return this.snapshot()
    const id = method === 'default' && data.provider === 'native' ? undefined : providerOf(data.provider).id
    if (method === 'save-key') {
      if (!id || !providerOf(id).env || typeof data.key !== 'string' || !data.key.trim() || data.key.length > 16384 || /[\r\n]/.test(data.key)) throw new SearchError('invalid-request', 'Invalid API key')
      const key = data.key.trim()
      await this.ctx.credentials.modifyRecord(credentialKey(NS, id), async () => ({ kind: 'api-key', key }))
      return { saved: true }
    }
    if (method === 'delete-key') {
      if (!id || !providerOf(id).env) throw new SearchError('invalid-request', 'Invalid provider')
      await this.ctx.credentials.deleteRecord(credentialKey(NS, id))
      return { saved: true }
    }
    const revision = this.checkRevision(data.revision)
    if (method === 'provider') {
      if (!id || typeof data.enabled !== 'boolean') throw new SearchError('invalid-request', 'Invalid provider state')
      if (data.enabled && !providerOf(id).keyOptional && !(await this.credential(id)).configured) throw new SearchError('missing-key', 'Save an API key first')
      await this.ctx.settings.update(NS, { providers: { [id]: { enabled: data.enabled } } }, revision)
    } else if (method === 'tool') {
      const capability = capabilityOf(data.capability)
      if (!id || typeof data.enabled !== 'boolean' || !providerOf(id).capabilities.includes(capability)) throw new SearchError('invalid-request', 'Unsupported capability')
      const snapshot = await this.snapshot(), entry = snapshot.entries.find(row => row.id === id)!
      if (data.enabled && !entry.enabled) throw new SearchError('provider-disabled', 'Enable the provider first')
      if (!data.enabled && snapshot.tools[capability]?.provider !== id) throw new SearchError('settings-changed', 'Another provider supplies this capability')
      await this.ctx.settings.update(NS, { tools: { [capability]: { provider: id, enabled: data.enabled } } }, revision)
    } else if (method === 'default') {
      if (id && providerOf(id).webSearch === false) throw new SearchError('invalid-request', 'This provider only supplies additional tools')
      const snapshot = await this.snapshot(), entry = this.webEntry()
      if (typeof data.searchRevision !== 'string' || snapshot.searchRevision !== data.searchRevision) throw new SearchError('settings-changed', 'The search provider changed')
      if (id && !snapshot.entries.find(row => row.id === id)?.enabled) throw new SearchError('provider-disabled', 'Enable the provider first')
      let native = snapshot.nativeSearchProvider
      if (!snapshot.searchProvider.startsWith(`${NS}-`)) {
        native = snapshot.searchProvider
        await this.ctx.settings.update(NS, { nativeSearchProvider: native }, revision)
      }
      const selection = id ? providerRoute(id) : native
      // searchProvider is ordinary Config. ConfigEditor persists it and lets Loader
      // reconcile the web service; the Settings API only edits volatile fields.
      await this.ctx.configEditor.edit(entry, current => {
        if (fingerprint(current) !== snapshot.searchRevision) throw new SearchError('settings-changed', 'The web configuration changed')
        const providers = object(object(this.section().value).providers ?? {})
        if (id && (!Object.hasOwn(providers, id) || object(providers[id]).enabled !== true)) throw new SearchError('provider-disabled', 'Enable the provider first')
        return { ...current, searchProvider: selection }
      })
    } else throw new SearchError('invalid-request', 'Unknown operation')
    return { saved: true }
  }
}
