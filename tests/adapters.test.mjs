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
  for (const url of ['http://localhost/', 'http://127.1/', 'http://169.254.169.254/', 'http://10.1.2.3/', 'http://[::1]/', 'http://user:pass@example.com/', 'file:///etc/passwd', 'http://2130706433/', 'http://0x7f000001/', 'http://224.0.0.1/', 'http://100.64.0.1/', 'http://198.18.0.1/', 'http://169.254.169.254.nip.io/latest/meta-data', 'http://127.0.0.1.sslip.io/', 'http://10.0.0.1.xip.io/']) assert.throws(() => publicUrl(url), error => error.code === 'blocked-url' || error.code === 'invalid-request', url)
  assert.equal(publicUrl('https://example.com/'), 'https://example.com/')
  assert.equal(publicUrl('https://example.nip.io/'), 'https://example.nip.io/')
})
test('Public hostnames that only start like a private address stay requestable', () => {
  for (const url of ['https://10.com/', 'https://224.com/', 'https://0.com/', 'https://127.net/', 'https://192.168.com/', 'https://169.254.com/', 'https://172.16.com/', 'https://100.64.com/', 'https://198.18.com/']) assert.equal(publicUrl(url), url)
})
test('Keenable extraction sends a public lookalike hostname and still refuses a private address', async () => {
  const sent = []
  const adapter = new SearchAdapter({ id: 'keenable', enabled: () => true, resolveKey: async () => undefined, transport: async url => { sent.push(String(url)); return Response.json({ url: 'https://10.com/docs', content: 'Page text' }) } })
  assert.equal((await adapter.extract('https://10.com/docs')).content, 'Page text')
  assert.match(sent[0], /^https:\/\/api\.keenable\.ai\/v1\/fetch\/public\?/)
  assert.match(sent[0], /url=https%3A%2F%2F10\.com%2Fdocs/)
  await assert.rejects(adapter.extract('http://10.0.0.1/secret'), error => error.code === 'blocked-url' && sent.length === 1)
})
test('Public embedded addresses and absolute DNS names remain requestable', () => {
  assert.equal(publicUrl('https://example.com./'), 'https://example.com./')
  assert.equal(publicUrl('https://1.1.1.1.nip.io/'), 'https://1.1.1.1.nip.io/')
  assert.equal(publicUrl('https://1-1-1-1.sslip.io/'), 'https://1-1-1-1.sslip.io/')
  assert.equal(publicUrl('https://2001-4860-4860--8888.example.com/'), 'https://2001-4860-4860--8888.example.com/')
})
test('Embedded private addresses and rewritten hosts stay blocked before any request', () => {
  const blocked = [
    'https://app.127.0.0.1.nip.io/', 'https://foo.10.1.2.3.nip.io/', 'https://foo.192.168.1.20.nip.io/', 'https://foo.172.16.0.5.nip.io/',
    'https://foo.169.254.169.254.nip.io/latest/meta-data', 'https://10.0.0.1.traefik.me/', 'https://10.0.0.1.example.com/',
    'https://127-0-0-1.sslip.io/', 'https://10-1-2-3.sslip.io/', 'https://169-254-169-254.sslip.io/', 'https://a.169-254-169-254.sslip.io/', 'https://prefix-10-0-0-1.sslip.io/',
    'https://0--1.sslip.io/', 'https://fe80--1.sslip.io/',
    'https://localtest.me/', 'https://foo.localtest.me/', 'https://lvh.me/', 'https://foo.lvh.me/',
    'https://metadata.google.internal../', 'https://localhost../', 'https://foo.localhost../', 'https://metadata.google.internal.%2e/',
  ]
  for (const url of blocked) assert.throws(() => publicUrl(url), error => error.code === 'blocked-url', url)
  for (const url of ['https://example.com\\@169.254.169.254/latest', 'http://example.com\n@169.254.169.254/', 'https://example.com/\tprivate']) assert.throws(() => publicUrl(url), error => error.code === 'invalid-request', url)
})
test('Unsupported capability configurations are rejected', () => {
  assert.throws(() => validateSettings({ providers: {}, tools: { papers: { provider: 'brave', enabled: true } } }))
  assert.throws(() => validateSettings({ providers: { unknown: {} }, tools: {} }))
})
const privateUrls = [
  'http://127.0.0.1/secret',
  'http://169.254.169.254/latest/meta-data',
  'http://[::1]/secret',
  'http://localhost/secret',
  'http://10.1.2.3/secret',
  'http://192.168.0.10/secret',
  'http://metadata.google.internal/computeMetadata/v1/',
  'http://foo.169.254.169.254.nip.io/latest/meta-data',
  'http://prefix-10-0-0-1.sslip.io/secret',
  'http://0--1.sslip.io/secret',
  'http://fe80--1.sslip.io/secret',
  'http://localtest.me/secret',
  'http://foo.lvh.me/secret',
  'http://metadata.google.internal../computeMetadata/v1/',
  'http://localhost../secret',
]
test('Search results drop private and metadata URLs', async () => {
  const adapter = new SearchAdapter({ id: 'exa', enabled: () => true, resolveKey: async () => 'key', transport: async () => Response.json({ results: [
    ...privateUrls.map(url => ({ url, title: 'hidden' })),
    { url: 'https://example.com/article', title: 'Example' },
  ] }) })
  const result = await adapter.search({ query: 'example' })
  assert.deepEqual(result.sources.map(source => source.url), ['https://example.com/article'])
  assert.equal(result.truncated, true)
  assert.equal(JSON.stringify(result).includes('169.254'), false)
  assert.equal(JSON.stringify(result).includes('metadata.google.internal'), false)
  assert.equal(JSON.stringify(result).includes('localtest.me'), false)
  assert.equal(JSON.stringify(result).includes('lvh.me'), false)
  assert.equal(JSON.stringify(result).includes('sslip.io'), false)
})
test('Extraction does not call the provider for a blocked URL', async () => {
  for (const input of privateUrls) {
    let calls = 0
    const adapter = new SearchAdapter({ id: 'exa', enabled: () => true, resolveKey: async () => 'key', transport: async () => { calls++; return Response.json({}) } })
    await assert.rejects(adapter.extract(input), error => error.code === 'blocked-url', input)
    assert.equal(calls, 0, input)
  }
})
test('Extraction refuses a private final URL', async () => {
  for (const finalUrl of privateUrls) {
    const adapter = new SearchAdapter({ id: 'exa', enabled: () => true, resolveKey: async () => 'key', transport: async () => Response.json({ results: [{ url: 'https://example.com/article', final_url: finalUrl, text: 'secret' }] }) })
    await assert.rejects(adapter.extract('https://example.com/article'), error => error.code === 'blocked-url')
  }
})
test('Aborting a request frees its concurrency slot before the request settles', async () => {
  const gate = new RequestGate(1)
  const controller = new AbortController()
  const hung = gate.run(() => new Promise(() => {}), controller.signal)
  controller.abort()
  let ran = false
  await gate.run(async () => { ran = true })
  assert.equal(ran, true)
  hung.catch(() => {})
})
test('An AbortSignal timeout is a timeout error and caller cancellation is not', async () => {
  const timeout = new DOMException('The operation was aborted due to timeout', 'TimeoutError')
  await assert.rejects(jsonRequest(async () => { throw timeout }, 'https://example.com', {}), error => error.code === 'timeout')
  const caller = AbortSignal.abort(new DOMException('The operation was aborted', 'AbortError'))
  await assert.rejects(jsonRequest(async () => { throw new DOMException('The operation was aborted', 'AbortError') }, 'https://example.com', {}, caller), error => error.name === 'AbortError' && error.code !== 'timeout')
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
