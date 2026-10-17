import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sourceMetadata } from '../src/metadata.ts'

// Fixtures follow the public schemas linked in issue #13, not live API responses.
const publication = properties => ({ type: 'publication', id: 'publication:1', version: 1, properties })

test('Exa publication entity properties preserve named authors, IDs, date and incoming/outgoing citations', () => {
  const row = {
    publishedDate: '2026-10-01', author: 'Editorial team', entities: [
      { type: 'person', properties: { citationCount: 9999, year: 1900, authors: ['Not this paper'] } },
      publication({ year: 2026, date: '2026-09-30', authors: [{ name: 'Ada Lovelace', id: 'person:ada' }, { name: 'Grace Hopper', id: null }], doi: '10.1234/paper.567', citationCount: 12, referenceCount: 30, abstract: 'Must not become raw metadata' }),
    ], text: 'Do not copy full text', subpages: [{ url: 'https://example.org/subpage' }],
  }
  assert.deepEqual(sourceMetadata(row, 'exa', 'papers'), {
    metadata: {
      publishedAt: '2026-10-01', author: 'Editorial team', authors: ['Ada Lovelace', 'Grace Hopper'],
      authorDetails: [{ name: 'Ada Lovelace', id: 'person:ada' }, { name: 'Grace Hopper' }],
      year: 2026, doi: '10.1234/paper.567', citationCount: 12, referenceCount: 30,
    }, truncated: false,
  })
})

test('Exa publication metadata also survives a standard search without a capability', () => {
  assert.deepEqual(sourceMetadata({ entities: [publication({ date: '2024-02-29', authors: [{ name: 'Author', id: 'id' }], year: 2024 })] }, 'exa'), {
    metadata: { authors: ['Author'], authorDetails: [{ name: 'Author', id: 'id' }], year: 2024, publishedAt: '2024-02-29' }, truncated: false,
  })
})

test('Exa entity authors do not receive IDs from a different fallback author list', () => {
  assert.deepEqual(sourceMetadata({ entities: [publication({ authors: ['Entity author'] })], authors: [{ name: 'Fallback author', id: 'wrong-id' }] }, 'exa', 'papers'), { metadata: { authors: ['Entity author'] }, truncated: false })
})

test('Exa does not confuse person/company lifetime statistics with paper metadata', () => {
  assert.deepEqual(sourceMetadata({ entities: [{ type: 'company', properties: { research: { citationCount: 500 } } }, { type: 'person', properties: { research: { citationCount: 1000 } } }] }, 'exa', 'papers'), { metadata: {}, truncated: false })
})

test('TinyFish paper and news schemas preserve PDF, real zero citations, publisher and publication date', () => {
  assert.deepEqual(sourceMetadata({ authors: ['Author'], year: 2025, venue: 'Journal', cited_by_count: 0, pdf_url: 'https://example.org/paper.pdf' }, 'tinyfish', 'papers'), {
    metadata: { authors: ['Author'], year: 2025, venue: 'Journal', citationCount: 0, pdfUrl: 'https://example.org/paper.pdf' }, truncated: false,
  })
  assert.deepEqual(sourceMetadata({ date: '2026-10-17', publisher: 'News publisher' }, 'tinyfish', 'news'), { metadata: { publishedAt: '2026-10-17', publisher: 'News publisher' }, truncated: false })
})

test('TinyFish Fetch optional author and published_date normalize without inventing missing metadata', () => {
  assert.deepEqual(sourceMetadata({ author: 'Page Author', published_date: '2026-10-17T12:30:00Z' }, 'tinyfish', 'extract'), { metadata: { publishedAt: '2026-10-17T12:30:00Z', author: 'Page Author' }, truncated: false })
  assert.deepEqual(sourceMetadata({ author: null, published_date: null }, 'tinyfish', 'extract'), { metadata: {}, truncated: false })
  assert.deepEqual(sourceMetadata({ author: { name: 'Not a string' }, published_date: 'not a date' }, 'tinyfish', 'extract'), { metadata: {}, truncated: true })
})

test('Perplexity publication and last_updated dates remain distinct and date-only', () => {
  assert.deepEqual(sourceMetadata({ date: '2025-01-23', last_updated: '2025-09-25' }, 'perplexity'), { metadata: { publishedAt: '2025-01-23', updatedAt: '2025-09-25' }, truncated: false })
  assert.deepEqual(sourceMetadata({ last_updated: '2025-09-25' }, 'perplexity'), { metadata: { updatedAt: '2025-09-25' }, truncated: false })
})

test('Keenable Unix seconds convert to publication timestamps, not search/retrieval dates', () => {
  assert.deepEqual(sourceMetadata({ author: 'Jane Doe', published_at: 1768435200 }, 'keenable', 'extract'), { metadata: { publishedAt: '2026-01-15T00:00:00.000Z', author: 'Jane Doe' }, truncated: false })
  assert.deepEqual(sourceMetadata({ published_at: 0 }, 'keenable'), { metadata: { publishedAt: '1970-01-01T00:00:00.000Z' }, truncated: false })
  assert.deepEqual(sourceMetadata({ published_at: '1768435200' }, 'keenable'), { metadata: {}, truncated: true })
  for (const published_at of [Infinity, NaN, 253402300800, -62135596801, 0.1]) assert.deepEqual(sourceMetadata({ published_at }, 'keenable'), { metadata: {}, truncated: true })
})

test('Keenable Search ISO publication and acquisition dates remain distinct from Fetch Unix seconds', () => {
  assert.deepEqual(sourceMetadata({ published_at: '2026-01-15T10:30:00Z', acquired_at: '2026-01-16T08:12:34Z' }, 'keenable', 'web'), { metadata: { publishedAt: '2026-01-15T10:30:00Z', acquiredAt: '2026-01-16T08:12:34Z' }, truncated: false })
  assert.deepEqual(sourceMetadata({ acquired_at: '2026-01-16T08:12:34Z' }, 'keenable'), { metadata: { acquiredAt: '2026-01-16T08:12:34Z' }, truncated: false })
  for (const acquired_at of [1768435200, '2025-02-29', 'yesterday', {}]) assert.deepEqual(sourceMetadata({ acquired_at }, 'keenable'), { metadata: {}, truncated: true })
})

test('Nimble search date is not promoted to publication, modification or retrieval time', () => {
  assert.deepEqual(sourceMetadata({ date: '2026-10-17T01:00:00Z', published_at: '2026-10-16', last_updated: '2026-10-18' }, 'nimble'), { metadata: {}, truncated: false })
})

test('Brave image schema keeps original image, thumbnail dimensions and retrieval date separately', () => {
  assert.deepEqual(sourceMetadata({
    page_fetched: '2026-10-17T02:30:00Z', thumbnail: { src: 'https://example.org/thumb.jpg', width: 320, height: 180 },
    properties: { url: 'https://example.org/original.jpg', width: 1920, height: 1080, placeholder: 'Do not copy raw' },
  }, 'brave', 'images'), {
    metadata: { fetchedAt: '2026-10-17T02:30:00Z', thumbnailUrl: 'https://example.org/thumb.jpg', thumbnailWidth: 320, thumbnailHeight: 180, mediaUrl: 'https://example.org/original.jpg', width: 1920, height: 1080 }, truncated: false,
  })
})

test('Brave ambiguous page age and relative age never masquerade as publication or update dates', () => {
  const result = sourceMetadata({ page_age: '2026-10-16T12:30:00+09:00', page_fetched: '2026-10-17T01:00:00Z', fetched_content_timestamp: 1792198800, age: '2 days ago' }, 'brave')
  assert.deepEqual(result, { metadata: { pageDate: '2026-10-16T12:30:00+09:00', fetchedAt: '2026-10-17T01:00:00Z', fetchedContentTimestamp: 1792198800, age: '2 days ago' }, truncated: false })
  assert.equal('publishedAt' in result.metadata, false)
  assert.equal('updatedAt' in result.metadata, false)
})

test('Brave video schema preserves provider duration string, creator, views and subscription flag', () => {
  assert.deepEqual(sourceMetadata({ thumbnail: { src: 'https://example.org/thumb.jpg', original: 'https://example.org/original-thumb.jpg' }, video: { duration: '03:12', views: 0, creator: 'Creator', publisher: 'Publisher', requires_subscription: false, tags: ['science', 'research'], author: { ignored: 'unverified shape' } } }, 'brave', 'videos'), {
    metadata: { thumbnailUrl: 'https://example.org/thumb.jpg', thumbnailOriginalUrl: 'https://example.org/original-thumb.jpg', duration: '03:12', creator: 'Creator', publisher: 'Publisher', views: 0, requiresSubscription: false, tags: ['science', 'research'] }, truncated: false,
  })
})

test('Missing/null optional fields never invent authors, dates, dimensions or zero counts', () => {
  for (const [provider, capability] of [['exa', 'papers'], ['tinyfish', 'papers'], ['brave', 'images'], ['brave', 'videos'], ['perplexity'], ['keenable']]) {
    for (const row of [{}, { authors: null, year: null, published_at: null, date: null, last_updated: null, publisher: null, entities: null, thumbnail: null, properties: null, video: null }]) {
      assert.deepEqual(sourceMetadata(row, provider, capability), { metadata: {}, truncated: false })
    }
  }
})

test('Legacy paper author strings and author objects normalize without coercing nested objects', () => {
  assert.deepEqual(sourceMetadata({ authors: ['First', { name: 'Second', id: 'second', profile: { biography: 'ignored' } }, { name: { nested: 'No coercion' } }, 42], year: 2020, doi: 'https://doi.org/10.1234/example' }, 'exa', 'papers'), {
    metadata: { authors: ['First', 'Second'], authorDetails: [{ name: 'Second', id: 'second' }], year: 2020, doi: '10.1234/example' }, truncated: true,
  })
})

test('Invalid dates, numeric strings, unsafe counts, dimensions and DOI are omitted with truncation', () => {
  for (const date of ['2025-02-29', '2024-02-30', '2026-00-01', '2026-13-01', '2026-10-00', '0000-01-01', 'tomorrow', '2026-10-18T12:30:00', '2026-10-18T24:00:00Z', '2026-10-18T12:60:00Z', '2026-10-18T12:30:60Z', '2026-10-18T12:30:00+99:99', '2026-01-01'.repeat(100)]) {
    assert.deepEqual(sourceMetadata({ date }, 'perplexity'), { metadata: {}, truncated: true }, date)
  }
  for (const count of [-1, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, 1.5, '12', true, {}]) assert.deepEqual(sourceMetadata({ cited_by_count: count }, 'tinyfish', 'papers'), { metadata: {}, truncated: true })
  for (const dimension of [0, -1, 100001, 1.2, '100', NaN, Infinity, {}]) assert.deepEqual(sourceMetadata({ properties: { width: dimension } }, 'brave', 'images'), { metadata: {}, truncated: true })
  for (const doi of ['not-a-doi', '10.1234/', '10.12/short-prefix', '10.1234/bad space', { id: '10.1234/object' }, '10.1234/' + 'a'.repeat(300)]) assert.deepEqual(sourceMetadata({ doi }, 'exa', 'papers'), { metadata: {}, truncated: true })
  for (const year of [-1, 10000, 2026.5, '2026']) assert.deepEqual(sourceMetadata({ year }, 'tinyfish', 'papers'), { metadata: {}, truncated: true })
})

test('Unsafe, malformed, credential-bearing and oversized URLs are never shortened into usable links', () => {
  for (const bad of ['javascript:alert(1)', 'data:image/png,abcd', 'file:///etc/passwd', '//example.org/a.jpg', 'https://user:password@example.org/a.jpg', 'https://example.org/\nimage.jpg', 'https://example.org/' + 'a'.repeat(2048), 123, { url: 'https://example.org/' }]) {
    assert.deepEqual(sourceMetadata({ pdf_url: bad }, 'tinyfish', 'papers'), { metadata: {}, truncated: true })
    assert.deepEqual(sourceMetadata({ properties: { url: bad }, thumbnail: { src: bad } }, 'brave', 'images'), { metadata: {}, truncated: true })
  }
})

test('Length/count limits mark truncation and do not visit raw/deep hostile payloads', () => {
  let nested = { text: 'ignored secret' }
  for (let i = 0; i < 10000; i++) nested = { child: nested }
  const row = { authors: Array.from({ length: 100000 }, () => 'A'.repeat(500)), venue: 'V'.repeat(2000), year: 2026, abstract: nested, quote: nested }
  const result = sourceMetadata(row, 'tinyfish', 'papers')
  assert.equal(result.truncated, true)
  assert.equal(result.metadata.authors.length, 20)
  assert.equal(result.metadata.authors[0].length, 200)
  assert.equal(result.metadata.venue.length, 1000)
  assert.equal(result.metadata.year, 2026)
  assert.equal('abstract' in result.metadata, false)
  assert.equal('quote' in result.metadata, false)
  assert.deepEqual(sourceMetadata({ properties: nested, thumbnail: [], video: 'bad' }, 'brave', 'images'), { metadata: {}, truncated: true })
})

test('Exa entity scan is bounded and does not combine metadata from multiple publications', () => {
  const first = publication({ year: 2025, authors: ['First'] }), second = publication({ year: 2026, citationCount: 900 })
  assert.deepEqual(sourceMetadata({ entities: [first, second] }, 'exa'), { metadata: { authors: ['First'], year: 2025 }, truncated: true })
  assert.deepEqual(sourceMetadata({ entities: [...Array.from({ length: 8 }, () => ({ type: 'person' })), first] }, 'exa'), { metadata: {}, truncated: true })
  assert.deepEqual(sourceMetadata({ entities: [{ type: 'publication', properties: [] }, first] }, 'exa'), { metadata: { authors: ['First'], year: 2025 }, truncated: true })
})

test('Malformed recognized nested containers, cycles and accessor properties never throw or leak raw values', () => {
  for (const [row, provider, capability] of [
    [{ authors: { name: 'not a list' } }, 'exa', 'papers'],
    [{ entities: 'not a list' }, 'exa'],
    [{ entities: [null, [], 'bad', { type: 'publication', properties: 123 }] }, 'exa'],
    [{ thumbnail: false, video: [], properties: 123 }, 'brave', 'images'],
    [{ video: { tags: {} } }, 'brave', 'videos'],
    [{ video: { tags: [null] } }, 'brave', 'videos'],
    [{ entities: [null] }, 'exa'],
    [{ entities: [{}] }, 'exa'],
  ]) assert.deepEqual(sourceMetadata(row, provider, capability), { metadata: {}, truncated: true })
  const cyclic = {}; cyclic.name = cyclic
  assert.deepEqual(sourceMetadata({ authors: [cyclic] }, 'exa', 'papers'), { metadata: {}, truncated: true })
  const accessor = { year: 2026 }
  Object.defineProperty(accessor, 'authors', { get() { throw new Error('must not execute accessor') } })
  assert.deepEqual(sourceMetadata(accessor, 'exa', 'papers'), { metadata: { year: 2026 }, truncated: true })
  const inherited = Object.create({ authors: ['Inherited'] })
  assert.deepEqual(sourceMetadata(inherited, 'exa', 'papers'), { metadata: {}, truncated: true })
})

test('Aggregate metadata JSON cap includes escaping and keeps valid earlier fields', () => {
  const result = sourceMetadata({ authors: Array.from({ length: 20 }, () => ({ name: '\\'.repeat(200), id: '\\'.repeat(256) })), venue: 'V'.repeat(1000), publisher: 'P'.repeat(1000), pdf_url: 'https://example.org/' + 'p'.repeat(1800) }, 'tinyfish', 'papers')
  assert.equal(result.truncated, true)
  assert.ok(JSON.stringify(result.metadata).length <= 16384)
  assert.equal(result.metadata.authors.length, 20)
  assert.equal('authorDetails' in result.metadata, false)
  assert.equal('raw' in result.metadata, false)
})

test('Tags and durations are bounded, typed and never replaced by zero defaults', () => {
  const result = sourceMetadata({ video: { tags: Array.from({ length: 100 }, () => 't'.repeat(200)), duration: 'd'.repeat(200), requires_subscription: 'false', views: -1 } }, 'brave', 'videos')
  assert.equal(result.truncated, true)
  assert.equal(result.metadata.tags.length, 10)
  assert.equal(result.metadata.tags[0].length, 100)
  assert.equal(result.metadata.duration.length, 100)
  assert.equal('requiresSubscription' in result.metadata, false)
  assert.equal('views' in result.metadata, false)
  assert.deepEqual(sourceMetadata({ video: { duration: 0 } }, 'brave', 'videos'), { metadata: {}, truncated: true })
})
