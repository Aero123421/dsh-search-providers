import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SearchController } from '../src/controller.ts'
import { PROVIDERS } from '../src/catalog.ts'
const snapshot = revision => ({ revision, searchProvider: 'deepseek-official', nativeSearchProvider: 'deepseek-official', searchRevision: 'revision', tools: {}, entries: PROVIDERS.map(row => ({ ...row, enabled: false, configured: false, writable: true })) })

test('A connection reset drops stale list results', async () => {
  const requests = []
  const controller = new SearchController({ rpc: { call: (_base, _method, _payload, signal) => new Promise(resolve => requests.push({ resolve, signal })) } })
  const old = controller.load(); const fresh = controller.refresh()
  assert.equal(requests[0].signal.aborted, true)
  requests[1].resolve({ ok: true, value: snapshot(2) }); await fresh
  requests[0].resolve({ ok: true, value: snapshot(1) }); await old
  assert.equal(controller.getSnapshot().snapshot.revision, 2)
  controller.dispose()
})
test('Failed refresh retains the existing provider list', async () => {
  let fail = false
  const controller = new SearchController({ rpc: { call: async () => { if (fail) throw new Error('offline'); return { ok: true, value: snapshot(1) } } } })
  await controller.load(); fail = true; await controller.refresh()
  assert.equal(controller.getSnapshot().snapshot.entries.length, 8); assert.equal(controller.getSnapshot().error, 'loadFailed')
  controller.dispose()
})
test('Malformed wire snapshots produce a load error', async () => {
  const controller = new SearchController({ rpc: { call: async () => ({ ok: true, value: { entries: [] } }) } })
  await controller.load(); assert.equal(controller.getSnapshot().error, 'loadFailed'); assert.equal(controller.getSnapshot().snapshot, undefined)
  controller.dispose()
})
