import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SearchAdapter } from '../src/adapters.ts'
import { xPostId } from '../src/fxtwitter.ts'

const post = { type: 'status', id: '20', text: 'Fixture post text', created_at: '2006-03-21T20:50:14Z', author: { name: 'Fixture author', screen_name: 'fixture' }, likes: 0, reposts: 2, replies: 3, views: null }
const adapter = (transport, enabled = () => true) => new SearchAdapter({ id: 'fxtwitter', enabled,
  resolveKey: async () => { throw new Error('FxTwitter must not read credentials') }, transport })

test('FxTwitter search is keyless and preserves source text and available metadata', async () => {
  const fx = adapter(async (url, init) => {
    const endpoint = new URL(url)
    assert.equal(endpoint.origin, 'https://api.fxtwitter.com'); assert.equal(endpoint.pathname, '/2/search')
    assert.equal(endpoint.searchParams.get('q'), '日本語 from:fixture'); assert.equal(endpoint.searchParams.get('feed'), 'top'); assert.equal(endpoint.searchParams.get('count'), '2')
    assert.equal(init.method, 'GET'); assert.equal(init.headers.authorization, undefined); assert.equal(init.headers['x-api-key'], undefined)
    return Response.json({ code: 200, results: [post], cursor: { bottom: 'next-page' } })
  })
  const result = await fx.xSearch({ query: '日本語 from:fixture', sort: 'top', maxResults: 2 })
  assert.deepEqual(result, { sources: [{ url: 'https://x.com/fixture/status/20', snippet: post.text, title: 'Fixture author (@fixture)', author: 'Fixture author', authorHandle: 'fixture', publishedAt: '2006-03-21T20:50:14.000Z', likes: 0, reposts: 2, replies: 3 }], truncated: true })
})
test('A supplied X post URL selects direct post retrieval', async () => {
  const fx = adapter(async url => {
    assert.equal(new URL(url).pathname, '/2/status/20'); assert.equal(new URL(url).search, '')
    return Response.json({ code: 200, status: post })
  })
  for (const query of ['https://x.com/jack/status/20?s=20', 'https://twitter.com/jack/status/20/photo/1', 'https://fixupx.com/jack/status/20', 'https://x.com/i/web/status/20']) {
    assert.equal((await fx.xSearch({ query })).sources[0].snippet, post.text)
  }
})
test('Post references reject credentials and unrelated or malformed URLs', () => {
  for (const query of ['https://evil.example/jack/status/20', 'https://x.com/jack', 'https://user:pass@x.com/jack/status/20', 'https://x.com/jack/status/20/extra']) assert.throws(() => xPostId(query))
  assert.equal(xPostId('ordinary keywords'), undefined)
})
for (const http of [200, 404]) test(`FxTwitter HTTP ${http} with code 404 never becomes an empty successful search`, async () => {
  const fx = adapter(async () => Response.json({ code: 404, results: [], cursor: {} }, { status: http }))
  await assert.rejects(fx.xSearch({ query: 'python' }), error => error.code === 'x-search-unavailable' && error.message.includes('unavailable search'))
})
test('A successful empty search is accepted when the API explicitly reports success', async () => {
  const fx = adapter(async () => Response.json({ code: 200, results: [], cursor: { bottom: null } }))
  assert.deepEqual(await fx.xSearch({ query: 'example' }), { sources: [], truncated: false })
})
test('Unavailable, mismatched and malformed posts are not presented as retrieved posts', async () => {
  for (const [status, code] of [[null, 'x-post-unavailable'], [{ type: 'tombstone', id: '20' }, 'x-post-unavailable'], [{ ...post, id: '21' }, 'invalid-response'], [{ ...post, text: null }, 'invalid-response']]) {
    const fx = adapter(async () => Response.json({ code: 200, status }))
    await assert.rejects(fx.xSearch({ query: 'https://x.com/jack/status/20' }), error => error.code === code)
  }
  const malformed = adapter(async () => Response.json({ code: 200, results: {} }))
  await assert.rejects(malformed.xSearch({ query: 'example' }), error => error.code === 'invalid-response')
})
test('Post data is bounded and missing metrics are not converted to zero', async () => {
  const fx = adapter(async () => Response.json({ code: 200, results: [
    { ...post, text: 'x'.repeat(6500), created_at: 'bad date', author: { name: 'a'.repeat(400), screen_name: '../bad' }, likes: -1, views: null },
    post, { type: 'tombstone', id: '21' },
  ] }))
  const result = await fx.xSearch({ query: 'example' })
  assert.equal(result.sources.length, 1); assert.equal(result.sources[0].snippet.length, 6000)
  assert.equal(result.sources[0].author.length, 200); assert.equal(result.sources[0].url, 'https://x.com/i/status/20')
  assert.equal(result.sources[0].publishedAt, undefined); assert.equal(result.sources[0].likes, undefined); assert.equal(result.sources[0].views, undefined)
  assert.equal(result.truncated, true)
})
test('FxTwitter rate limits and application errors remain failures', async () => {
  const limited = adapter(async () => Response.json({}, { status: 429 }))
  await assert.rejects(limited.xSearch({ query: 'example' }), error => error.code === 'rate-limited')
  const failed = adapter(async () => Response.json({ code: 500, message: 'private upstream details', results: [] }))
  await assert.rejects(failed.xSearch({ query: 'example' }), error => error.code === 'provider-failed' && !error.message.includes('private upstream details'))
})
test('Invalid or disabled X searches and ordinary web searches never send', async () => {
  let sent = 0
  const fx = adapter(async () => { sent++; return Response.json({}) })
  for (const request of [{ query: '' }, { query: 'a'.repeat(513) }, { query: 'ok', sort: 'invalid' }, { query: 'ok', maxResults: 101 }, { query: 'http://localhost/a/status/20' }]) await assert.rejects(fx.xSearch(request))
  await assert.rejects(fx.search({ query: 'example' }), error => error.code === 'unsupported-capability')
  await assert.rejects(adapter(async () => { sent++ }, () => false).xSearch({ query: 'example' }), error => error.code === 'provider-disabled')
  assert.equal(sent, 0)
})
test('Unloading FxTwitter aborts active and queued requests to completion', async () => {
  let entered, sent = 0
  const ready = new Promise(resolve => { entered = resolve })
  const fx = adapter(async (_url, init) => {
    if (++sent === 4) entered()
    return new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true }))
  })
  const completion = Promise.allSettled(Array.from({ length: 5 }, () => fx.xSearch({ query: 'example' })))
  try { await ready; fx.dispose(); assert.ok((await completion).every(row => row.status === 'rejected')); assert.equal(sent, 4) }
  finally { fx.dispose(); await completion }
})
