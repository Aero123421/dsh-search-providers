import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SearchAdapter } from '../src/adapters.ts'
import { PageStore } from '../src/pagination.ts'
const row = n => ({ url: `https://example.com/${n}`, title: String(n) })
const adapter = (id, transport, extras = {}) => new SearchAdapter({ id, enabled: () => true, resolveKey: async () => 'key', transport, ...extras })
const post = n => ({ type: 'status', id: String(n), text: 'Post', author: { name: 'User', screen_name: 'user' } })

test('TinyFish continuation pins query/category/options/page size despite saved-setting changes', async () => {
  let saved = { country: 'JP', language: 'ja', includeDomains: ['example.com'] }, sent = []
  const a = adapter('tinyfish', async url => {
    const p = new URL(url).searchParams; sent.push(Object.fromEntries(p))
    return Response.json({ page: Number(p.get('page') ?? 0), results: p.has('page') ? [row(2), row(3)] : [row(1), row(2)] })
  }, { searchOptions: () => saved })
  const first = await a.search({ query: 'topic', maxResults: 2 }, undefined, 'news')
  saved = { country: 'US', language: 'en' }
  assert.equal(sent.length, 1); assert.equal(first.page, 0); assert.ok(first.nextPage)
  const second = await a.nextPage(first.nextPage, 'topic', undefined, 'news')
  assert.equal(sent.length, 2); assert.equal(sent[1].location, 'JP'); assert.equal(sent[1].language, 'ja')
  assert.equal(sent[1].domain_type, 'news'); assert.equal(sent[1].include_domains, 'example.com'); assert.equal(sent[1].page, '1')
  assert.deepEqual(second.sources.map(s => s.url), [row(3).url]); assert.equal(second.duplicatesRemoved, 1)
  await assert.rejects(a.nextPage(first.nextPage, 'other', undefined, 'news'), e => e.code === 'invalid-request')
  await assert.rejects(a.nextPage(first.nextPage, 'topic', undefined, 'papers'), e => e.code === 'invalid-request')
  assert.equal(sent.length, 2)
})
for (const capability of ['web', 'news', 'videos']) test(`Brave ${capability} uses page offset/count and stops at provider end`, async () => {
  const calls = []
  const a = adapter('brave', async url => {
    const u = new URL(url); calls.push(u)
    const result = { results: [row(calls.length)] }
    return Response.json({ ...(capability === 'web' ? { web: result } : result), query: { more_results_available: calls.length === 1 } })
  })
  const first = await a.search({ query: 'topic', maxResults: 4 }, undefined, capability)
  assert.ok(first.nextPage)
  const second = await a.nextPage(first.nextPage, 'topic', undefined, capability)
  assert.equal(calls.length, 2); assert.equal(calls[1].searchParams.get('offset'), '1'); assert.equal(calls[1].searchParams.get('count'), '4')
  assert.equal(second.nextPage, undefined); assert.equal(second.pagination, 'end')
})
test('Brave images and nonpaged providers do not advertise continuation', async () => {
  const a = adapter('brave', async () => Response.json({ results: [row(1)] }))
  assert.equal((await a.search({ query: 'x' }, undefined, 'images')).nextPage, undefined)
  const b = adapter('exa', async () => Response.json({ results: [row(1)] }))
  assert.equal((await b.search({ query: 'x' })).nextPage, undefined)
})
for (const [id, maxPage] of [['tinyfish', 10], ['brave', 9]]) test(`${id} never automatically pages and caps total page range`, async () => {
  let calls = 0
  const a = adapter(id, async () => { calls++; return Response.json(id === 'brave' ? { web: { results: [row(calls)] } } : { results: [row(calls)] }) })
  let result = await a.search({ query: 'x' }, undefined, 'web')
  assert.equal(calls, 1)
  for (let page = 1; page <= maxPage; page++) { result = await a.nextPage(result.nextPage, 'x', undefined, 'web'); assert.equal(result.page, page) }
  assert.equal(calls, maxPage + 1); assert.equal(result.pagination, 'page-limit'); assert.equal(result.nextPage, undefined)
})
test('TinyFish empty page is terminal, mismatched page is invalid', async () => {
  const empty = adapter('tinyfish', async () => Response.json({ results: [] }))
  const result = await empty.search({ query: 'x' }); assert.equal(result.pagination, 'end'); assert.equal(result.nextPage, undefined)
  const bad = adapter('tinyfish', async () => Response.json({ results: [], page: 10 }))
  await assert.rejects(bad.search({ query: 'x' }), e => e.code === 'invalid-response')
})
test('Foreign, URL-shaped and oversized handles cannot cause a request', async () => {
  let sent = 0
  const a = adapter('tinyfish', async () => { sent++; return Response.json({ results: [] }) })
  for (const token of ['https://evil.example/', 'brave:123', 'tinyfish:' + 'x'.repeat(10000), 'tinyfish:00000000-0000-0000-0000-000000000000']) await assert.rejects(a.nextPage(token, 'x'), e => e.code === 'invalid-request')
  assert.equal(sent, 0)
})
test('Expired and evicted handles require a new search; store is bounded without timers', t => {
  let now = 0; t.mock.method(Date, 'now', () => now)
  const store = new PageStore(), state = { query: 'x', maxResults: 8, options: {}, page: 1, seen: [] }
  const first = store.issue(state)
  for (let i = 0; i < 100; i++) store.issue(state)
  assert.throws(() => store.get(first, 'x'))
  const last = store.issue(state); now = 15 * 60_000
  assert.throws(() => store.get(last, 'x'))
})
test('Continuation cancellation/disable/unload prevents requests', async () => {
  let enabled = true, calls = 0
  const a = adapter('tinyfish', async () => { calls++; return Response.json({ results: [row(1)] }) }, { enabled: () => enabled })
  const first = await a.search({ query: 'x' })
  const abort = new AbortController(); abort.abort()
  await assert.rejects(a.nextPage(first.nextPage, 'x', abort.signal)); assert.equal(calls, 1)
  enabled = false; await assert.rejects(a.nextPage(first.nextPage, 'x')); assert.equal(calls, 1)
  enabled = true; a.dispose(); await assert.rejects(a.nextPage(first.nextPage, 'x')); assert.equal(calls, 1)
})
test('Continuation 429 is not redirected to another provider', async () => {
  let calls = 0
  const a = adapter('tinyfish', async () => ++calls === 1 ? Response.json({ results: [row(1)] }) : new Response('', { status: 429 }))
  const first = await a.search({ query: 'x' }); await assert.rejects(a.nextPage(first.nextPage, 'x'), e => e.code === 'rate-limited'); assert.equal(calls, 2)
})
test('FxTwitter pins upstream cursor/feed/count, removes duplicates and terminates repeated cursor', async () => {
  const calls = []
  const a = adapter('fxtwitter', async url => { calls.push(new URL(url)); return Response.json({ code: 200, results: calls.length === 1 ? [post(20)] : [post(20), post(21)], cursor: { bottom: 'opaque=cursor+&' } }) })
  const first = await a.xSearch({ query: 'topic', sort: 'top', maxResults: 2 })
  const second = await a.nextPage(first.nextPage, 'topic', undefined, 'x')
  assert.equal(calls[1].origin, 'https://api.fxtwitter.com'); assert.equal(calls[1].searchParams.get('cursor'), 'opaque=cursor+&')
  assert.equal(calls[1].searchParams.get('feed'), 'top'); assert.equal(calls[1].searchParams.get('count'), '2')
  assert.equal(second.sources.length, 1); assert.equal(second.duplicatesRemoved, 1); assert.equal(second.pagination, 'repeated-cursor'); assert.equal(second.nextPage, undefined)
})
test('FxTwitter validates cursor length/types and never changes 404 into end', async () => {
  for (const bottom of [42, {}, 'x'.repeat(4097), 'line\nbreak']) {
    const a = adapter('fxtwitter', async () => Response.json({ code: 200, results: [], cursor: { bottom } }))
    await assert.rejects(a.xSearch({ query: 'x' }), e => e.code === 'invalid-response')
  }
  let count = 0
  const a = adapter('fxtwitter', async () => ++count === 1 ? Response.json({ code: 200, results: [post(20)], cursor: { bottom: 'next' } }) : Response.json({ code: 404 }))
  const first = await a.xSearch({ query: 'x' }); await assert.rejects(a.nextPage(first.nextPage, 'x', undefined, 'x'), e => e.code === 'x-search-unavailable')
})
