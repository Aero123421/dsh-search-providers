import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Config, responseCode } from '../src/index.ts'
import { SearchError } from '../src/catalog.ts'
import { ignoredPath, readSettings, validateSettings } from '../src/catalog.ts'

const kept = (value) => readSettings(value)
test('A settings revision conflict stays settings-changed on the settings API', () => {
  const conflict = Object.assign(new Error('settings namespace "dsh-search-providers" changed since it was read (expected revision 1, now 2)'), { name: 'SettingsConflictError', code: 'SETTINGS_CONFLICT', expected: 1, actual: 2 })
  assert.equal(responseCode(conflict), 'settings-changed')
  assert.equal(responseCode(Object.assign(new Error('changed'), { code: 'SETTINGS_CONFLICT' })), 'settings-changed')
  assert.equal(responseCode(new SearchError('missing-key', 'Save an API key first')), 'missing-key')
  assert.equal(responseCode(new Error('busy')), 'busy')
  assert.equal(responseCode(new Error('profile-changed')), 'profile-changed')
  assert.equal(responseCode(new Error('nope')), 'unavailable')
})
test('Loading skips unknown providers and features', () => {
  const read = kept({
    providers: { keenable: { enabled: true }, 'not-a-provider': { enabled: true } },
    tools: { web: { provider: 'keenable', enabled: true }, papers: { provider: 'brave', enabled: true }, mystery: { provider: 'keenable', enabled: false } },
  })
  assert.equal(read.settings.providers.keenable.enabled, true)
  assert.equal(read.settings.providers['not-a-provider'], undefined)
  assert.deepEqual(read.settings.tools.web, { provider: 'keenable', enabled: true })
  assert.equal(read.settings.tools.papers, undefined)
  assert.equal(read.settings.tools.mystery, undefined)
  assert.deepEqual(read.problems.map(problem => problem.reason), ['unknown-provider', 'unsupported-capability', 'unknown-capability'])
})
test('Loading keeps a known provider when individual fields are missing, null, or the wrong type', () => {
  const read = kept({
    providers: {
      exa: {},
      brave: { enabled: 'yes', search: { country: 'US' } },
      nimble: null,
      tinyfish: { enabled: true },
      parallel: { search: null },
    },
    tools: { web: { provider: 'exa' }, news: null, extract: { provider: 'tinyfish', enabled: 'yes' } },
  })
  assert.equal(read.settings.providers.exa.enabled, undefined)
  assert.equal(read.settings.providers.brave.enabled, undefined)
  assert.equal(read.settings.providers.brave.search.country, 'US')
  assert.equal(read.settings.providers.nimble, undefined)
  assert.equal(read.settings.providers.tinyfish.enabled, true)
  assert.equal(read.settings.providers.parallel.search, undefined)
  assert.equal(read.settings.tools.web, undefined)
  assert.equal(read.settings.tools.news, undefined)
  assert.equal(read.settings.tools.extract, undefined)
  assert.ok(read.problems.some(problem => problem.id === 'brave' && problem.reason === 'invalid-state'))
  assert.ok(read.problems.some(problem => problem.id === 'nimble' && problem.reason === 'malformed'))
  assert.ok(read.problems.some(problem => problem.id === 'parallel' && problem.reason === 'invalid-search'))
  assert.ok(read.problems.some(problem => problem.id === 'web' && problem.reason === 'invalid-state'))
  assert.ok(read.problems.some(problem => problem.id === 'extract' && problem.reason === 'invalid-state'))
})
test('Loading ignores invalid dates and a non-object settings document', () => {
  const dated = kept({ providers: { exa: { enabled: true, search: { publishedAfter: '2026-02-31' } } }, tools: {} })
  assert.equal(dated.settings.providers.exa.enabled, true)
  assert.equal(dated.settings.providers.exa.search, undefined)
  assert.deepEqual(dated.problems, [{ scope: 'providers', id: 'exa', reason: 'invalid-search' }])
  for (const raw of [null, [], 'providers']) {
    const read = kept(raw)
    assert.deepEqual(read.settings, { providers: {}, tools: {} })
    assert.deepEqual(read.problems, [{ scope: 'providers', id: '', reason: 'malformed' }])
  }
  const sections = kept({ providers: null, tools: [] })
  assert.deepEqual(sections.problems, [{ scope: 'providers', id: '', reason: 'malformed' }, { scope: 'tools', id: '', reason: 'malformed' }])
})
test('Removal paths clear only the ignored field', () => {
  assert.deepEqual(ignoredPath({ scope: 'providers', id: 'not-a-provider', reason: 'unknown-provider' }), ['providers', 'not-a-provider'])
  assert.deepEqual(ignoredPath({ scope: 'providers', id: 'exa', reason: 'invalid-search' }), ['providers', 'exa', 'search'])
  assert.deepEqual(ignoredPath({ scope: 'providers', id: 'brave', reason: 'invalid-state' }), ['providers', 'brave', 'enabled'])
  assert.deepEqual(ignoredPath({ scope: 'tools', id: 'papers', reason: 'unsupported-capability' }), ['tools', 'papers'])
  assert.deepEqual(ignoredPath({ scope: 'providers', id: '', reason: 'malformed' }), ['providers'])
})
test('Saving from the UI still rejects unknown providers and unsupported features', () => {
  assert.throws(() => validateSettings({ providers: { unknown: {} }, tools: {} }))
  assert.throws(() => validateSettings({ providers: {}, tools: { papers: { provider: 'brave', enabled: true } } }))
  assert.doesNotThrow(() => validateSettings({ providers: { exa: { enabled: true } }, tools: {} }))
})
test('Startup accepts the saved documents that previously stopped the plugin', () => {
  const cases = [
    { providers: { 'not-a-provider': { enabled: true } }, tools: {} },
    { providers: { brave: { enabled: 'yes' } }, tools: {} },
    { providers: {}, tools: { mystery: { provider: 'exa', enabled: true } } },
    { providers: {}, tools: { papers: { provider: 'brave', enabled: true } } },
    { providers: { exa: { enabled: true, search: { mode: 'nope' } } }, tools: {} },
    { providers: 'exa', tools: {} },
    { providers: {}, tools: { web: { enabled: true } } },
    { providers: { exa: null }, tools: { web: { provider: 'exa', enabled: true } } },
  ]
  for (const raw of cases) {
    assert.doesNotThrow(() => Config(raw))
    const read = kept(raw)
    assert.ok(read.problems.length > 0, JSON.stringify(raw))
  }
  const unknown = kept(cases[0])
  assert.deepEqual(unknown.problems, [{ scope: 'providers', id: 'not-a-provider', reason: 'unknown-provider' }])
  const enabled = kept(cases[1])
  assert.equal(enabled.settings.providers.brave.enabled, undefined)
  assert.deepEqual(enabled.problems, [{ scope: 'providers', id: 'brave', reason: 'invalid-state' }])
  const feature = kept(cases[2])
  assert.deepEqual(feature.problems, [{ scope: 'tools', id: 'mystery', reason: 'unknown-capability' }])
  const unsupported = kept(cases[3])
  assert.deepEqual(unsupported.problems, [{ scope: 'tools', id: 'papers', reason: 'unsupported-capability' }])
  const mode = kept(cases[4])
  assert.equal(mode.settings.providers.exa.enabled, true)
  assert.equal(mode.settings.providers.exa.search, undefined)
  assert.deepEqual(mode.problems, [{ scope: 'providers', id: 'exa', reason: 'invalid-search' }])
  assert.deepEqual(kept(cases[5]).problems, [{ scope: 'providers', id: '', reason: 'malformed' }])
  assert.deepEqual(kept(cases[6]).problems, [{ scope: 'tools', id: 'web', reason: 'malformed' }])
  const absent = kept(cases[7])
  assert.deepEqual(absent.settings.tools.web, { provider: 'exa', enabled: true })
  assert.deepEqual(absent.problems, [{ scope: 'providers', id: 'exa', reason: 'malformed' }])
})
test('The config schema accepts malformed saved documents', () => {
  for (const raw of [
    undefined,
    {},
    { providers: null, tools: null, nativeSearchProvider: null },
    { providers: { 'not-a-provider': { enabled: 'yes' } }, tools: { mystery: null }, nativeSearchProvider: 1 },
    { providers: [], tools: 'nope' },
  ]) assert.doesNotThrow(() => Config(raw))
})
