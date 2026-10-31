import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SearchAdapter } from '../src/adapters.ts'
import { SearchBroker } from '../src/broker.ts'
import { NS, PROVIDERS, validateSettings } from '../src/catalog.ts'
import { MODES, OPTION_FIELDS, calendarDate, effectiveOptions, validateSearchOptions } from '../src/search-options.ts'
import { searchWithFallback } from '../src/search-fallback.ts'
import { registerExtraTools } from '../src/tools.ts'
import { toolOptions } from '../src/tool-options.ts'

const query = '検索 options & filters', after = '2024-02-29', before = '2026-10-18'
const fixture = { url: 'https://example.com/article', title: 'Example', snippet: 'Result' }
const invalid = error => error.code === 'invalid-request'
function harness(id, saved = {}, respond) {
  const calls = []
  let current = saved
  const adapter = new SearchAdapter({ id, enabled: () => true, resolveKey: async () => 'mock-key', searchOptions: () => current, transport: async (url, init) => {
    const call = { url: new URL(url), init, body: init.body ? JSON.parse(init.body) : undefined }
    calls.push(call)
    return respond ? respond(call) : Response.json(id === 'brave' && call.url.pathname.includes('/web/') ? { web: { results: [fixture] } } : { results: [fixture] })
  } })
  return { adapter, calls, setSaved: value => { current = value } }
}

// Wire assertions follow the official API references cited by issues #10–12, not common field names.
const mappings = [
  ['keenable', { mode: 'realtime', includeDomains: ['EXAMPLE.com'], publishedAfter: after, publishedBefore: before, acquiredAfter: after, acquiredBefore: before, queryTime: before }, {
    query, max_results: 8, mode: 'realtime', site: 'example.com', published_after: after, published_before: before, acquired_after: after, acquired_before: before, query_time: before,
  }],
  ['nimble', { mode: 'lite', country: 'jp', language: 'ja', includeDomains: ['EXAMPLE.com'], excludeDomains: ['noise.example'], publishedAfter: after, publishedBefore: before }, {
    query, max_results: 8, search_depth: 'lite', full_content: false, focus: 'general', country: 'JP', locale: 'ja', include_domains: ['example.com'], exclude_domains: ['noise.example'], start_date: after, end_date: before,
  }],
  ['tinyfish', { country: 'jp', language: 'ja', includeDomains: ['EXAMPLE.com', 'docs.example.com'], excludeDomains: ['noise.example'], publishedAfter: after, publishedBefore: before, purpose: 'Compare examples & document behavior' }, {
    query, domain_type: 'web', location: 'JP', language: 'ja', include_domains: 'example.com,docs.example.com', exclude_domains: 'noise.example', after_date: after, before_date: before, purpose: 'Compare examples & document behavior',
  }],
  ['parallel', { mode: 'turbo', country: 'jp', includeDomains: ['EXAMPLE.com'], publishedAfter: after }, {
    search_queries: [query], mode: 'turbo', advanced_settings: { location: 'jp', source_policy: { include_domains: ['example.com'], after_date: after }, max_results: 8 },
  }],
  ['exa', { mode: 'instant', country: 'jp', includeDomains: ['EXAMPLE.com'], excludeDomains: ['noise.example'], publishedAfter: after, publishedBefore: before }, {
    query, type: 'instant', numResults: 8, contents: { highlights: true }, userLocation: 'JP', includeDomains: ['example.com'], excludeDomains: ['noise.example'], startPublishedDate: `${after}T00:00:00.000Z`, endPublishedDate: `${before}T23:59:59.999Z`,
  }],
  ['brave', { country: 'jp', language: 'jp', uiLanguage: 'ja-JP', safeSearch: 'strict', freshness: `${after}to${before}`, goggles: ['https://example.com/first.goggle', 'https://example.org/second.goggle'] }, {
    q: query, count: '8', country: 'JP', search_lang: 'jp', ui_lang: 'ja-JP', safesearch: 'strict', freshness: `${after}to${before}`, goggles: ['https://example.com/first.goggle', 'https://example.org/second.goggle'],
  }],
  ['perplexity', { mode: 'fast', country: 'jp', language: 'ja', excludeDomains: ['EXAMPLE.com', 'noise.example'], publishedAfter: after, publishedBefore: before, updatedAfter: after, updatedBefore: before }, {
    query, search_type: 'fast', max_results: 8, country: 'JP', search_language_filter: ['ja'], search_domain_filter: ['-example.com', '-noise.example'], search_after_date_filter: '02/29/2024', search_before_date_filter: '10/18/2026', last_updated_after_filter: '02/29/2024', last_updated_before_filter: '10/18/2026',
  }],
]
for (const [id, options, expected] of mappings) test(`${id}: configured fields map to the actual HTTP request`, async () => {
  const h = harness(id, options)
  const result = await h.adapter.search({ query })
  assert.equal(result.sources[0].url, fixture.url); assert.equal(h.calls.length, 1)
  const call = h.calls[0]
  if (id === 'tinyfish' || id === 'brave') {
    const actual = Object.fromEntries(call.url.searchParams)
    if (id === 'brave') actual.goggles = call.url.searchParams.getAll('goggles')
    assert.deepEqual(actual, expected); assert.equal(call.init.method, 'GET'); assert.equal(call.body, undefined)
  } else { assert.deepEqual(call.body, expected); assert.equal(call.init.method, 'POST') }
  assert.equal(call.init.redirect, 'error'); assert.ok(call.init.signal instanceof AbortSignal)
  h.setSaved({})
  await h.adapter.search({ query, options })
  assert.equal(h.calls.length, 2)
  assert.equal(h.calls[1].url.href, call.url.href)
  assert.deepEqual(h.calls[1].body, call.body, 'per-call and saved options use the same provider mapping')
})
for (const id of PROVIDERS.filter(row => row.webSearch !== false).map(row => row.id)) test(`${id}: omitted settings keep legacy defaults and do not invent regional filters`, async () => {
  const h = harness(id)
  await h.adapter.search({ query, options: {} })
  const { body, url } = h.calls[0]
  for (const key of ['country', 'location', 'language', 'locale', 'search_lang', 'ui_lang', 'userLocation', 'search_language_filter']) {
    assert.equal(url.searchParams.has(key), false); assert.equal(Object.hasOwn(body ?? {}, key), false)
  }
  if (id === 'keenable') assert.equal(Object.hasOwn(body, 'mode'), false)
  if (id === 'nimble') { assert.equal(body.search_depth, 'lite'); assert.equal(body.focus, 'general'); assert.equal(body.full_content, false) }
  if (id === 'parallel') assert.equal(body.mode, 'fast')
  if (id === 'exa') assert.equal(body.type, 'auto')
  if (id === 'perplexity') assert.equal(body.search_type, 'web')
  h.adapter.dispose()
})
for (const [id, modes] of Object.entries({ keenable: ['pro', 'realtime'], nimble: ['lite', 'standard'], parallel: ['turbo', 'fast', 'basic', 'advanced'], exa: ['auto', 'instant', 'fast'], perplexity: ['web', 'fast'] })) test(`${id}: each exposed mode is validated and sent without changing result caps`, async () => {
  assert.deepEqual(MODES[id], modes)
  for (const mode of modes) {
    const h = harness(id)
    await h.adapter.search({ query, maxResults: 100, options: { mode } })
    const body = h.calls[0].body
    assert.equal(body[id === 'nimble' ? 'search_depth' : id === 'exa' ? 'type' : id === 'perplexity' ? 'search_type' : 'mode'], mode)
    assert.equal(id === 'parallel' ? body.advanced_settings.max_results : body[id === 'exa' ? 'numResults' : 'max_results'], id === 'parallel' || id === 'perplexity' ? 20 : id === 'keenable' ? 50 : 100)
    if (id === 'nimble' && mode === 'standard') assert.equal(Object.hasOwn(body, 'focus'), false, 'focus is documented as lite-only')
  }
})
test('Nimble specialized focus remains lite and standard is never silently generalized', async () => {
  for (const [capability, focus] of [['news', 'news'], ['papers', 'academic'], ['code', 'coding']]) {
    const h = harness('nimble', { mode: 'lite' })
    await h.adapter.search({ query }, undefined, capability)
    assert.equal(h.calls[0].body.focus, focus); assert.equal(h.calls[0].body.search_depth, 'lite')
    await assert.rejects(h.adapter.search({ query, options: { mode: 'standard' } }, undefined, capability), invalid)
    assert.equal(h.calls.length, 1)
    const saved = harness('nimble', { mode: 'standard' })
    await assert.rejects(saved.adapter.search({ query }, undefined, capability), invalid)
    assert.equal(saved.calls.length, 0)
    await saved.adapter.search({ query, options: { mode: 'lite' } }, undefined, capability)
    assert.equal(saved.calls[0].body.focus, focus)
  }
})
test('TinyFish paper years use research_paper parameters and preserve inclusive 0/9999 boundaries', async () => {
  const h = harness('tinyfish', { yearMin: 0, yearMax: 9999, language: 'ja' })
  await h.adapter.search({ query }, undefined, 'papers')
  assert.equal(h.calls[0].url.searchParams.get('domain_type'), 'research_paper')
  assert.equal(h.calls[0].url.searchParams.get('pub_year_min'), '0'); assert.equal(h.calls[0].url.searchParams.get('pub_year_max'), '9999')
  await assert.rejects(h.adapter.search({ query }), invalid)
  assert.equal(h.calls.length, 1)
})
test('Exa people/company preserve categories and reject unsupported dates or people exclusions', async () => {
  for (const [capability, category] of [['people', 'people'], ['companies', 'company']]) {
    const h = harness('exa', { country: 'JP', mode: 'instant', includeDomains: ['example.com'] })
    await h.adapter.search({ query }, undefined, capability)
    assert.equal(h.calls[0].body.category, category); assert.equal(h.calls[0].body.type, 'instant'); assert.equal(h.calls[0].body.userLocation, 'JP')
    for (const date of ['publishedAfter', 'publishedBefore']) await assert.rejects(h.adapter.search({ query, options: { [date]: after } }, undefined, capability), invalid)
    if (capability === 'people') await assert.rejects(h.adapter.search({ query, options: { excludeDomains: ['noise.example'] } }, undefined, capability), invalid)
    else { await h.adapter.search({ query, options: { excludeDomains: ['noise.example'] } }, undefined, capability); assert.deepEqual(h.calls[1].body.excludeDomains, ['noise.example']) }
  }
})
test('Perplexity people uses its separate type/cap and never inherits saved web mode', async () => {
  const h = harness('perplexity', { mode: 'fast', country: 'JP', language: 'ja' })
  await h.adapter.search({ query, maxResults: 100 }, undefined, 'people')
  assert.equal(h.calls[0].body.search_type, 'people'); assert.equal(h.calls[0].body.max_results, 50)
  assert.deepEqual(h.calls[0].body.search_language_filter, ['ja']); assert.equal(h.calls[0].body.country, 'JP')
  for (const mode of ['web', 'fast', 'people']) await assert.rejects(h.adapter.search({ query, options: { mode } }, undefined, 'people'), invalid)
  assert.equal(h.calls.length, 1)
})
test('Relative freshness maps to each provider field without being mixed with absolute dates', async () => {
  for (const [id, options, field, expected] of [['nimble', { recency: 'week' }, 'time_range', 'week'], ['tinyfish', { recencyMinutes: 5256000 }, 'recency_minutes', '5256000'], ['perplexity', { recency: 'hour' }, 'search_recency_filter', 'hour']]) {
    const h = harness(id)
    await h.adapter.search({ query, options })
    assert.equal(id === 'tinyfish' ? h.calls[0].url.searchParams.get(field) : h.calls[0].body[field], expected)
  }
})
test('Brave specialized requests keep country/language fields and documented local result caps', async () => {
  for (const capability of ['web', 'news', 'images', 'videos']) {
    const h = harness('brave', { country: 'JP', language: 'jp', safeSearch: 'strict' })
    await h.adapter.search({ query, maxResults: 100 }, undefined, capability)
    assert.equal(h.calls[0].url.pathname, `/res/v1/${capability === 'web' ? 'web' : capability}/search`)
    assert.equal(h.calls[0].url.searchParams.get('country'), 'JP'); assert.equal(h.calls[0].url.searchParams.get('search_lang'), 'jp')
    assert.equal(h.calls[0].url.searchParams.get('safesearch'), 'strict'); assert.equal(h.calls[0].url.searchParams.get('count'), capability === 'web' ? '20' : '50')
  }
})
test('Perplexity include filters are positive domains; Parallel exclusions stay nested with result cap', async () => {
  const p = harness('perplexity'), parallel = harness('parallel')
  await p.adapter.search({ query, options: { includeDomains: ['example.com'] } })
  assert.deepEqual(p.calls[0].body.search_domain_filter, ['example.com'])
  await parallel.adapter.search({ query, maxResults: 100, options: { excludeDomains: ['noise.example'], country: 'GB' } })
  assert.deepEqual(parallel.calls[0].body.advanced_settings, { location: 'gb', source_policy: { exclude_domains: ['noise.example'] }, max_results: 20 })
})
test('Per-call fields replace saved values individually, retain omissions, and do not mutate saved settings', async () => {
  const saved = { country: 'US', language: 'en', mode: 'lite', includeDomains: ['saved.example'], excludeDomains: ['blocked.example'] }
  const copy = structuredClone(saved), h = harness('nimble', saved)
  await h.adapter.search({ query, options: { country: 'jp', includeDomains: ['call.example'] } })
  assert.deepEqual(h.calls[0].body, { query, max_results: 8, search_depth: 'lite', full_content: false, focus: 'general', country: 'JP', locale: 'en', include_domains: ['call.example'], exclude_domains: ['blocked.example'] })
  await h.adapter.search({ query, options: {} })
  assert.deepEqual(h.calls[1].body.include_domains, ['saved.example']); assert.equal(h.calls[1].body.country, 'US')
  assert.deepEqual(saved, copy)
  h.setSaved({ country: 'GB', language: 'en' }); await h.adapter.search({ query })
  assert.equal(h.calls[2].body.country, 'GB'); assert.equal('include_domains' in h.calls[2].body, false)
})
test('Saved and per-call options are validated after merging, including newly conflicting combinations', async () => {
  for (const [id, saved, call] of [['tinyfish', { recencyMinutes: 60 }, { publishedAfter: after }], ['parallel', { includeDomains: ['example.com'] }, { excludeDomains: ['noise.example'] }], ['perplexity', { publishedBefore: after }, { publishedAfter: before }]]) {
    const h = harness(id, saved)
    await assert.rejects(h.adapter.search({ query, options: call }), invalid); assert.equal(h.calls.length, 0)
  }
  const h = harness('exa', { mode: 'not-valid' })
  await h.adapter.search({ query, options: { mode: 'fast' } })
  assert.equal(h.calls[0].body.type, 'fast')
})
test('Every unsupported option fails closed instead of disappearing from the wire', () => {
  const keys = [...new Set(Object.values(OPTION_FIELDS).flat())]
  for (const provider of PROVIDERS) for (const key of keys.filter(key => !OPTION_FIELDS[provider.id].includes(key))) assert.throws(() => validateSearchOptions(provider.id, { [key]: 'unexpected' }), invalid, `${provider.id}:${key}`)
  for (const id of ['nimble', 'tinyfish', 'exa', 'brave']) assert.throws(() => validateSearchOptions(id, { madeUpField: 'x' }), invalid)
})
test('Malformed caller option objects are invalid requests, not provider response failures', async () => {
  for (const value of [null, [], 'country=JP', 1, true]) {
    assert.throws(() => validateSearchOptions('nimble', value), invalid)
    const h = harness('nimble')
    await assert.rejects(h.adapter.search({ query, options: value }), invalid); assert.equal(h.calls.length, 0)
    const saved = harness('nimble', value)
    await assert.rejects(saved.adapter.search({ query }), invalid); assert.equal(saved.calls.length, 0)
  }
})
test('Country and language validation is provider-specific, with Brave Japanese and display locale separate', () => {
  for (const id of ['nimble', 'tinyfish', 'perplexity']) {
    assert.deepEqual(validateSearchOptions(id, { country: 'jp', language: 'ja' }), { country: 'JP', language: 'ja' })
    for (const language of ['jp', 'JA', 'ja-JP', 'zz', '', 42]) assert.throws(() => validateSearchOptions(id, { language }), invalid)
  }
  assert.deepEqual(validateSearchOptions('brave', { country: 'jp', language: 'jp', uiLanguage: 'ja-JP' }), { country: 'JP', language: 'jp', uiLanguage: 'ja-JP' })
  for (const language of ['ja', 'zh', 'en-US']) assert.throws(() => validateSearchOptions('brave', { language }), invalid)
  for (const language of ['zh-hans', 'zh-hant', 'en-gb']) assert.equal(validateSearchOptions('brave', { language }).language, language)
  for (const uiLanguage of ['ja', 'jp', 'JA-jp', 'zz-ZZ']) assert.throws(() => validateSearchOptions('brave', { uiLanguage }), invalid)
  for (const id of ['nimble', 'tinyfish', 'perplexity', 'exa', 'brave', 'parallel']) for (const country of ['UK', 'ZZ', 'Japan', '', 1]) assert.throws(() => validateSearchOptions(id, { country }), invalid)
  for (const id of ['brave', 'parallel']) assert.throws(() => validateSearchOptions(id, { country: 'AD' }), invalid)
  assert.equal(validateSearchOptions('exa', { country: 'AD' }).country, 'AD')
})
test('Unimplemented or cross-provider modes are rejected before requests', async () => {
  for (const [id, mode] of [['exa', 'deep'], ['exa', 'deep-lite'], ['exa', 'deep-reasoning'], ['exa', 'realtime'], ['nimble', 'fast'], ['parallel', 'instant'], ['perplexity', 'people'], ['keenable', 'standard'], ['tinyfish', 'fast'], ['brave', 'fast'], ['fxtwitter', 'fast']]) {
    const h = harness(id)
    await assert.rejects(h.adapter.search({ query, options: { mode } }), invalid); assert.equal(h.calls.length, 0)
  }
})
test('Date validation rejects normalized/impossible dates and accepts real leap-day and equal bounds', () => {
  assert.equal(calendarDate('2024-02-29'), true)
  for (const value of ['2023-02-29', '2024-02-30', '2026-04-31', '2026-13-01', '2026-00-01', '2026-01-00', '2026-1-01', '2026-01-01T00:00:00Z', '10/18/2026', 2026]) assert.equal(calendarDate(value), false)
  for (const id of ['keenable', 'nimble', 'tinyfish', 'parallel', 'exa', 'perplexity']) {
    for (const value of ['2023-02-29', '2024-02-30', '', true]) assert.throws(() => validateSearchOptions(id, { publishedAfter: value }), invalid)
    assert.equal(validateSearchOptions(id, { publishedAfter: after }).publishedAfter, after)
  }
  for (const [id, first, last] of [['keenable', 'acquiredAfter', 'acquiredBefore'], ['perplexity', 'updatedAfter', 'updatedBefore'], ['exa', 'publishedAfter', 'publishedBefore']]) {
    assert.throws(() => validateSearchOptions(id, { [first]: before, [last]: after }), invalid)
    assert.doesNotThrow(() => validateSearchOptions(id, { [first]: after, [last]: after }))
  }
})
test('Relative recency and publication date combinations reject for every supported provider', () => {
  for (const [id, field, value] of [['nimble', 'recency', 'week'], ['tinyfish', 'recencyMinutes', 60], ['perplexity', 'recency', 'day']]) for (const bound of ['publishedAfter', 'publishedBefore']) assert.throws(() => validateSearchOptions(id, { [field]: value, [bound]: after }), invalid)
  for (const id of ['nimble', 'perplexity']) for (const recency of ['minute', 'all', 'Week', '', 1]) assert.throws(() => validateSearchOptions(id, { recency }), invalid)
  for (const recencyMinutes of [0, -1, 5256001, 1.5, '60', Infinity, NaN]) assert.throws(() => validateSearchOptions('tinyfish', { recencyMinutes }), invalid)
  assert.equal(validateSearchOptions('tinyfish', { recencyMinutes: 1 }).recencyMinutes, 1)
})
test('TinyFish paper-specific restrictions reject dates/recency and non-paper year bounds', () => {
  for (const options of [{ publishedAfter: after }, { publishedBefore: before }, { recencyMinutes: 60 }]) assert.throws(() => validateSearchOptions('tinyfish', options, 'papers'), invalid)
  for (const capability of ['web', 'news']) for (const field of ['yearMin', 'yearMax']) assert.throws(() => validateSearchOptions('tinyfish', { [field]: 2020 }, capability), invalid)
  for (const field of ['yearMin', 'yearMax']) for (const year of [-1, 10000, 2020.5, '2020', NaN]) assert.throws(() => validateSearchOptions('tinyfish', { [field]: year }, 'papers'), invalid)
  assert.throws(() => validateSearchOptions('tinyfish', { yearMin: 2026, yearMax: 2020 }, 'papers'), invalid)
  assert.deepEqual(validateSearchOptions('tinyfish', { yearMin: 2024, yearMax: 2024 }, 'papers'), { yearMin: 2024, yearMax: 2024 })
})
test('Domain inputs enforce conservative plain-name/count bounds and provider combinations', () => {
  for (const includeDomains of [[], Array(21).fill('example.com'), ['https://example.com'], ['example.com/path'], ['*.example.com'], ['localhost'], ['127.0.0.1'], ['-bad.example'], ['bad-.example'], ['a..example'], ['x'.repeat(64) + '.example'], [42], 'example.com']) assert.throws(() => validateSearchOptions('nimble', { includeDomains }), invalid)
  assert.equal(validateSearchOptions('nimble', { includeDomains: Array(20).fill('EXAMPLE.com') }).includeDomains.length, 20)
  for (const id of ['parallel', 'perplexity']) assert.throws(() => validateSearchOptions(id, { includeDomains: ['example.com'], excludeDomains: ['noise.example'] }), invalid)
  assert.throws(() => validateSearchOptions('keenable', { includeDomains: ['one.example', 'two.example'] }), invalid)
  for (const id of ['nimble', 'tinyfish', 'exa']) assert.doesNotThrow(() => validateSearchOptions(id, { includeDomains: ['example.com'], excludeDomains: ['noise.example'] }))
})
test('Brave freshness, safe search, Goggle count/URLs and image restrictions are validated', () => {
  for (const freshness of ['pd', 'pw', 'pm', 'py', `${after}to${before}`, `${after}to${after}`]) assert.equal(validateSearchOptions('brave', { freshness }).freshness, freshness)
  for (const freshness of ['day', '2023-02-29to2024-02-29', `${before}to${after}`, '2024-01-01', '']) assert.throws(() => validateSearchOptions('brave', { freshness }), invalid)
  for (const safeSearch of ['off', 'moderate', 'strict']) assert.equal(validateSearchOptions('brave', { safeSearch }).safeSearch, safeSearch)
  for (const safeSearch of ['on', true, 'Strict']) assert.throws(() => validateSearchOptions('brave', { safeSearch }), invalid)
  for (const goggles of [[], Array(4).fill('https://example.com/g'), ['http://example.com/g'], ['https://user:secret@example.com/g'], ['https://localhost/g'], ['not-url'], [42], ['https://example.com/' + 'g'.repeat(2001)]]) assert.throws(() => validateSearchOptions('brave', { goggles }), invalid)
  for (const options of [{ freshness: 'pd' }, { uiLanguage: 'ja-JP' }, { goggles: ['https://example.com/g'] }, { safeSearch: 'moderate' }]) assert.throws(() => validateSearchOptions('brave', options, 'images'), invalid)
  assert.doesNotThrow(() => validateSearchOptions('brave', { country: 'JP', language: 'jp', safeSearch: 'strict' }, 'images'))
  assert.throws(() => validateSearchOptions('brave', { goggles: ['https://example.com/g'] }, 'videos'), invalid)
  assert.doesNotThrow(() => validateSearchOptions('brave', { goggles: ['https://example.com/g'] }, 'news'))
})
test('Goggle URLs described as public reject loopback, private ranges and private hostnames', () => {
  for (const url of ['https://127.0.0.1/g', 'https://10.1.2.3/g', 'https://169.254.169.254/g', 'https://search.internal/g', 'https://search.local/g', 'https://foo.169.254.169.254.nip.io/g', 'https://localtest.me/g', 'https://0--1.sslip.io/g', 'https://example.com\\@169.254.169.254/g']) assert.throws(() => validateSearchOptions('brave', { goggles: [url] }), invalid, url)
  assert.deepEqual(validateSearchOptions('brave', { goggles: ['https://EXAMPLE.com:443/goggles/a'] }).goggles, ['https://example.com/goggles/a'])
})
test('TinyFish purpose has an explicit 2000-character maximum and wrong types fail', () => {
  assert.equal(validateSearchOptions('tinyfish', { purpose: 'a'.repeat(2000) }).purpose.length, 2000)
  for (const purpose of ['', 'a'.repeat(2001), {}, false]) assert.throws(() => validateSearchOptions('tinyfish', { purpose }), invalid)
})
test('Settings validation preserves omitted options but validates configured provider options', () => {
  assert.doesNotThrow(() => validateSettings({ providers: { exa: { enabled: true }, tinyfish: { search: { yearMin: 2020 } } }, tools: {} }))
  assert.throws(() => validateSettings({ providers: { nimble: { search: { country: 'ZZ' } } }, tools: {} }), invalid)
  assert.throws(() => validateSettings({ providers: { fxtwitter: { search: { language: 'ja' } } }, tools: {} }), invalid)
  assert.deepEqual(effectiveOptions('nimble'), {})
})

function fallbackMap(primaryOptions = {}, candidateOptions = {}) {
  const calls = []
  const primary = harness('brave', primaryOptions, () => { calls.push('brave'); return new Response('quota', { status: 429 }) })
  const candidate = harness('nimble', candidateOptions, () => { calls.push('nimble'); return Response.json({ results: [fixture] }) })
  const final = harness('exa', {}, () => { calls.push('exa'); return Response.json({ results: [fixture] }) })
  return { calls, map: new Map([['brave', primary.adapter], ['nimble', candidate.adapter], ['exa', final.adapter]]) }
}
test('Any primary saved region/filter/mode disables cross-provider fallback after HTTP 429', async () => {
  for (const saved of [{ country: 'JP' }, { language: 'jp' }, { safeSearch: 'strict' }, { freshness: 'pd' }, { goggles: ['https://example.com/g'] }]) {
    const h = fallbackMap(saved)
    await assert.rejects(searchWithFallback({ primary: 'brave', adapters: h.map, request: { query } }), error => error.code === 'rate-limited' && error.status === 429)
    assert.deepEqual(h.calls, ['brave'])
  }
  const calls = [], primary = harness('exa', { mode: 'fast' }, () => { calls.push('exa'); return new Response('quota', { status: 429 }) }), candidate = harness('nimble', {}, () => { calls.push('nimble'); return Response.json({ results: [] }) })
  await assert.rejects(searchWithFallback({ primary: 'exa', adapters: new Map([['exa', primary.adapter], ['nimble', candidate.adapter]]), request: { query } }), error => error.code === 'rate-limited')
  assert.deepEqual(calls, ['exa'])
})
test('Saved filters used by an in-flight request still block fallback after settings are cleared', async () => {
  const calls = []
  const primary = harness('brave', { country: 'JP' }, () => {
    calls.push('brave'); primary.setSaved({})
    return new Response('quota', { status: 429 })
  })
  const candidate = harness('nimble', {}, () => { calls.push('nimble'); return Response.json({ results: [fixture] }) })
  await assert.rejects(searchWithFallback({ primary: 'brave', adapters: new Map([['brave', primary.adapter], ['nimble', candidate.adapter]]), request: { query } }), error => error.code === 'rate-limited')
  assert.deepEqual(calls, ['brave'])
  assert.equal(primary.calls[0].url.searchParams.get('country'), 'JP')
})
test('Per-call options stop fallback too, even when also supported by another provider', async () => {
  const h = fallbackMap()
  await assert.rejects(searchWithFallback({ primary: 'brave', adapters: h.map, request: { query, options: { country: 'JP' } } }), error => error.code === 'rate-limited')
  assert.deepEqual(h.calls, ['brave'])
})
test('In-flight per-call filter mutation cannot re-enable unconstrained fallback', async () => {
  const request = { query, options: { country: 'JP' } }, calls = []
  const primary = harness('brave', {}, () => {
    calls.push('brave'); delete request.options.country
    return new Response('quota', { status: 429 })
  })
  const candidate = harness('nimble', {}, () => { calls.push('nimble'); return Response.json({ results: [fixture] }) })
  await assert.rejects(searchWithFallback({ primary: 'brave', adapters: new Map([['brave', primary.adapter], ['nimble', candidate.adapter]]), request }), error => error.code === 'rate-limited')
  assert.deepEqual(calls, ['brave'])
})
test('Configured candidates are skipped, preventing fallback from adding their own silent conditions', async () => {
  const h = fallbackMap({}, { mode: 'standard', country: 'JP' })
  const result = await searchWithFallback({ primary: 'brave', adapters: h.map, request: { query, options: {} } })
  assert.equal(result.sources[0].url, fixture.url); assert.deepEqual(h.calls, ['brave', 'exa'])
  const empty = fallbackMap()
  await searchWithFallback({ primary: 'brave', adapters: empty.map, request: { query, options: {} } })
  assert.deepEqual(empty.calls, ['brave', 'nimble'])
})
test('Invalid option input does not send a primary or fallback request', async () => {
  const h = fallbackMap()
  await assert.rejects(searchWithFallback({ primary: 'brave', adapters: h.map, request: { query, options: { mode: 'fast' } } }), invalid)
  assert.deepEqual(h.calls, [])
})

function brokerHarness() {
  const mutations = [], updates = []
  const section = { ns: NS, revision: 7, value: { providers: { nimble: { enabled: true, search: { country: 'US', includeDomains: ['old.example'] } } }, tools: {} } }
  const broker = new SearchBroker({ settings: { describe: () => [section], mutate: async (...args) => { mutations.push(args) }, update: async (...args) => { updates.push(args) } }, credentials: {}, configEditor: {} })
  return { broker, section, mutations, updates }
}
test('Broker search-options atomically replaces only its subtree, and empty options clear old filters', async () => {
  const h = brokerHarness()
  assert.deepEqual(await h.broker.dispatch('search-options', { provider: 'nimble', revision: 7, options: { country: 'jp' } }), { saved: true })
  assert.deepEqual(h.mutations[0], [NS, [{ op: 'set', path: ['providers', 'nimble', 'search'], value: { country: 'JP' } }], 7])
  await h.broker.dispatch('search-options', { provider: 'nimble', revision: 7, options: {} })
  assert.deepEqual(h.mutations[1][1][0].value, {}); assert.deepEqual(h.updates, [])
  assert.equal(h.section.value.providers.nimble.enabled, true)
})
function defaultHarness({ native = 'deepseek-official', searchProvider = 'brave', edit } = {}) {
  let revision = 4
  const updates = []
  const section = { ns: NS, revision, value: { nativeSearchProvider: native, providers: { keenable: { enabled: true } }, tools: {} } }
  const config = { searchProvider, fetchProvider: 'keep' }
  const broker = new SearchBroker({
    settings: {
      describe: () => [{ ...section, revision }],
      update: async (_namespace, patch, expected) => {
        assert.equal(expected, revision)
        updates.push(structuredClone(patch))
        section.value = { ...section.value, ...patch }
        revision += 1
      },
      mutate: async () => { throw new Error('unexpected mutate') },
    },
    credentials: { describeRecord: async () => ({ configured: false, writable: true }), describe: async () => ({ configured: false }) },
    configEditor: {
      entries: () => [{ options: { id: 'web', name: '@deepseek-ai/dsh-web', config } }],
      edit: edit ?? (async () => { throw new Error('web edit failed') }),
    },
  })
  return { broker, section, updates, config, revision: () => revision, advanceRevision: async () => { revision += 1 } }
}
test('A failed web-provider edit restores the previous native provider', async () => {
  const editError = new Error('Configuration for "web" is overridden by a home patch or command-line overlay')
  const h = defaultHarness({ edit: async () => { throw editError } })
  const snapshot = await h.broker.snapshot()
  await assert.rejects(h.broker.dispatch('default', { provider: 'keenable', revision: snapshot.revision, searchRevision: snapshot.searchRevision }), error => error === editError)
  assert.deepEqual(h.updates, [{ nativeSearchProvider: 'brave' }, { nativeSearchProvider: 'deepseek-official' }])
  assert.equal(h.section.value.nativeSearchProvider, 'deepseek-official')
  assert.equal(h.config.searchProvider, 'brave')
})
test('A failed web edit does not roll back a concurrent settings update', async () => {
  const editError = new Error('web edit failed')
  let h
  h = defaultHarness({ edit: async () => {
    h.section.value.nativeSearchProvider = 'another-provider'
    // Simulate a separate revisioned edit while the web edit is pending.
    await h.advanceRevision()
    throw editError
  } })
  const snapshot = await h.broker.snapshot()
  await assert.rejects(h.broker.dispatch('default', { provider: 'keenable', revision: snapshot.revision, searchRevision: snapshot.searchRevision }), error => error === editError)
  assert.equal(h.section.value.nativeSearchProvider, 'another-provider')
  assert.deepEqual(h.updates, [{ nativeSearchProvider: 'brave' }])
})
test('A failed restore still reports the web edit error', async () => {
  const editError = new Error('Configuration entry is no longer available')
  const updates = []
  let revision = 4
  const section = { ns: NS, revision, value: { nativeSearchProvider: 'deepseek-official', providers: { keenable: { enabled: true } }, tools: {} } }
  const config = { searchProvider: 'brave', fetchProvider: 'keep' }
  const broker = new SearchBroker({
    settings: {
      describe: () => [{ ...section, revision }],
      update: async (_namespace, patch, expected) => {
        assert.equal(expected, revision)
        updates.push(structuredClone(patch))
        if (updates.length === 2) throw new Error('rollback-failed')
        section.value = { ...section.value, ...patch }
        revision += 1
      },
      mutate: async () => { throw new Error('unexpected mutate') },
    },
    credentials: { describeRecord: async () => ({ configured: false, writable: true }), describe: async () => ({ configured: false }) },
    configEditor: { entries: () => [{ options: { id: 'web', name: '@deepseek-ai/dsh-web', config } }], edit: async () => { throw editError } },
  })
  const snapshot = await broker.snapshot()
  await assert.rejects(broker.dispatch('default', { provider: 'keenable', revision: snapshot.revision, searchRevision: snapshot.searchRevision }), error => error === editError)
  assert.equal(section.value.nativeSearchProvider, 'brave')
})
test('An unchanged native provider is left in place when web search is saved', async () => {
  const edits = []
  const h = defaultHarness({ native: 'brave', searchProvider: 'brave', edit: async (_entry, change) => { edits.push(change(h.config, {})) } })
  const snapshot = await h.broker.snapshot()
  assert.deepEqual(await h.broker.dispatch('default', { provider: 'native', revision: snapshot.revision, searchRevision: snapshot.searchRevision }), { saved: true })
  assert.deepEqual(h.updates, [{ nativeSearchProvider: 'brave' }])
  assert.equal(edits[0].searchProvider, 'brave')
  assert.equal(edits[0].fetchProvider, 'keep')
})
test('Broker rejects stale revisions, unsupported providers and invalid options before mutation', async () => {
  const h = brokerHarness()
  await assert.rejects(h.broker.dispatch('search-options', { provider: 'nimble', revision: 6, options: {} }), error => error.code === 'settings-changed')
  for (const payload of [{ provider: 'nimble', revision: 7, options: { country: 'ZZ' } }, { provider: 'fxtwitter', revision: 7, options: {} }, { provider: 'nimble', revision: 7, options: null }]) await assert.rejects(h.broker.dispatch('search-options', payload), invalid)
  assert.deepEqual(h.mutations, []); assert.deepEqual(h.updates, [])
})
test('Provider-specific tool schemas expose only implemented fields/modes and describe precedence/fallback', () => {
  for (const id of PROVIDERS.map(provider => provider.id)) {
    const schema = toolOptions(id)
    assert.equal(schema.additionalProperties, false); assert.deepEqual(Object.keys(schema.properties), OPTION_FIELDS[id])
    assert.match(schema.description, /overrides.*saved/i); assert.match(schema.description, /disables.*fallback/i)
    if (MODES[id]) assert.deepEqual(schema.properties.mode.enum, MODES[id])
  }
})
test('Extra search tools pass per-call options and cancellation through the adapter', async () => {
  const definitions = [], registrations = new Map(), h = harness('exa', { country: 'US', mode: 'auto' })
  const ctx = { tools: { register: definition => { definitions.push(definition); return () => {} } } }
  const settings = { providers: { exa: { enabled: true, search: { country: 'US', mode: 'auto' } } }, tools: { web: { provider: 'exa', enabled: true } } }
  registerExtraTools(ctx, settings, new Map([['exa', h.adapter]]), registrations)
  assert.equal(definitions.length, 1); assert.equal(definitions[0].name, 'search_web')
  assert.match(definitions[0].description, /Saved options:/)
  const abort = new AbortController()
  await definitions[0].execute({ query, options: { country: 'JP', mode: 'instant' }, max_results: 30 }, { signal: abort.signal })
  assert.equal(h.calls[0].body.userLocation, 'JP'); assert.equal(h.calls[0].body.type, 'instant'); assert.equal(h.calls[0].body.numResults, 30)
  await assert.rejects(Promise.resolve().then(() => definitions[0].execute({ query, options: { language: 'ja' } }, { signal: abort.signal })), error => error.name === 'ToolArgsError' && /not a declared property/.test(error.message))
  assert.equal(h.calls.length, 1)
  abort.abort()
  await assert.rejects(definitions[0].execute({ query }, { signal: abort.signal }))
  assert.equal(h.calls.length, 1)
})
function searchTool(provider, adapters, capability = 'web') {
  const definitions = []
  const ctx = { tools: { register: definition => { definitions.push(definition); return () => {} } } }
  registerExtraTools(ctx, { providers: { [provider]: { enabled: true } }, tools: { [capability]: { provider, enabled: true } } }, adapters, new Map())
  return definitions[0]
}
test('Undeclared top-level country/mode fail instead of silently becoming unfiltered searches', async () => {
  for (const capability of ['web', 'papers']) {
    const h = harness('exa'), tool = searchTool('exa', new Map([['exa', h.adapter]]), capability)
    for (const extra of [{ country: 'JP' }, { mode: 'instant' }, { language: 'ja' }, { sort: 'latest' }]) {
      await assert.rejects(Promise.resolve().then(() => tool.execute({ query, ...extra }, {})), invalid)
      assert.equal(h.calls.length, 0)
    }
  }
})
test('next_page forbids options, count and undeclared overrides before sending and preserves pinned settings', async () => {
  const h = harness('tinyfish', {}, call => {
    const page = Number(call.url.searchParams.get('page') ?? 0)
    return Response.json({ page, results: Array.from({ length: 3 }, (_, index) => ({ ...fixture, url: `https://example.com/page-${page}-${index}` })) })
  })
  const tool = searchTool('tinyfish', new Map([['tinyfish', h.adapter]]))
  const first = await tool.execute({ query, options: { country: 'JP' }, max_results: 2 }, {})
  assert.equal(first.sources.length, 2); assert.match(first.nextPage, /^tinyfish:/)
  for (const extra of [{ options: {} }, { options: { country: 'JP' } }, { max_results: 2 }, { country: 'GB' }, { mode: 'fast' }, { sort: 'latest' }]) {
    await assert.rejects(Promise.resolve().then(() => tool.execute({ query, next_page: first.nextPage, ...extra }, {})), invalid)
    assert.equal(h.calls.length, 1)
  }
  await assert.rejects(tool.execute({ query: query + ' changed', next_page: first.nextPage }, {}), invalid)
  assert.equal(h.calls.length, 1)
  h.setSaved({ country: 'GB' })
  const next = await tool.execute({ query, next_page: first.nextPage }, {})
  assert.equal(h.calls.length, 2); assert.equal(h.calls[1].url.searchParams.get('page'), '1')
  assert.equal(h.calls[1].url.searchParams.get('location'), 'JP', 'continuation retains original call settings')
  assert.equal(next.sources.length, 2, 'continuation retains original page size'); assert.equal(next.page, 1)
})
test('A token issued by a fallback provider continues there, not on the selected primary provider', async () => {
  const exa = harness('exa', {}, () => new Response('quota', { status: 429 }))
  const tinyfish = harness('tinyfish', {}, call => {
    const page = Number(call.url.searchParams.get('page') ?? 0)
    return Response.json({ page, results: [{ ...fixture, url: `https://example.com/fallback-page-${page}` }] })
  })
  const adapters = new Map([['exa', exa.adapter], ['tinyfish', tinyfish.adapter]])
  const tool = searchTool('exa', adapters)
  const first = await tool.execute({ query, max_results: 3 }, {})
  assert.match(first.nextPage, /^tinyfish:/); assert.equal(exa.calls.length, 1); assert.equal(tinyfish.calls.length, 1)
  tinyfish.setSaved({ country: 'JP' })
  const next = await tool.execute({ query, next_page: first.nextPage }, {})
  assert.equal(next.page, 1); assert.equal(next.sources[0].url, 'https://example.com/fallback-page-1')
  assert.equal(exa.calls.length, 1, 'continuation must not retry the quota-limited primary')
  assert.equal(tinyfish.calls.length, 2); assert.equal(tinyfish.calls[1].url.searchParams.get('page'), '1')
  assert.equal(tinyfish.calls[1].url.searchParams.has('location'), false, 'later saved settings must not alter token options')
})
test('Changing saved search options replaces the extra-tool registration and disposes the old one', () => {
  const definitions = [], disposals = [], registrations = new Map()
  const ctx = { tools: { register: definition => { definitions.push(definition); return () => { disposals.push(definition) } } } }
  const adapters = new Map([['nimble', {}]])
  const settings = { providers: { nimble: { enabled: true, search: { country: 'US' } } }, tools: { web: { provider: 'nimble', enabled: true } } }
  registerExtraTools(ctx, settings, adapters, registrations)
  registerExtraTools(ctx, settings, adapters, registrations)
  assert.equal(definitions.length, 1)
  settings.providers.nimble.search = { country: 'JP' }
  registerExtraTools(ctx, settings, adapters, registrations)
  assert.equal(definitions.length, 2); assert.deepEqual(disposals, [definitions[0]]); assert.equal(registrations.size, 1)
  assert.match(definitions[1].description, /JP/)
})
