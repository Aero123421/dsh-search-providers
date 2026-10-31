import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateJsonSchemaValue, valueSchemaSpecToJsonSchema } from '@deepseek-ai/dsh-tools'
import { applyWebSearchTool } from '@deepseek-ai/dsh-tool-web'
import { SearchAdapter } from '../src/adapters.ts'
import { withMetadataSnippets } from '../src/metadata-presentation.ts'
import { searchSchema, renderSearch, registerExtraTools } from '../src/tools.ts'

const source = { url: 'https://example.com/paper', title: 'Paper', snippet: 'Abstract', publishedAt: '2026-01-01', authors: ['Author'], doi: '10.1234/example', citationCount: 0, pdfUrl: 'https://example.com/paper.pdf', acquiredAt: '2026-01-02' }
test('Extra search canonical schema, model rendering and JSON replay preserve typed optional metadata', () => {
  const value = { sources: [source], truncated: false }
  validateJsonSchemaValue(valueSchemaSpecToJsonSchema(searchSchema), value)
  const replay = JSON.parse(JSON.stringify(value))
  validateJsonSchemaValue(valueSchemaSpecToJsonSchema(searchSchema), replay)
  assert.deepEqual(replay, value)
  assert.match(renderSearch(replay), /10.1234\/example/); assert.match(renderSearch(replay), /"citationCount":0/)
})
test('Actual DSH standard projection retains metadata via bounded snippet in result/meta/render and JSON replay', async () => {
  const value = withMetadataSnippets({ sources: [source], truncated: false })
  let standard
  const options = applyWebSearchTool.length >= 6 ? [8, 4, 6000, 60_000, true] : [8, 4, 60_000, true]
  applyWebSearchTool({ systemPrompt: { section: () => {}, getSectionOrder: () => 0 }, web: { search: async () => value }, tools: { register: tool => { standard = tool } } }, ...options)
  const result = await standard.execute({ queries: ['paper'] }, { signal: new AbortController().signal })
  validateJsonSchemaValue(standard.output.schema, result)
  assert.deepEqual(Object.keys(result.sources[0]).sort(), ['publishedAt', 'snippet', 'title', 'url'])
  assert.match(result.sources[0].snippet, /Source metadata \(external data\)/)
  assert.match(result.sources[0].snippet, /10.1234\/example/)
  const meta = standard.output.presentationMeta({ queries: ['paper'] }, result)
  const stored = JSON.parse(JSON.stringify({ value: result, meta }))
  assert.match(JSON.stringify(stored.meta), /paper.pdf/)
  assert.match(standard.output.render({ queries: ['paper'] }, stored.value)[0].text, /10.1234\/example/)
})
test('Standard snippet bounds report both metadata omission and displaced snippet text without mutating source', () => {
  const original = { ...source, snippet: 'a'.repeat(6000), authors: ['x'.repeat(2200)] }
  const value = withMetadataSnippets({ sources: [original], truncated: false })
  assert.equal(original.snippet.length, 6000)
  assert.ok(value.sources[0].snippet.length <= 6000); assert.equal(value.truncated, true)
  assert.match(value.sources[0].snippet, /citationCount/)
  assert.doesNotMatch(value.sources[0].snippet, /x{2200}/)
})
test('Keenable single extraction retains metadata without changing required legacy result fields', async () => {
  const a = new SearchAdapter({ id: 'keenable', enabled: () => true, resolveKey: async () => undefined,
    transport: async () => Response.json({ url: source.url, content: 'Page', author: 'Author', published_at: 1767225600 }) })
  const result = await a.extract(source.url)
  assert.equal(result.content, 'Page'); assert.equal(result.url, source.url); assert.equal(result.truncated, false)
  assert.equal(result.author, 'Author'); assert.equal(result.publishedAt, '2026-01-01T00:00:00.000Z')
  let tool
  registerExtraTools({ tools: { register: value => { tool = value; return () => {} } } }, { providers: { keenable: { enabled: true } }, tools: { extract: { provider: 'keenable', enabled: true } } }, new Map([['keenable', a]]), new Map())
  validateJsonSchemaValue(tool.output.schema, result)
  assert.match(tool.output.render({ url: source.url }, result)[0].text, /Author/)
})
test('Batch extraction shares adapter concurrency gate and unload cancellation with searches', async () => {
  let sent = 0, ready
  const entered = new Promise(resolve => { ready = resolve })
  const a = new SearchAdapter({ id: 'tinyfish', enabled: () => true, resolveKey: async () => 'key', transport: async (_url, init) => {
    if (++sent === 4) ready()
    return new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true }))
  } })
  const pending = Promise.allSettled([a.search({ query: 'x' }), ...Array.from({ length: 5 }, () => a.extractBatch([source.url]))])
  await entered; a.dispose(); const results = await pending
  assert.equal(sent, 4); assert.ok(results.every(row => row.status === 'rejected'))
  await assert.rejects(a.extractBatch([source.url])); assert.equal(sent, 4)
})
