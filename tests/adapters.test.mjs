import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SearchAdapter } from '../src/adapters.ts'
import { PROVIDERS, validateSettings } from '../src/catalog.ts'
import { jsonRequest, MAX_RESPONSE_BYTES, publicUrl, RequestGate } from '../src/http.ts'

const fixture = { url: 'https://example.com/article', title: 'Example', snippet: 'Snippet', description: 'Description', highlights: ['Highlight'], excerpts: ['Excerpt'], date: '2026-10-10', publishedDate: '2026-10-10', publish_date: '2026-10-10' }
for (const provider of PROVIDERS.filter(row => row.webSearch !== false)) test(`${provider.label}: API request and standard source projection`, async () => {
  let sent
  const adapter = new SearchAdapter({ id: provider.id, enabled: () => true, resolveKey: async () => 'test-key', transport: async (url, init) => {
    sent = { url: new URL(url), ...init }; return Response.json(provider.id === 'brave' ? { web: { results: [fixture] } } : { results: [fixture] })
  } })
  const result = await adapter.search({ query: 'DSH search', maxResults: 8 })
  assert.equal(result.sources[0].url, fixture.url); assert.equal(result.sources[0].title, fixture.title)
  assert.equal(result.truncated, false)
  assert.equal(result.sources[0].publishedAt, provider.id === 'nimble' ? undefined : fixture.date)
  assert.equal(sent.redirect, 'error')
  assert.ok(sent.signal instanceof AbortSignal)
  const body = sent.body && JSON.parse(sent.body)
  if (provider.id === 'parallel') { assert.equal(sent.url.pathname, '/v1/search'); assert.deepEqual(body.search_queries, ['DSH search']); assert.equal(body.advanced_settings.max_results, 8) }
  if (provider.id === 'perplexity') { assert.equal(sent.url.pathname, '/search'); assert.equal(body.search_type, 'web'); assert.equal(body.max_results, 8) }
  if (provider.id === 'exa') assert.deepEqual(body.contents, { highlights: true })
  if (provider.id === 'nimble') { assert.equal(body.search_depth, 'lite'); assert.equal(body.full_content, false) }
  if (provider.id === 'tinyfish') assert.equal(sent.url.searchParams.get('domain_type'), 'web')
})
test('Specialized searches send real provider filters', async () => {
  for (const [id, capability, field, expected] of [
    ['nimble', 'papers', 'focus', 'academic'], ['nimble', 'code', 'focus', 'coding'],
    ['exa', 'papers', 'category', 'publication'], ['exa', 'companies', 'category', 'company'], ['perplexity', 'people', 'search_type', 'people'],
  ]) {
    const adapter = new SearchAdapter({ id, enabled: () => true, resolveKey: async () => 'key', transport: async (_url, init) => {
      assert.equal(JSON.parse(init.body)[field], expected); return Response.json({ results: [] })
    } }); await adapter.search({ query: 'example' }, undefined, capability)
  }
  const tinyfish = new SearchAdapter({ id: 'tinyfish', enabled: () => true, resolveKey: async () => 'key', transport: async url => {
    assert.equal(new URL(url).searchParams.get('domain_type'), 'research_paper'); return Response.json({ results: [{ ...fixture, authors: ['Author'], year: 2025, venue: 'Venue' }] })
  } })
  const result = await tinyfish.search({ query: 'example' }, undefined, 'papers')
  assert.deepEqual(result.sources[0].authors, ['Author']); assert.equal(result.sources[0].year, 2025)
})
test('Keenable keyless is explicit and invalid keys never fall back', async () => {
  let calls = 0
  const adapter = new SearchAdapter({ id: 'keenable', enabled: () => true, resolveKey: async () => undefined, transport: async (url, init) => {
    assert.equal(new URL(url).pathname, '/v1/search/public'); assert.equal(init.headers['X-Keenable-Title'], 'DSH Search Providers'); return Response.json({ results: [] })
  } })
  await adapter.search({ query: 'example' })
  const rejected = new SearchAdapter({ id: 'keenable', enabled: () => true, resolveKey: async () => 'invalid-test-key', transport: async url => {
    calls++; assert.equal(new URL(url).pathname, '/v1/search'); return new Response('secret-key echoed by upstream', { status: 401 })
  } })
  await assert.rejects(rejected.search({ query: 'example' }), error => error.code === 'authentication-failed' && !error.message.includes('secret-key'))
  assert.equal(calls, 1)
})
test('Disabled or unconfigured providers fail before sending', async () => {
  const transport = async () => { throw new Error('must not send') }
  for (const [enabled, key, code] of [[false, 'key', 'provider-disabled'], [true, undefined, 'missing-key']]) {
    const adapter = new SearchAdapter({ id: 'exa', enabled: () => enabled, resolveKey: async () => key, transport })
    await assert.rejects(adapter.search({ query: 'example' }), error => error.code === code)
  }
})
test('Invalid URL results and large snippets are bounded', async () => {
  const adapter = new SearchAdapter({ id: 'exa', enabled: () => true, resolveKey: async () => 'key', transport: async () => Response.json({ results: [
    { url: 'javascript:alert(1)' }, { url: 'https://user:password@example.com/' }, { ...fixture, highlights: ['a'.repeat(7000)] }, fixture,
  ] }) })
  const result = await adapter.search({ query: 'example', maxResults: 1 })
  assert.equal(result.sources.length, 1); assert.equal(result.sources[0].snippet.length, 6000); assert.equal(result.truncated, true)
})
test('Malformed API payloads fail instead of masquerading as no results', async () => {
  const adapter = new SearchAdapter({ id: 'exa', enabled: () => true, resolveKey: async () => 'key', transport: async () => Response.json({ error: 'bad request' }) })
  await assert.rejects(adapter.search({ query: 'example' }), error => error.code === 'invalid-response')
})
test('Response size limit applies while reading streamed JSON', async () => {
  await assert.rejects(jsonRequest(async () => new Response('x'.repeat(MAX_RESPONSE_BYTES + 1)), 'https://example.com', {}), error => error.code === 'response-too-large')
})
test('Caller cancellation reaches transport and prevents queued work', async () => {
  const abort = new AbortController(), gate = new RequestGate(1)
  let release, sent = 0
  const first = gate.run(() => new Promise(resolve => { release = resolve }))
  const second = gate.run(async () => { sent++ }, abort.signal)
  await new Promise(resolve => setImmediate(resolve)); abort.abort(); release(); await first
  await assert.rejects(second); assert.equal(sent, 0)
  const adapter = new SearchAdapter({ id: 'exa', enabled: () => true, resolveKey: async () => 'key', transport: async () => { sent++; return Response.json({ results: [] }) } })
  await assert.rejects(adapter.search({ query: 'example' }, abort.signal)); assert.equal(sent, 0)
})
test('Brave image search returns original image and source page URLs', async () => {
  const adapter = new SearchAdapter({ id: 'brave', enabled: () => true, resolveKey: async () => 'key', transport: async url => {
    assert.equal(new URL(url).pathname, '/res/v1/images/search'); return Response.json({ results: [{ ...fixture, properties: { url: 'https://example.com/image.png' } }] })
  } })
  assert.equal((await adapter.search({ query: 'example' }, undefined, 'images')).sources[0].mediaUrl, 'https://example.com/image.png')
})
for (const [id, payload] of [
  ['keenable', { url: fixture.url, content: 'Page text' }], ['nimble', { url: fixture.url, status_code: 200, data: { markdown: 'Page text' } }],
  ['tinyfish', { results: [{ url: fixture.url, text: 'Page text' }] }], ['parallel', { results: [{ url: fixture.url, full_content: 'Page text' }] }], ['exa', { results: [{ url: fixture.url, text: 'Page text' }] }],
]) test(`${id}: extract text without inventing a target status`, async () => {
  const adapter = new SearchAdapter({ id, enabled: () => true, resolveKey: async () => 'key', transport: async () => Response.json(payload) })
  const result = await adapter.extract(fixture.url)
  assert.equal(result.content, 'Page text'); assert.equal(result.truncated, false); assert.equal('statusCode' in result, false)
})
test('A failed page extraction is an error even when the API returns 200', async () => {
  const adapter = new SearchAdapter({ id: 'tinyfish', enabled: () => true, resolveKey: async () => 'key', transport: async () => Response.json({ results: [], errors: [{ code: 'TIMEOUT' }] }) })
  await assert.rejects(adapter.extract(fixture.url))
})
test('Extraction rejects local and credential-bearing URLs', () => {
  for (const url of ['http://localhost/', 'http://127.1/', 'http://169.254.169.254/', 'http://10.1.2.3/', 'http://[::1]/', 'http://user:pass@example.com/', 'file:///etc/passwd']) assert.throws(() => publicUrl(url))
  assert.equal(publicUrl('https://example.com/'), 'https://example.com/')
})
test('Unsupported capability configurations are rejected', () => {
  assert.throws(() => validateSettings({ providers: {}, tools: { papers: { provider: 'brave', enabled: true } } }))
  assert.throws(() => validateSettings({ providers: { unknown: {} }, tools: {} }))
})
test('Unloading the adapter aborts requests and blocks later sends', async () => {
  let ready
  const entered = new Promise(resolve => { ready = resolve })
  const adapter = new SearchAdapter({ id: 'exa', enabled: () => true, resolveKey: async () => 'key', transport: async (_url, init) => {
    ready(); return new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true }))
  } })
  const pending = adapter.search({ query: 'example' }); await entered; adapter.dispose()
  await assert.rejects(pending); assert.equal(adapter.available(), false)
  await assert.rejects(adapter.search({ query: 'example' }))
})
