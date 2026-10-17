import { Context } from '@deepseek-ai/cordis'
import { CredentialProvider } from '@deepseek-ai/dsh-credentials'
import { WebRuntime } from '@deepseek-ai/dsh-web'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import { HostConnectionService } from '@deepseek-ai/dsh-client-connection'
import { applyWebSearchTool, applyWebFetchTool } from '@deepseek-ai/dsh-tool-web'
import { NS, providerRoute } from '../src/catalog.ts'
import * as plugin from '../dist/index.js'

class MemoryCredentials extends CredentialProvider {
  records = new Map()
  references = new Map()
  async resolve(ref) { const value = this.references.get(ref); return value ? { value, source: 'fixture' } : undefined }
  async describe(ref) { return { configured: this.references.has(ref), writable: true } }
  async set(ref, value) { this.references.set(ref, value); this.ctx.emit('credentials/reference-updated', ref) }
  async unset(ref) { this.references.delete(ref); this.ctx.emit('credentials/reference-updated', ref) }
  async readRecord(key) { return this.records.get(key) }
  async describeRecord(key) { const value = this.records.get(key); return { configured: !!value, writable: true, ...value ? { kind: value.kind } : {} } }
  async listRecords() { return [...this.records].map(([key, row]) => ({ key, kind: row.kind })) }
  async modifyRecord(key, mutate) { const next = await mutate(this.records.get(key)); if (next) { this.records.set(key, next); this.ctx.emit('credentials/record-updated', key) } return next }
  async deleteRecord(key) { this.records.delete(key); this.ctx.emit('credentials/record-updated', key) }
}
export async function hostFixture({ authenticate = () => true, manager, profileDir } = {}) {
  const ctx = new Context(), value = { providers: {}, tools: {}, nativeSearchProvider: 'deepseek' }
  if (manager) ctx.provide('pluginManager', manager)
  if (profileDir) ctx.provide('profileContext', { dir: profileDir })
  let revision = 0
  await ctx.plugin(MemoryCredentials)
  ctx.provide('settings', {
    configure: () => () => {}, describe: () => [{ ns: NS, value: structuredClone(value), revision }],
    mutate: async (namespace, ops, expected) => {
      if (namespace !== NS || expected !== revision) throw new Error('stale revision')
      for (const op of ops) {
        let target = value
        for (const key of op.path.slice(0, -1)) target = target[key] ??= {}
        target[op.path.at(-1)] = structuredClone(op.value)
      }
      revision++; ctx.emit('settings/document-updated', NS, revision)
    },
    update: async (namespace, patch, expected) => {
      if (namespace !== NS || expected !== revision) throw new Error('stale revision')
      for (const field of ['providers', 'tools']) if (patch[field]) for (const [id, fields] of Object.entries(patch[field])) value[field][id] = { ...value[field][id], ...fields }
      if (patch.nativeSearchProvider) value.nativeSearchProvider = patch.nativeSearchProvider
      revision++; ctx.emit('settings/document-updated', NS, revision)
    },
  })
  const entry = { options: { id: 'web', name: '@deepseek-ai/dsh-web', config: { searchProvider: 'deepseek', fetchProvider: 'http' } } }
  ctx.provide('configEditor', { entries: () => [entry], edit: async (row, change) => { row.options.config = change(row.options.config, {}); ctx.emit('connection/reset') } })
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  await ctx.plugin(WebRuntime, { searchProvider: providerRoute('exa'), fetchProvider: 'http' })
  await ctx.plugin(child => { new HostConnectionService(child, [], { isAuthenticated: authenticate }) })
  const native = ctx.plugin({ inject: ['systemPrompt', 'tools', 'web'], apply: child => { applyWebSearchTool(child, 8, 4, 60_000, true); applyWebFetchTool(child, 30_000, 200_000) } }); await native.await()
  const config = plugin.Config(value)
  // The test's settings store is live just like Cordis Volatile values.
  const fiber = ctx.plugin({ inject: plugin.inject, apply: child => plugin.apply(child, { providers: { get: () => value.providers }, tools: { get: () => value.tools } }) }); await fiber.await()
  const handler = ctx.connection.createSharedFetchHandler('/api')
  async function rpc(method, payload = {}) {
    const endpoint = `${NS}/${method}`
    const response = await handler.fetch(new Request(`http://localhost/api/${endpoint}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'client-request', rpcId: 'fixture', method: endpoint, payload }) }))
    assertResponse(response)
    const result = (await response.json()).result
    if (!result.ok) throw new Error(result.error.code)
    return result.value
  }
  return { ctx, value, fiber, native, config, handler, rpc, entry, dispose: async () => { await fiber.dispose(); await native.dispose(); await ctx.fiber.dispose() } }
}
function assertResponse(response) { if (response.status !== 200) throw new Error(`Fixture RPC returned ${response.status}`) }
