import assert from 'node:assert/strict'
import { hostFixture } from './host-fixture.mjs'
import { providerRoute } from '../src/catalog.ts'
const fixture = await hostFixture()
const { ctx, rpc, value, entry } = fixture
const originalFetch = globalThis.fetch
try {
  const nativeSearch = ctx.tools.get('web_search'), nativeFetch = ctx.tools.get('web_fetch')
  const prompt = await ctx.systemPrompt.assemble()
  assert.equal((await rpc('list')).entries.length, 7)
  assert.equal(ctx.tools.get('search_news'), undefined)
  await rpc('save-key', { provider: 'exa', key: 'fixture-secret-key' })
  let snapshot = await rpc('list')
  assert.equal(snapshot.entries.find(row => row.id === 'exa').configured, true)
  assert.equal(JSON.stringify(snapshot).includes('fixture-secret-key'), false)
  await rpc('provider', { provider: 'exa', enabled: true, revision: snapshot.revision })
  snapshot = await rpc('list')
  await assert.rejects(rpc('tool', { provider: 'exa', capability: 'papers', enabled: true, revision: snapshot.revision - 1 }))
  await rpc('tool', { provider: 'exa', capability: 'papers', enabled: true, revision: snapshot.revision })
  const paperTool = ctx.tools.get('search_papers'); assert.ok(paperTool)
  assert.equal(ctx.tools.get('web_search'), nativeSearch); assert.equal(ctx.tools.get('web_fetch'), nativeFetch)
  assert.deepEqual((await ctx.systemPrompt.assemble()).sections, prompt.sections)
  let requests = 0
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(init.body); requests++
    if (requests === 1) assert.equal(body.category, 'publication')
    return Response.json({ results: [{ url: `https://example.com/${body.query}`, title: body.query, highlights: ['source excerpt'] }] })
  }
  // Adapters bind fetch at construction, so intercept the public transport before a fresh plugin instance.
  await fixture.fiber.dispose()
  const plugin = await import('../dist/index.js')
  fixture.fiber = ctx.plugin({ inject: plugin.inject, apply: child => plugin.apply(child, { providers: { get: () => value.providers }, tools: { get: () => value.tools } }) }); await fixture.fiber.await()
  const paper = ctx.tools.get('search_papers')
  const paperResult = await paper.execute({ query: 'research' }, { signal: new AbortController().signal })
  assert.equal(paperResult.sources[0].url, 'https://example.com/research')
  const metadata = paper.output.presentationMeta({ query: 'research' }, paperResult)
  assert.equal(paper.presentResult({ query: 'research' }, { content: [], meta: metadata }).card, 'web')
  const result = await nativeSearch.execute({ queries: ['first', 'second'] }, { signal: new AbortController().signal })
  assert.equal(requests, 3); assert.equal(result.sources.length, 2)
  assert.ok(nativeSearch.output.render({ queries: ['first', 'second'] }, result)[0].text.includes('https://example.com/first'))
  snapshot = await rpc('list')
  await rpc('default', { provider: 'exa', revision: snapshot.revision, searchRevision: snapshot.searchRevision })
  assert.equal(entry.options.config.searchProvider, providerRoute('exa')); assert.equal(entry.options.config.fetchProvider, 'http')
  snapshot = await rpc('list')
  await rpc('provider', { provider: 'exa', enabled: false, revision: snapshot.revision })
  assert.equal(ctx.tools.get('search_papers'), undefined)
  assert.equal((await ctx.credentials.readRecord('dsh-search-providers/exa')).key, 'fixture-secret-key')
  snapshot = await rpc('list')
  await rpc('default', { provider: 'native', revision: snapshot.revision, searchRevision: snapshot.searchRevision })
  assert.equal(entry.options.config.searchProvider, 'deepseek')
  await fixture.fiber.dispose()
  assert.equal((await fixture.handler.fetch(new Request('http://localhost/api/dsh-search-providers/list', { method: 'POST' }))).status, 404)
  console.log('Official Cordis, Credentials, web_search/fetch, citations/replay, unchanged prompt sections, feature registration, default selection, and unload passed')
} finally { globalThis.fetch = originalFetch; await fixture.dispose() }
