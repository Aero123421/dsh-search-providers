import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { PACKAGE, clearReplacing, credentialsPath, ensureUninstallHook, markReplacing, releaseOnRemove, releaseOnUnload, restoreSearchProvider } from '../src/profile-release.ts'

const fakeKey = 'isolated-fixture-not-a-real-key'
async function profile() {
  const root = await mkdtemp(join(tmpdir(), 'dsh-release-'))
  const dir = join(root, 'profiles', 'web')
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'package.json'), JSON.stringify({
    dependencies: { [PACKAGE]: 'file:plugin.tgz' },
    dsh: { profile: { bundles: [PACKAGE] } },
  }))
  await writeFile(join(dir, 'cordis.patch.yml'), `# keep
- id: dsh-search-providers
  config:
    nativeSearchProvider: deepseek-official
- id: web
  name: "@deepseek-ai/dsh-web"
  config:
    searchProvider: dsh-search-providers-exa
    fetchProvider: http
`)
  await writeFile(credentialsPath(dir), `version: 1
refs:
  OTHER_ENV: keep-me
records:
  dsh-search-providers/exa:
    kind: api-key
    key: ${fakeKey}
  other-plugin/account:
    kind: api-key
    key: leave-this
`, { mode: 0o600 })
  return { root, dir, remove: () => rm(root, { recursive: true, force: true }) }
}
test('Uninstall restores the previous search provider and keeps the shared keys', async () => {
  const home = await profile()
  const manifest = JSON.parse(await readFile(join(home.dir, 'package.json'), 'utf8'))
  delete manifest.dependencies[PACKAGE]
  manifest.dsh.profile.bundles = []
  await writeFile(join(home.dir, 'package.json'), JSON.stringify(manifest))
  releaseOnRemove(home.dir)
  const patch = await readFile(join(home.dir, 'cordis.patch.yml'), 'utf8')
  const credentials = await readFile(credentialsPath(home.dir), 'utf8')
  assert.match(patch, /searchProvider: deepseek-official/)
  assert.match(patch, /fetchProvider: http/)
  assert.doesNotMatch(patch, /dsh-search-providers-exa/)
  assert.equal(credentials.includes(fakeKey), true)
  assert.match(credentials, /other-plugin\/account/)
  assert.match(credentials, /OTHER_ENV: keep-me/)
  await home.remove()
})
test('An update in progress keeps the search provider and the saved keys', async () => {
  const home = await profile()
  const manifest = JSON.parse(await readFile(join(home.dir, 'package.json'), 'utf8'))
  delete manifest.dependencies[PACKAGE]
  await writeFile(join(home.dir, 'package.json'), JSON.stringify(manifest))
  markReplacing(home.dir)
  releaseOnRemove(home.dir)
  releaseOnUnload(home.dir)
  const patch = await readFile(join(home.dir, 'cordis.patch.yml'), 'utf8')
  const credentials = await readFile(credentialsPath(home.dir), 'utf8')
  assert.match(patch, /dsh-search-providers-exa/)
  assert.equal(credentials.includes(fakeKey), true)
  clearReplacing(home.dir)
  releaseOnRemove(home.dir)
  const after = await readFile(credentialsPath(home.dir), 'utf8')
  assert.equal(after.includes(fakeKey), true)
  assert.match(await readFile(join(home.dir, 'cordis.patch.yml'), 'utf8'), /searchProvider: deepseek-official/)
  await home.remove()
})
test('Turning the plugin off restores search and keeps saved keys', async () => {
  const home = await profile()
  await writeFile(join(home.dir, 'cordis.patch.yml'), `- id: dsh-search-providers
  disabled: true
  config:
    nativeSearchProvider: deepseek
- id: web
  name: "@deepseek-ai/dsh-web"
  config:
    searchProvider: dsh-search-providers-keenable
    fetchProvider: http
`)
  releaseOnUnload(home.dir)
  const patch = await readFile(join(home.dir, 'cordis.patch.yml'), 'utf8')
  const credentials = await readFile(credentialsPath(home.dir), 'utf8')
  assert.match(patch, /searchProvider: deepseek\n/)
  assert.match(patch, /fetchProvider: http/)
  assert.equal(credentials.includes(fakeKey), true)
  releaseOnUnload(home.dir)
  assert.match(await readFile(join(home.dir, 'cordis.patch.yml'), 'utf8'), /searchProvider: deepseek\n/)
  await home.remove()
})
test('A normal shutdown leaves the selected search provider and keys in place', async () => {
  const home = await profile()
  releaseOnUnload(home.dir)
  const patch = await readFile(join(home.dir, 'cordis.patch.yml'), 'utf8')
  assert.match(patch, /searchProvider: dsh-search-providers-exa/)
  assert.equal((await readFile(credentialsPath(home.dir), 'utf8')).includes(fakeKey), true)
  assert.equal(restoreSearchProvider(home.dir), true)
  assert.match(await readFile(join(home.dir, 'cordis.patch.yml'), 'utf8'), /searchProvider: deepseek-official/)
  await home.remove()
})
test('The pnpmfile hook is added only when the profile does not already have one', async () => {
  const home = await profile()
  assert.equal(ensureUninstallHook(home.dir), 'installed')
  assert.equal(ensureUninstallHook(home.dir), 'present')
  const hook = await readFile(join(home.dir, '.pnpmfile.cjs'), 'utf8')
  assert.match(hook, /releaseOnRemove\(process\.cwd\(\), false\)/)
  await writeFile(join(home.dir, '.pnpmfile.cjs'), hook.replace('false', 'true'))
  assert.equal(ensureUninstallHook(home.dir), 'updated')
  assert.match(await readFile(join(home.dir, '.pnpmfile.cjs'), 'utf8'), /releaseOnRemove\(process\.cwd\(\), false\)/)
  await writeFile(join(home.dir, '.pnpmfile.cjs'), 'module.exports = {}\n')
  assert.equal(ensureUninstallHook(home.dir), 'skipped')
  assert.equal(await readFile(join(home.dir, '.pnpmfile.cjs'), 'utf8'), 'module.exports = {}\n')
  await home.remove()
})
test('pnpm resolution still lists the package in package.json when the lockfile has already dropped it', async () => {
  const home = await profile()
  releaseOnRemove(home.dir)
  assert.match(await readFile(join(home.dir, 'cordis.patch.yml'), 'utf8'), /dsh-search-providers-exa/)
  assert.equal((await readFile(credentialsPath(home.dir), 'utf8')).includes(fakeKey), true)
  releaseOnRemove(home.dir, false)
  const patch = await readFile(join(home.dir, 'cordis.patch.yml'), 'utf8')
  assert.match(patch, /searchProvider: deepseek-official/)
  assert.match(patch, /fetchProvider: http/)
  assert.equal((await readFile(credentialsPath(home.dir), 'utf8')).includes(fakeKey), true)
  await home.remove()
})
test('Removing the plugin from one profile keeps the shared keys of a sibling profile', async () => {
  const home = await profile()
  const other = join(home.root, 'profiles', 'other')
  await mkdir(other, { recursive: true })
  await writeFile(join(other, 'package.json'), JSON.stringify({
    dependencies: { [PACKAGE]: 'file:plugin.tgz' },
    dsh: { profile: { bundles: [PACKAGE] } },
  }))
  await writeFile(join(other, 'cordis.patch.yml'), `- id: dsh-search-providers
  config:
    nativeSearchProvider: deepseek-official
- id: web
  name: "@deepseek-ai/dsh-web"
  config:
    searchProvider: dsh-search-providers-exa
    fetchProvider: http
`)
  releaseOnRemove(home.dir, false)
  const removedPatch = await readFile(join(home.dir, 'cordis.patch.yml'), 'utf8')
  const siblingPatch = await readFile(join(other, 'cordis.patch.yml'), 'utf8')
  const credentials = await readFile(credentialsPath(other), 'utf8')
  assert.match(removedPatch, /searchProvider: deepseek-official/)
  assert.doesNotMatch(removedPatch, /dsh-search-providers-exa/)
  assert.match(siblingPatch, /dsh-search-providers-exa/)
  assert.equal(credentialsPath(other), credentialsPath(home.dir))
  assert.equal(credentials.includes(fakeKey), true)
  assert.match(credentials, /other-plugin\/account/)
  assert.match(credentials, /OTHER_ENV: keep-me/)
  await home.remove()
})
test('An update marker blocks cleanup even when the lockfile has dropped the package', async () => {
  const home = await profile()
  markReplacing(home.dir)
  releaseOnRemove(home.dir, false)
  assert.match(await readFile(join(home.dir, 'cordis.patch.yml'), 'utf8'), /dsh-search-providers-exa/)
  assert.equal((await readFile(credentialsPath(home.dir), 'utf8')).includes(fakeKey), true)
  clearReplacing(home.dir)
  await home.remove()
})
test('Restoring search keeps the rest of a profile patch', async () => {
  const home = await profile()
  await writeFile(join(home.dir, 'cordis.patch.yml'), `# Your patch layer for this dsh profile, applied after every bundle layer:
- id: dsh-search-providers
  name: "@aero123421/dsh-search-providers"
  config:
    providers:
      keenable:
        enabled: true
        search:
          includeDomains:
            - typescriptlang.org
    nativeSearchProvider: deepseek-official
- id: web
  name: "@deepseek-ai/dsh-web"
  config:
    searchProvider: dsh-search-providers-keenable
    fetchProvider: http
- id: locale
  name: "@deepseek-ai/dsh-client-locale"
  config:
    preference: zh
`)
  assert.equal(restoreSearchProvider(home.dir), true)
  const patch = await readFile(join(home.dir, 'cordis.patch.yml'), 'utf8')
  assert.match(patch, /Your patch layer/)
  assert.match(patch, /includeDomains:/)
  assert.match(patch, /typescriptlang\.org/)
  assert.match(patch, /preference: zh/)
  assert.match(patch, /fetchProvider: http/)
  assert.match(patch, /searchProvider: deepseek-official/)
  assert.doesNotMatch(patch, /dsh-search-providers-keenable/)
  await home.remove()
})
