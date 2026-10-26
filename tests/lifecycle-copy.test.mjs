import { test } from 'node:test'
import assert from 'node:assert/strict'
import { en, ja, zh } from '../src/locales.ts'

test('Lifecycle guidance says shared API keys remain after uninstall in every locale', () => {
  assert.match(en.lifecycleNote, /Uninstalling keeps saved API keys/)
  assert.match(en.lifecycleNote, /affects all profiles/)
  assert.match(ja.lifecycleNote, /アンインストール後も残ります/)
  assert.match(ja.lifecycleNote, /全profileに影響します/)
  assert.match(zh.lifecycleNote, /卸载后仍会保留/)
  assert.match(zh.lifecycleNote, /影响所有 profile/)
})
