import { readFile } from 'node:fs/promises'
import semver from 'semver'
import { evaluatePluginCompatibility } from '@deepseek-ai/dsh-app-boot'
import { peerRangeErrors, publishedVersionErrors } from './dsh-peer-range.mjs'

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const errors = peerRangeErrors(manifest, evaluatePluginCompatibility)
const response = await fetch('https://registry.npmjs.org/@deepseek-ai/dsh', {
  headers: { accept: 'application/json' },
  signal: AbortSignal.timeout(20_000),
})
if (!response.ok) throw new Error(`npm registry returned ${response.status}`)
const body = await response.json()
const versions = Object.keys(body.versions ?? {})
errors.push(...publishedVersionErrors(manifest, versions, body['dist-tags'], evaluatePluginCompatibility))
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
const newest = [...versions].sort(semver.rcompare)[0]
console.log(`DSH peer ranges accept published @deepseek-ai/dsh through ${body['dist-tags']?.alpha ?? newest}`)
