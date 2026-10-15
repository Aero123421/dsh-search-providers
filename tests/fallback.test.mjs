import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SearchAdapter } from '../src/adapters.ts'
import { searchWithFallback } from '../src/search-fallback.ts'
import { en, ja, zh } from '../src/locales.ts'

const fixture = { url: 'https://example.com/article', title: 'Example', snippet: 'Snippet' }
function adapter(id, transport, options = {}) {
  return new SearchAdapter({ id, enabled: () => options.enabled !== false, resolveKey: async () => Object.hasOwn(options, 'key') ? options.key : 'key', transport })
}
function adapters(rows) { return new Map(rows.map(row => [row.options.id, row])) }
test('Locale dictionaries use the same keys', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(ja).sort())
  assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort())
  for (const key of ['pricingNote', 'fallbackNote', 'updateReason_restored', 'updateReason_restore-failed']) assert.equal(typeof en[key], 'string')
})
test('HTTP 429 tries the next enabled provider once and does not retry Brave', async () => {
  const calls = []
  const brave = adapter('brave', async () => { calls.push('brave'); return new Response('limited', { status: 429 }) })
  const nimble = adapter('nimble', async () => { calls.push('nimble'); return Response.json({ results: [fixture] }) })
  const exa = adapter('exa', async () => { calls.push('exa'); return Response.json({ results: [fixture] }) })
  const result = await searchWithFallback({ primary: 'brave', adapters: adapters([brave, nimble, exa]), request: { query: 'example' } })
  assert.equal(result.sources[0].url, fixture.url)
  assert.deepEqual(calls, ['brave', 'nimble'])
})
test('Authentication failure stays on the selected provider', async () => {
  const calls = []
  const brave = adapter('brave', async () => { calls.push('brave'); return new Response('no', { status: 401 }) })
  const exa = adapter('exa', async () => { calls.push('exa'); return Response.json({ results: [fixture] }) })
  await assert.rejects(searchWithFallback({ primary: 'brave', adapters: adapters([brave, exa]), request: { query: 'example' } }), error => error.code === 'authentication-failed')
  assert.deepEqual(calls, ['brave'])
})
test('A disabled or unsupported provider is skipped, and a later 429 continues', async () => {
  const calls = []
  const brave = adapter('brave', async () => { calls.push('brave'); return new Response('limited', { status: 429 }) })
  const nimble = adapter('nimble', async () => { calls.push('nimble'); return new Response('limited', { status: 429 }) }, { enabled: false })
  const exa = adapter('exa', async () => { calls.push('exa'); return new Response('limited', { status: 429 }) })
  const perplexity = adapter('perplexity', async () => { calls.push('perplexity'); return Response.json({ results: [fixture] }) })
  const result = await searchWithFallback({ primary: 'brave', adapters: adapters([brave, nimble, exa, perplexity]), request: { query: 'example' } })
  assert.equal(result.sources[0].url, fixture.url)
  assert.deepEqual(calls, ['brave', 'exa', 'perplexity'])
})
test('A missing key or authentication failure on a fallback provider tries the next one', async () => {
  const calls = []
  const brave = adapter('brave', async () => { calls.push('brave'); return new Response('limited', { status: 429 }) })
  const nimble = adapter('nimble', async () => { calls.push('nimble'); return new Response('no', { status: 403 }) })
  const exa = adapter('exa', async () => { calls.push('exa'); throw new Error('must not send') }, { key: undefined })
  const perplexity = adapter('perplexity', async () => { calls.push('perplexity'); return Response.json({ results: [fixture] }) })
  const result = await searchWithFallback({ primary: 'brave', adapters: adapters([brave, nimble, exa, perplexity]), request: { query: 'example' } })
  assert.equal(result.sources[0].url, fixture.url)
  assert.deepEqual(calls, ['brave', 'nimble', 'perplexity'])
})
test('A non-quota failure on the first fallback provider stops the search', async () => {
  const calls = []
  const brave = adapter('brave', async () => { calls.push('brave'); return new Response('limited', { status: 429 }) })
  const nimble = adapter('nimble', async () => { calls.push('nimble'); return new Response('down', { status: 500 }) })
  const exa = adapter('exa', async () => { calls.push('exa'); return Response.json({ results: [fixture] }) })
  await assert.rejects(searchWithFallback({ primary: 'brave', adapters: adapters([brave, nimble, exa]), request: { query: 'example' } }), error => error.code === 'provider-failed')
  assert.deepEqual(calls, ['brave', 'nimble'])
})
test('No alternate provider leaves the original HTTP 429', async () => {
  const calls = []
  const brave = adapter('brave', async () => { calls.push('brave'); return new Response('limited', { status: 429 }) })
  await assert.rejects(searchWithFallback({ primary: 'brave', adapters: adapters([brave]), request: { query: 'example' } }), error => error.code === 'rate-limited' && error.status === 429)
  assert.deepEqual(calls, ['brave'])
})
test('Image search does not call a provider without that capability', async () => {
  const calls = []
  const brave = adapter('brave', async () => { calls.push('brave'); return new Response('limited', { status: 429 }) })
  const exa = adapter('exa', async () => { calls.push('exa'); return Response.json({ results: [fixture] }) })
  await assert.rejects(searchWithFallback({ primary: 'brave', adapters: adapters([brave, exa]), request: { query: 'example' }, capability: 'images' }), error => error.code === 'rate-limited')
  assert.deepEqual(calls, ['brave'])
})
test('News search falls back only to a provider that supports news', async () => {
  const calls = []
  const brave = adapter('brave', async url => { calls.push(new URL(url).pathname); return new Response('limited', { status: 429 }) })
  const perplexity = adapter('perplexity', async () => { calls.push('perplexity'); return Response.json({ results: [fixture] }) })
  const exa = adapter('exa', async (_url, init) => { calls.push('exa'); assert.equal(JSON.parse(init.body).category, 'news'); return Response.json({ results: [fixture] }) })
  const result = await searchWithFallback({ primary: 'brave', adapters: adapters([brave, perplexity, exa]), request: { query: 'example' }, capability: 'news' })
  assert.equal(result.sources[0].url, fixture.url)
  assert.deepEqual(calls, ['/res/v1/news/search', 'exa'])
})
test('Cancellation after HTTP 429 does not start another provider', async () => {
  const calls = [], abort = new AbortController()
  const brave = adapter('brave', async () => { calls.push('brave'); abort.abort(); return new Response('limited', { status: 429 }) })
  const exa = adapter('exa', async () => { calls.push('exa'); return Response.json({ results: [fixture] }) })
  await assert.rejects(searchWithFallback({ primary: 'brave', adapters: adapters([brave, exa]), request: { query: 'example' }, signal: abort.signal }))
  assert.deepEqual(calls, ['brave'])
})
test('An invalid Brave query does not fall back', async () => {
  const calls = []
  const brave = adapter('brave', async () => { calls.push('brave'); return Response.json({ web: { results: [] } }) })
  const exa = adapter('exa', async () => { calls.push('exa'); return Response.json({ results: [fixture] }) })
  await assert.rejects(searchWithFallback({ primary: 'brave', adapters: adapters([brave, exa]), request: { query: 'a'.repeat(601) } }), error => error.code === 'invalid-request')
  assert.deepEqual(calls, [])
})
test('A disabled selected provider does not fall back', async () => {
  const calls = []
  const brave = adapter('brave', async () => { calls.push('brave'); return new Response('limited', { status: 429 }) }, { enabled: false })
  const exa = adapter('exa', async () => { calls.push('exa'); return Response.json({ results: [fixture] }) })
  await assert.rejects(searchWithFallback({ primary: 'brave', adapters: adapters([brave, exa]), request: { query: 'example' } }), error => error.code === 'provider-disabled')
  assert.deepEqual(calls, [])
})
