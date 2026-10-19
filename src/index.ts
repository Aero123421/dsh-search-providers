import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-web'
import type {} from '@deepseek-ai/dsh-client-connection'
import { WebError } from '@deepseek-ai/dsh-web'
import { SearchAdapter } from './adapters.ts'
import { searchWithFallback } from './search-fallback.ts'
import { SearchBroker } from './broker.ts'
import { NS, PROVIDERS, SearchError, object, providerOf, providerRoute, readSettings, type Settings, type ProviderId, type SettingsProblem } from './catalog.ts'
import { getDshRuntimeVersion } from '@deepseek-ai/dsh-app-boot'
import type {} from '@deepseek-ai/dsh-plugin-manager'
import { Updates } from './updates.ts'
import { VERSION } from './version.ts'
import { withMetadataSnippets } from './metadata-presentation.ts'
import { registerExtraTools } from './tools.ts'
import { ensureUninstallHook, releaseOnUnload } from './profile-release.ts'

export const name = NS
export const inject = ['web', 'tools', 'settings', 'credentials', 'configEditor', 'connection']
export const Config = z.object({
  // Saved documents can name providers or features this version does not know.
  // Load skips those entries. The settings UI still rejects them on save.
  providers: z.any().default({}).volatile(),
  tools: z.any().default({}).volatile(),
  nativeSearchProvider: z.any().default('deepseek-official').volatile(),
})
export interface LiveConfig {
  providers: { get(): Settings['providers'] }
  tools: { get(): Settings['tools'] }
}
export function apply(ctx: Context, config: LiveConfig): void {
  const profileDir = ctx.get('profileContext')?.dir
  if (typeof profileDir === 'string' && ensureUninstallHook(profileDir) === 'skipped') ctx.logger.warn('left the existing pnpmfile in place, so uninstall cleanup is not installed')
  const current = () => readSettings({ providers: config.providers.get(), tools: config.tools.get() })
  const settings = (): Settings => current().settings
  let reported = ''
  const report = (problems: SettingsProblem[]) => {
    const key = JSON.stringify(problems)
    if (key === reported) return
    reported = key
    for (const problem of problems) ctx.logger.warn('ignored saved settings %s (%s)', problem.id ? `${problem.scope}/${problem.id}` : problem.scope, problem.reason)
  }
  ctx.on('internal/config', function (_raw, next) {
    const resolved = next()
    if (this !== ctx.fiber) return resolved
    try { report(readSettings(resolved).problems) } catch (error) { ctx.logger.warn('could not read saved search settings: %s', error instanceof Error ? error.message : 'invalid') }
    return resolved
  })
  ctx.effect(() => ctx.settings.configure({ auto: false }, ctx.fiber))
  const updates = new Updates(() => ctx.get('pluginManager'), ctx.get('profileContext')?.dir, VERSION, getDshRuntimeVersion())
  ctx.effect(() => () => updates.dispose())
  ctx.effect(() => () => {
    if (typeof profileDir !== 'string') return
    try { releaseOnUnload(profileDir) }
    catch (error) { ctx.logger.warn('could not restore the previous search provider: %s', error instanceof Error ? error.message : 'failed') }
  })
  const broker = new SearchBroker(ctx), adapters = new Map<ProviderId, SearchAdapter>()
  ctx.effect(() => () => { for (const adapter of adapters.values()) adapter.dispose() })
  for (const provider of PROVIDERS) {
    const adapter = new SearchAdapter({ id: provider.id, enabled: () => settings().providers[provider.id]?.enabled === true, resolveKey: () => broker.key(provider.id), searchOptions: () => settings().providers[provider.id]?.search ?? {} })
    adapters.set(provider.id, adapter)
    if (providerOf(provider.id).webSearch === false) continue
    ctx.web.registerSearchProvider({ id: providerRoute(provider.id), available: () => adapter.available(),
      async search(request, signal) {
        try { return withMetadataSnippets(await searchWithFallback({ primary: provider.id, adapters, request, ...signal ? { signal } : {} })) }
        catch (error) {
          if (signal?.aborted) throw new WebError('Search cancelled', 'WEB_SEARCH_CANCELLED')
          if (error instanceof SearchError) throw new WebError(error.message, `SEARCH_${error.code.toUpperCase().replaceAll('-', '_')}`)
          throw new WebError('Search request failed', 'WEB_PROVIDER_FAILURE')
        }
      },
    })
  }
  const registrations = new Map<string, () => void>()
  const refreshTools = () => {
    const value = current(); report(value.problems)
    registerExtraTools(ctx, value.settings, adapters, registrations)
  }
  refreshTools()
  ctx.on('settings/document-updated', namespace => { if (namespace === NS) refreshTools() })
  ctx.on('loader/volatile-update', refreshTools)
  ctx.effect(() => () => { for (const dispose of registrations.values()) dispose(); registrations.clear() })
  for (const method of ['list', 'save-key', 'delete-key', 'provider', 'search-options', 'tool', 'remove-ignored', 'default', 'update-status', 'update-check', 'update-install']) {
    const endpoint = `${NS}/${method}`
    ctx.connection.fetch.register({ path: `/api/${endpoint}`, methods: ['POST'], requestBody: 'buffered',
      async fetch(request) {
        let rpcId: string | undefined
        try {
          if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') return new Response('unsupported media type', { status: 415 })
          const envelope = object(await request.json())
          if (envelope.type !== 'client-request' || typeof envelope.rpcId !== 'string' || envelope.rpcId.length > 100 || envelope.method !== endpoint) return new Response('invalid request', { status: 400 })
          rpcId = envelope.rpcId; request.signal.throwIfAborted()
          const payload = object(envelope.payload)
          const value = method === 'update-status' ? await updates.status(payload.operationId) : method === 'update-check' ? await updates.check() : method === 'update-install' ? await updates.install(payload.candidateId, payload.operationId, payload.profileKey) : await broker.dispatch(method, envelope.payload)
          return Response.json({ type: 'server-response', rpcId, result: { ok: true, value } }, { headers: { 'cache-control': 'no-store' } })
        } catch (error) {
          if (rpcId === undefined) return new Response('invalid request', { status: 400 })
          const code = error instanceof SearchError ? error.code : error instanceof Error && ['busy', 'profile-changed'].includes(error.message) ? error.message : 'unavailable'
          return Response.json({ type: 'server-response', rpcId, result: { ok: false, error: { code: `${NS}/${code}`, message: code, details: {} } } }, { headers: { 'cache-control': 'no-store' } })
        }
      },
    })
  }
}
