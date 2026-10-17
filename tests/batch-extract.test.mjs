import { test } from 'node:test'
import assert from 'node:assert/strict'
import { batchExtract, BATCH_LIMITS } from '../src/batch-extract.ts'
import { jsonRequest, MAX_RESPONSE_BYTES } from '../src/http.ts'

const a = 'https://example.com/a', b = 'https://example.com/b', c = 'https://example.com/c'
const success = (provider, url, text = 'Page text', extra = {}) => ({ url, ...provider === 'parallel' ? { full_content: text } : { text }, ...extra })
const payload = (provider, results, failed = []) => ({ results, ...provider === 'exa' ? { statuses: [
  ...results.map(row => ({ id: row.id ?? row.url, status: 'success' })), ...failed,
] } : { errors: failed } })
const errorCode = code => error => error.code === code

for (const provider of ['tinyfish', 'parallel', 'exa']) test(`${provider}: one request and ordered partial failures with verified identifiers`, async () => {
  let calls = 0
  const failed = provider === 'tinyfish' ? { url: b, error: 'page_not_found', status: 404 }
    : provider === 'parallel' ? { url: b, error_type: 'fetch_error', http_status_code: 404, content: 'secret upstream error page' }
      : { id: b, status: 'error', error: { tag: 'CRAWL_NOT_FOUND', httpStatusCode: 404 } }
  const result = await batchExtract(provider, [a, b, c], async (url, body) => {
    calls++
    assert.equal(new URL(url).host, provider === 'tinyfish' ? 'api.fetch.tinyfish.ai' : `api.${provider === 'exa' ? 'exa.ai' : 'parallel.ai'}`)
    assert.deepEqual(body.urls, [a, b, c])
    if (provider === 'tinyfish') { assert.equal(body.format, 'markdown'); assert.equal(body.per_url_timeout_ms, 40000) }
    if (provider === 'parallel') assert.equal(body.advanced_settings.full_content.max_chars_per_result, 100001)
    if (provider === 'exa') assert.equal(body.text.maxCharacters, 100001)
    return payload(provider, [success(provider, c, 'C'), success(provider, a, 'A')], [failed])
  })
  assert.equal(calls, 1)
  assert.deepEqual(result.results.map(item => item.inputUrl), [a, b, c])
  assert.equal(result.results[0].content, 'A'); assert.equal(result.results[2].content, 'C')
  assert.equal(result.results[1].ok, false); assert.equal(result.results[1].error.status, 404)
  assert.equal(result.results[1].error.code, 'extract-failed')
  assert.equal(JSON.stringify(result).includes('secret'), false)
  assert.equal('status' in result.results[0], false); assert.equal('statusCode' in result.results[0], false)
  assert.equal(result.truncated, false)
})
for (const provider of ['tinyfish', 'parallel', 'exa']) test(`${provider}: canonical duplicates sent once and expanded in original order`, async () => {
  const original = 'https://EXAMPLE.com:443/a'
  const result = await batchExtract(provider, [original, b, a, b], async (_url, body) => {
    assert.deepEqual(body.urls, [a, b])
    return payload(provider, [success(provider, b, 'B'), success(provider, a, 'A')])
  })
  assert.deepEqual(result.results.map(item => item.inputUrl), [original, b, a, b])
  assert.deepEqual(result.results.map(item => item.content), ['A', 'B', 'A', 'B'])
})
test('TinyFish preserves final URL and never substitutes errors for successful text', async () => {
  const result = await batchExtract('tinyfish', [a, b, c], async () => ({
    results: [{ url: a, final_url: c, text: 'Redirected', title: 'T'.repeat(1100) }, { url: c, text: 'not a success', error: 'timeout' }],
    errors: [{ url: b, error: 'timeout' }],
  }))
  assert.equal(result.results[0].url, c); assert.equal(result.results[0].title.length, 1000)
  assert.equal(result.results[1].ok, false); assert.equal(result.results[1].error.providerCode, 'timeout')
  assert.equal('status' in result.results[1].error, false)
  assert.equal(result.results[2].ok, false)
})
test('Exa uses requested URL IDs for redirects and statuses rather than array position', async () => {
  const result = await batchExtract('exa', [a, b], async () => ({
    results: [{ id: b, url: 'https://example.net/final-b', text: 'B' }, { id: a, url: c, text: 'A' }],
    statuses: [{ id: b, status: 'success' }, { id: a, status: 'success' }],
  }))
  assert.deepEqual(result.results.map(item => item.content), ['A', 'B'])
  assert.deepEqual(result.results.map(item => item.url), [c, 'https://example.net/final-b'])
})
test('Exa opaque document IDs are not confused with requested URL identifiers', async () => {
  const result = await batchExtract('exa', [a, b], async () => ({
    results: [{ id: 'opaque-document-b', url: b, text: 'B' }, { id: 'opaque-document-a', url: c, text: 'Not verifiably A' }],
    statuses: [{ id: a, status: 'success' }, { id: b, status: 'success' }],
  }))
  assert.equal(result.results[0].ok, false); assert.equal(result.results[0].error.code, 'invalid-response')
  assert.equal(result.results[1].content, 'B')
})
test('Exa permits omitted or empty statuses when an input URL and nonempty text prove success', async () => {
  for (const statusFields of [{}, { statuses: [] }]) {
    const result = await batchExtract('exa', [a, b], async () => ({
      results: [{ id: 'opaque-b', url: b, text: 'B' }, { id: a, url: c, text: 'Redirected A' }], ...statusFields,
    }))
    assert.deepEqual(result.results.map(item => item.ok), [true, true])
    assert.deepEqual(result.results.map(item => item.content), ['Redirected A', 'B'])
    assert.deepEqual(result.results.map(item => item.url), [c, b])
    assert.ok(result.results.every(item => !('status' in item) && !('statusCode' in item)))
  }
})
test('Exa without statuses preserves reordered duplicate inputs and reports a missing result per input', async () => {
  const original = 'https://EXAMPLE.com:443/a'
  for (const statusFields of [{}, { statuses: [] }]) {
    const result = await batchExtract('exa', [original, b, a, c], async (_url, body) => {
      assert.deepEqual(body.urls, [a, b, c])
      return { results: [success('exa', b, 'B'), success('exa', a, 'A')], ...statusFields }
    })
    assert.deepEqual(result.results.map(item => item.inputUrl), [original, b, a, c])
    assert.deepEqual(result.results.map(item => item.ok), [true, true, true, false])
    assert.deepEqual(result.results.slice(0, 3).map(item => item.content), ['A', 'B', 'A'])
    assert.equal(result.results[3].error.code, 'invalid-response')
  }
})
test('Exa without statuses still rejects ambiguous response identity instead of zipping', async () => {
  for (const statusFields of [{}, { statuses: [] }]) {
    const ambiguous = await batchExtract('exa', [a, b, c], async () => ({
      results: [success('exa', a, 'A first'), success('exa', a, 'A second'), success('exa', b, 'B')], ...statusFields,
    }))
    assert.equal(ambiguous.results[0].error.code, 'invalid-response')
    assert.equal(ambiguous.results[1].content, 'B'); assert.equal(ambiguous.results[2].error.code, 'invalid-response')
    const unassociated = await batchExtract('exa', [a], async () => ({ results: [{ id: 'opaque', url: b, text: 'Not verifiably A' }], ...statusFields }))
    assert.equal(unassociated.results[0].error.code, 'invalid-response')
  }
})
test('Exa explicit null statuses is malformed rather than equivalent to omitted statuses', async () => {
  await assert.rejects(batchExtract('exa', [a], async () => ({ results: [success('exa', a)], statuses: null })), errorCode('invalid-response'))
})
test('Exa provided statuses remain authoritative even when other input statuses are omitted', async () => {
  const result = await batchExtract('exa', [a, b, c], async () => ({
    results: [success('exa', c, 'C'), success('exa', b, 'Must not succeed'), success('exa', a, 'A')],
    statuses: [{ id: b, status: 'error', error: { tag: 'CRAWL_TIMEOUT', httpStatusCode: null } }],
  }))
  assert.deepEqual(result.results.map(item => item.ok), [true, false, true])
  assert.equal(result.results[1].error.providerCode, 'CRAWL_TIMEOUT'); assert.equal('status' in result.results[1].error, false)
  for (const status of [null, undefined, 'pending', true, 200]) {
    const invalid = await batchExtract('exa', [a], async () => ({ results: [success('exa', a)], statuses: [{ id: a, status }] }))
    assert.equal(invalid.results[0].ok, false); assert.equal(invalid.results[0].error.code, 'invalid-response')
  }
})
test('Exa missing statuses do not turn missing or blank text into successful extraction', async () => {
  for (const text of [undefined, null, '', '  \n', { document: 'object' }]) {
    const result = await batchExtract('exa', [a], async () => ({ results: [{ url: a, text }] }))
    assert.equal(result.results[0].ok, false); assert.equal(result.results[0].error.code, 'extract-failed')
  }
})
test('Exa error status takes precedence over any returned content', async () => {
  const result = await batchExtract('exa', [a], async () => ({ results: [{ id: a, url: a, text: 'Not success' }], statuses: [{ id: a, status: 'error', error: { tag: 'CRAWL_TIMEOUT', httpStatusCode: null } }] }))
  assert.equal(result.results[0].ok, false); assert.equal(result.results[0].error.providerCode, 'CRAWL_TIMEOUT')
  assert.equal('status' in result.results[0].error, false)
})
for (const provider of ['tinyfish', 'parallel', 'exa']) test(`${provider}: missing identifiers never fall back to zipping`, async () => {
  const result = await batchExtract(provider, [a, b], async () => payload(provider, [success(provider, c, 'Unknown'), success(provider, undefined, 'No identifier')]))
  assert.deepEqual(result.results.map(item => item.ok), [false, false])
  assert.ok(result.results.every(item => item.error.code === 'invalid-response'))
})
test('Ambiguous duplicate response entries fail only the affected input', async () => {
  const result = await batchExtract('tinyfish', [a, b, c], async () => ({ results: [success('tinyfish', a, 'First'), success('tinyfish', a, 'Second'), success('tinyfish', b, 'B')], errors: [] }))
  assert.equal(result.results[0].error.code, 'invalid-response'); assert.equal(result.results[1].content, 'B'); assert.equal(result.results[2].ok, false)
  const conflicting = await batchExtract('parallel', [a], async () => ({ results: [success('parallel', a)], errors: [{ url: a, error_type: 'fetch_error' }] }))
  assert.equal(conflicting.results[0].error.code, 'invalid-response')
})
test('Global count and URL length limits fail before sending, even for repeated inputs', async () => {
  assert.deepEqual(BATCH_LIMITS.providerMaxUrls, { tinyfish: 10, parallel: 20, exa: 100 })
  assert.equal(BATCH_LIMITS.maxUrls, 10)
  let calls = 0
  const request = async () => { calls++; return { results: [], errors: [] } }
  for (const provider of ['tinyfish', 'parallel', 'exa']) {
    for (const inputs of [[], Array(11).fill(a), [a + 'x'.repeat(2049)], undefined, 'not-an-array']) await assert.rejects(batchExtract(provider, inputs, request), errorCode('invalid-request'))
  }
  for (const provider of ['keenable', 'nimble', 'brave', 'perplexity', 'fxtwitter']) await assert.rejects(batchExtract(provider, [a], request), errorCode('unsupported-capability'))
  assert.equal(calls, 0)
})
test('All inputs are public URL validated before any provider request', async () => {
  let calls = 0
  for (const invalid of ['http://localhost/', 'http://127.1/', 'http://169.254.169.254/', 'http://10.1.2.3/', 'http://[::1]/', 'https://user:secret@example.com/', 'file:///etc/passwd', 42]) {
    await assert.rejects(batchExtract('tinyfish', [a, invalid], async () => { calls++; return {} }))
  }
  assert.equal(calls, 0)
})
for (const provider of ['tinyfish', 'parallel', 'exa']) test(`${provider}: final URLs must pass public validation`, async () => {
  const row = success(provider, a, 'Unsafe', provider === 'tinyfish' ? { final_url: 'http://127.0.0.1/' } : { url: 'https://user:secret@example.com/', id: a })
  const response = payload(provider, [row])
  if (provider === 'exa') response.statuses = [{ id: a, status: 'success' }]
  const result = await batchExtract(provider, [a], async () => response)
  assert.equal(result.results[0].ok, false); assert.equal(result.results[0].error.code, 'invalid-response')
  assert.equal(JSON.stringify(result).includes('secret'), false)
})
test('Each page and the entire expanded output have separate text budgets', async () => {
  const huge = 'x'.repeat(100100)
  const result = await batchExtract('tinyfish', [a, b, a, c], async () => ({ results: [success('tinyfish', a, huge), success('tinyfish', b, 'b'.repeat(99990)), success('tinyfish', c, 'C')], errors: [] }))
  assert.deepEqual(result.results.map(item => item.content.length), [100000, 99990, 10, 0])
  assert.deepEqual(result.results.map(item => item.truncated), [true, false, true, true])
  assert.equal(result.results.reduce((sum, item) => sum + item.content.length, 0), 200000)
  assert.equal(result.truncated, true)
})
test('Empty or non-string page text is an explicit per-input failure', async () => {
  const result = await batchExtract('tinyfish', [a, b, c], async () => ({ results: [success('tinyfish', a, ''), success('tinyfish', b, '  \n'), success('tinyfish', c, { document: 'object' })], errors: [] }))
  assert.ok(result.results.every(item => !item.ok && item.error.code === 'extract-failed'))
})
test('Malformed envelopes and entries reject instead of pretending all pages succeeded', async () => {
  for (const response of [undefined, null, [], {}, { results: [] }, { results: [], errors: {} }, { results: [null], errors: [] }, { results: [], errors: [42] }, { results: Array(2).fill(success('tinyfish', a)), errors: [] }]) {
    await assert.rejects(batchExtract('tinyfish', [a], async () => response), errorCode('invalid-response'))
  }
  for (const status of [undefined, 'pending', 123]) {
    const result = await batchExtract('exa', [a], async () => ({ results: [success('exa', a)], statuses: [{ id: a, status }] }))
    assert.equal(result.results[0].error.code, 'invalid-response')
  }
})
test('Pre-cancel and mid-request cancel propagate without conversion into page failures', async () => {
  const abort = new AbortController(), reason = new Error('cancelled')
  abort.abort(reason)
  let calls = 0
  await assert.rejects(batchExtract('tinyfish', [a], async () => { calls++; return {} }, abort.signal), error => error === reason)
  assert.equal(calls, 0)
  const mid = new AbortController()
  await assert.rejects(batchExtract('tinyfish', [a], async (_url, _body, signal) => {
    assert.equal(signal, mid.signal); calls++; mid.abort(reason)
    return { results: [success('tinyfish', a)], errors: [] }
  }, mid.signal), error => error === reason)
  assert.equal(calls, 1)
})
test('Ten inputs are accepted and sparse inputs cannot evade validation', async () => {
  const urls = Array.from({ length: 10 }, (_, index) => `https://example.com/${index}`)
  const result = await batchExtract('tinyfish', urls, async (_url, body) => {
    assert.deepEqual(body.urls, urls)
    return { results: urls.map(url => success('tinyfish', url)), errors: [] }
  })
  assert.equal(result.results.length, 10); assert.ok(result.results.every(item => item.ok))
  let calls = 0
  await assert.rejects(batchExtract('tinyfish', Array(1), async () => { calls++; return {} }), errorCode('invalid-request'))
  assert.equal(calls, 0)
})
test('Original input labels survive caller mutation while a request is pending', async () => {
  const inputs = [a, b]
  const result = await batchExtract('tinyfish', inputs, async () => {
    inputs.reverse()
    return { results: [success('tinyfish', a, 'A'), success('tinyfish', b, 'B')], errors: [] }
  })
  assert.deepEqual(result.results.map(item => [item.inputUrl, item.content]), [[a, 'A'], [b, 'B']])
})
test('Duplicate failures expand consistently and invalid HTTP statuses are never invented', async () => {
  for (const status of [null, undefined, 0, 99, 600, '404', 404.5]) {
    const result = await batchExtract('tinyfish', [a, a], async () => ({ results: [], errors: [{ url: a, error: 'timeout', status }] }))
    assert.deepEqual(result.results.map(item => item.ok), [false, false])
    assert.ok(result.results.every(item => !('status' in item.error)))
  }
})
test('Conflicting and duplicate Exa statuses cannot become a success', async () => {
  for (const statuses of [[{ id: a, status: 'success', error: { tag: 'error' } }], [{ id: a, status: 'success' }, { id: a, status: 'error' }]]) {
    const inputs = statuses.length === 1 ? [a] : [a, b]
    const result = await batchExtract('exa', inputs, async () => ({ results: [success('exa', a)], statuses }))
    assert.equal(result.results[0].error.code, 'invalid-response')
  }
})
test('Transport failure is batch-level and not silently retried', async () => {
  const reason = new Error('request failed'); let calls = 0
  await assert.rejects(batchExtract('parallel', [a, b], async () => { calls++; throw reason }), error => error === reason)
  assert.equal(calls, 1)
})
test('Injected HTTP request retains the 2 MiB response limit', async () => {
  await assert.rejects(batchExtract('tinyfish', [a], (url, body, signal) => jsonRequest(async () => new Response('x'.repeat(MAX_RESPONSE_BYTES + 1)), url, { method: 'POST', body: JSON.stringify(body) }, signal)), errorCode('response-too-large'))
})
