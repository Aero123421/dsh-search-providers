import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { evaluatePluginCompatibility } from '@deepseek-ai/dsh-app-boot'
import { DSH_PEER_RANGE, peerRangeErrors, publishedVersionErrors } from '../scripts/dsh-peer-range.mjs'

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))

test('Installed app-boot accepts this package on 0.2.1-alpha.2 through later 0.2.x prereleases', () => {
  assert.deepEqual(peerRangeErrors(manifest, evaluatePluginCompatibility), [])
  assert.equal(evaluatePluginCompatibility(manifest, {}, '0.2.1-alpha.3'), undefined)
  const pinned = { ...manifest, peerDependencies: { ...manifest.peerDependencies, '@deepseek-ai/dsh-web': '0.2.1-alpha.2' } }
  assert.ok(peerRangeErrors(pinned, evaluatePluginCompatibility).some(error => error.includes('@deepseek-ai/dsh-web')))
  const issue = evaluatePluginCompatibility(pinned, {}, '0.2.1-alpha.3')
  assert.ok((issue?.requirements ?? issue?.peers)?.['@deepseek-ai/dsh-web'])
})

test('A future DSH release outside the peer range fails the published-version check', () => {
  const versions = ['0.2.0-rc.2', '0.2.1-alpha.2', '0.2.1-alpha.3']
  assert.deepEqual(publishedVersionErrors(manifest, versions, { alpha: '0.2.1-alpha.3', latest: '0.2.0-rc.2' }, evaluatePluginCompatibility), [])
  const broken = publishedVersionErrors(manifest, [...versions, '0.3.0-alpha.1'], { alpha: '0.3.0-alpha.1' }, evaluatePluginCompatibility)
  assert.ok(broken.some(error => error.includes('0.3.0-alpha.1')))
  assert.equal(DSH_PEER_RANGE, '>=0.2.1-alpha.2 <0.3.0-0')
})
