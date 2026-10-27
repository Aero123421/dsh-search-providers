import { test } from 'node:test'
import assert from 'node:assert/strict'
import { en, ja, zh } from '../src/locales.ts'
import { problemCopyKey, problemHeading } from '../src/problem-copy.ts'

test('A known provider with an unreadable value is not described as unrecognized', () => {
  const malformed = { scope: 'providers', id: 'exa', reason: 'malformed' }
  assert.equal(problemCopyKey(malformed), 'ignoredProviderValue')
  assert.equal(problemHeading(malformed, 'Exa', undefined), 'Exa')
  assert.equal(problemCopyKey({ scope: 'providers', id: 'future-provider', reason: 'unknown-provider' }), 'ignoredProvider')
  assert.equal(problemHeading({ scope: 'providers', id: 'future-provider', reason: 'unknown-provider' }, undefined, undefined), 'future-provider')
  assert.equal(problemCopyKey({ scope: 'providers', id: '', reason: 'malformed' }), 'ignoredSection')
  assert.equal(problemHeading({ scope: 'providers', id: '', reason: 'malformed' }, undefined, undefined), '')
  assert.equal(problemCopyKey({ scope: 'providers', id: 'exa', reason: 'invalid-search' }), 'ignoredSearch')
  assert.equal(problemHeading({ scope: 'providers', id: 'exa', reason: 'invalid-search' }, 'Exa', undefined), 'Exa')
  assert.equal(problemCopyKey({ scope: 'providers', id: 'exa', reason: 'invalid-state' }), 'ignoredState')
})

test('An unreadable known feature is distinct from an unknown or unsupported feature', () => {
  assert.equal(problemCopyKey({ scope: 'tools', id: 'web', reason: 'malformed' }), 'ignoredToolValue')
  assert.equal(problemHeading({ scope: 'tools', id: 'web', reason: 'malformed' }, undefined, 'Advanced web search'), 'Advanced web search')
  assert.equal(problemCopyKey({ scope: 'tools', id: 'web', reason: 'unknown-capability' }), 'ignoredTool')
  assert.equal(problemCopyKey({ scope: 'tools', id: 'web', reason: 'unsupported-capability' }), 'ignoredTool')
  assert.equal(problemHeading({ scope: 'tools', id: 'not-a-feature', reason: 'unknown-capability' }, undefined, undefined), 'not-a-feature')
  const longId = 'x'.repeat(90)
  assert.equal(problemHeading({ scope: 'tools', id: longId, reason: 'unknown-capability' }, undefined, undefined), `${'x'.repeat(79)}…`)
})

test('Unreadable-value copy differs from the unknown-entry copy in every locale', () => {
  for (const dict of [en, ja, zh]) {
    assert.notEqual(dict.ignoredProviderValue, dict.ignoredProvider)
    assert.notEqual(dict.ignoredToolValue, dict.ignoredTool)
    assert.match(dict.ignoredProviderValue, /\S/)
    assert.match(dict.ignoredToolValue, /\S/)
  }
  assert.match(en.ignoredProviderValue, /could not be read/)
  assert.match(ja.ignoredProviderValue, /読めない/)
  assert.match(zh.ignoredProviderValue, /无法读取/)
  assert.doesNotMatch(en.ignoredProviderValue, /not recognized/)
  assert.doesNotMatch(ja.ignoredProviderValue, /認識できない/)
  assert.doesNotMatch(zh.ignoredProviderValue, /无法识别/)
})
