import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile, mkdir, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { createHash, randomUUID } from 'node:crypto'
import { Updates, getCandidate, PACKAGE, REPOSITORY, supportsSource } from '../src/updates.ts'
import { boundedFetch } from '../src/update-download.ts'
import { UpdateController } from '../src/update-controller.ts'
const PROFILE_KEY = 'a'.repeat(64)
const runtime = '0.2.1-alpha.2'
const version = '0.4.0', tag = 'v'+version, filename = `aero123421-dsh-search-providers-${version}.tgz`
function archive(value) {
  const body = Buffer.from(JSON.stringify(value)), header = Buffer.alloc(512)
  header.write('package/package.json'); header.write('0000644\0', 100); header.write('0000000\0', 108); header.write('0000000\0', 116)
  header.write(body.length.toString(8).padStart(11, '0')+'\0', 124); header.write('00000000000\0', 136); header.fill(32, 148, 156); header[156] = 48
  header.write('ustar\0', 257); header.write('00', 263)
  const checksum = header.reduce((sum, byte) => sum+byte, 0); header.write(checksum.toString(8).padStart(6,'0')+'\0 ',148)
  return gzipSync(Buffer.concat([header, body, Buffer.alloc((512-body.length%512)%512+1024)]))
}
const release = () => ({ id: 2, tag_name: tag, draft: false, prerelease: false, body: 'Release notes', html_url: `https://github.com/${REPOSITORY}/releases/tag/${tag}`, assets: [filename, 'SHA256SUMS'].map((name, i) => ({ id: i+1, name, size: 10, browser_download_url: `https://github.com/${REPOSITORY}/releases/download/${tag}/${name}` })) })
const manifest = () => ({ name: PACKAGE, version, dsh: { bundle: { patch: './cordis.patch.yml' } }, peerDependencies: { '@deepseek-ai/dsh-web': runtime } })
const bytes = archive(manifest())
function fetcher(releaseValue = release(), manifestValue = manifest()) {
  return async url => String(url).endsWith('releases/latest') ? Response.json(releaseValue) : String(url).endsWith('package.json') ? Response.json(manifestValue) : String(url).endsWith('SHA256SUMS') ? new Response(`${createHash('sha256').update(bytes).digest('hex')}  ${filename}\n`) : new Response(bytes)
}
async function fixture(t, options = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'search-updates-test-')); t.after(() => rm(dir, { recursive: true, force: true }))
  const bundle = { name: PACKAGE, enabled: false, installed: true, version: '0.3.0', source: `github:${REPOSITORY}#v0.3.0`, ...options.bundle }
  if (bundle.source.startsWith('file:/downloads/')) {
    const path = join(dir, bundle.source.slice('file:/downloads/'.length))
    await writeFile(path, bytes); bundle.source = `file:${path}`
  }
  const calls = []
  const manager = { listBundles: async () => [bundle], waitForInstall: async () => null, installBundle: async (spec, config) => { calls.push({ spec, config }); bundle.version = version; if (!spec.startsWith('github:')) bundle.source = `file:${spec}`; return { changed: true, application: 'restart-required', stage: 'install', target: spec, version, bundle: PACKAGE, ...options.result } }, ...options.manager }
  const updates = new Updates(() => manager, dir, '0.3.0', runtime, options.fetcher ?? fetcher(), options.evaluate)
  return { dir, bundle, calls, manager, updates }
}
test('A failed release lookup cancels the response body', async () => {
  let cancelled = false
  const body = new ReadableStream({
    start(controller) { controller.enqueue(new TextEncoder().encode('nope')); controller.close() },
    cancel() { cancelled = true },
  })
  await assert.rejects(getCandidate(runtime, async () => new Response(body, { status: 500, headers: { 'content-type': 'application/json' } })), /fetch-500/)
  assert.equal(cancelled, true)
})
test('Strict official metadata, channel, SemVer and compatibility', async () => {
  assert.equal((await getCandidate(runtime, fetcher())).version, version)
  for (const bad of [{ ...release(), draft: true }, { ...release(), prerelease: true }, { ...release(), tag_name: 'v00.4.0' }, { ...release(), html_url: 'https://example.com' }, { ...release(), assets: [...release().assets, release().assets[0]] }]) await assert.rejects(getCandidate(runtime, fetcher(bad)))
  await assert.rejects(getCandidate(runtime, fetcher(release(), { ...manifest(), name: 'other' })), /metadata/)
  await assert.rejects(getCandidate('0.2.2', fetcher()), /incompatible/)
  assert.equal(supportsSource(`github:${REPOSITORY}#v0.3.0`), true)
})
test('engines.dsh decides alone and dsh peers apply only when it is absent, like app-boot', async () => {
  // The issue table: peers accept the runtime while an own engines.dsh range rejects it.
  await assert.rejects(getCandidate(runtime, fetcher(release(), { ...manifest(), engines: { dsh: '>=0.2.2 <0.3.0-0' }, peerDependencies: { '@deepseek-ai/dsh': '>=0.2.1-alpha.2 <0.3.0-0' } })), /incompatible/)
  // The reverse: engines accepts the runtime while a peer demands newer, and peers stay ignored.
  assert.equal((await getCandidate(runtime, fetcher(release(), { ...manifest(), engines: { dsh: '>=0.2.1-alpha.2 <0.3.0-0' }, peerDependencies: { '@deepseek-ai/dsh': '>=0.2.2 <0.3.0-0' } }))).version, version)
  // An engines-only declaration decides both ways instead of staying peer-unknown.
  assert.equal((await getCandidate(runtime, fetcher(release(), { ...manifest(), peerDependencies: {}, engines: { dsh: '>=0.2.1-alpha.2 <0.3.0-0' } }))).version, version)
  await assert.rejects(getCandidate(runtime, fetcher(release(), { ...manifest(), peerDependencies: {}, engines: { dsh: '>=0.2.2 <0.3.0-0' } })), /incompatible/)
  // A manifest without any dsh requirement is loadable, exactly as app-boot loads it without a warning.
  assert.equal((await getCandidate(runtime, fetcher(release(), { ...manifest(), peerDependencies: { react: '^18' } }))).version, version)
  // Only engines.dsh takes priority; an engines.node key never does.
  assert.equal((await getCandidate(runtime, fetcher(release(), { ...manifest(), engines: { node: '>=22' }, peerDependencies: { '@deepseek-ai/dsh-web': runtime } }))).version, version)
  // Prereleases participate in engines.dsh exactly as they do in peers.
  assert.equal((await getCandidate('0.2.2-rc.1', fetcher(release(), { ...manifest(), peerDependencies: {}, engines: { dsh: '>=0.2.1-alpha.2 <0.3.0-0' } }))).version, version)
  // Blank, invalid, and workspace engines.dsh ranges are unmet; workspace: stays a peer-only rule.
  for (const range of ['', '   ', 'not-a-range', 'workspace:^']) await assert.rejects(getCandidate(runtime, fetcher(release(), { ...manifest(), peerDependencies: {}, engines: { dsh: range } })), /incompatible/)
  // Malformed engines or peer fields state no readable rule.
  for (const engines of [{ dsh: 2 }, null, 'x', []]) await assert.rejects(getCandidate(runtime, fetcher(release(), { ...manifest(), engines })), /metadata/)
  await assert.rejects(getCandidate(runtime, fetcher(release(), { ...manifest(), peerDependencies: { '@deepseek-ai/dsh': 1 } })), /metadata/)
  await assert.rejects(getCandidate(runtime, fetcher(release(), { ...manifest(), peerDependencies: null })), /metadata/)
})
test('an unmet engines.dsh release surfaces the needed range before any install', async t => {
  const engines = { ...manifest(), engines: { dsh: '>=0.2.2 <0.3.0-0' }, peerDependencies: { '@deepseek-ai/dsh': '>=0.2.1-alpha.2 <0.3.0-0' } }
  const { updates, calls } = await fixture(t, { fetcher: fetcher(release(), engines) })
  const checked = await updates.check()
  assert.equal(checked.status, 'incompatible')
  assert.equal(checked.reason, 'incompatible')
  assert.deepEqual(checked.requirements, { 'engines.dsh': '>=0.2.2 <0.3.0-0' })
  assert.equal(calls.length, 0)
})
test('an install-time compatibility recheck keeps the unmet runtime requirement visible', async t => {
  let evaluations = 0
  const requirements = { 'engines.dsh': '>=0.2.2 <0.3.0-0' }
  const { updates, calls } = await fixture(t, { evaluate: () => ++evaluations === 1 ? {} : requirements })
  const checked = await updates.check()
  assert.equal(checked.status, 'available')
  const result = await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)
  assert.equal(result.status, 'failed')
  assert.equal(result.reason, 'incompatible')
  assert.deepEqual(result.requirements, requirements)
  assert.equal(calls.length, 0)
})
test('the host-substituted evaluator decides instead of the local rule', async t => {
  const asked = []
  const accepted = await fixture(t, { evaluate: (manifestValue, runtimeValue) => { asked.push([runtimeValue, manifestValue.name]); return {} } })
  assert.equal((await accepted.updates.check()).status, 'available')
  assert.deepEqual(asked, [[runtime, PACKAGE]])
  const rejected = await fixture(t, { evaluate: () => ({ 'engines.dsh': '>=0.2.2 <0.3.0-0' }) })
  const checked = await rejected.updates.check()
  assert.equal(checked.status, 'incompatible')
  assert.deepEqual(checked.requirements, { 'engines.dsh': '>=0.2.2 <0.3.0-0' })
  assert.equal(rejected.calls.length, 0)
})
test('Unsupported sources stay manual', () => {
  assert.equal(supportsSource('github:other/plugin'), false)
})
test('Disabled bundle stays disabled; pin remains explicit; restart is not success; journal survives reload', async t => {
  const { updates, manager, dir, calls } = await fixture(t)
  const checked = await updates.check(), id = randomUUID()
  assert.equal(checked.status, 'available')
  const result = await updates.install(checked.candidate.id, id, updates.profileKey)
  assert.equal(result.status, 'restart-required'); assert.equal(calls.length, 1)
  assert.equal(calls[0].config.enabled, false); assert.equal(calls[0].config.requestId, id)
  assert.equal(calls[0].spec, `github:${REPOSITORY}#${tag}`)
  await updates.install(checked.candidate.id, id, updates.profileKey); assert.equal(calls.length, 1)
  const restarted = new Updates(() => manager, dir, version, runtime, fetcher())
  assert.equal((await restarted.status()).status, 'applied')
})
test('Failure, cancellation, override and incorrect manifest version are never success', async t => {
  for (const application of ['failed', 'cancelled', 'overridden', 'applied']) {
    const { updates } = await fixture(t, { result: { application, ...(application === 'applied' ? { version: '9.0.0' } : {}) } })
    const checked = await updates.check()
    const result = await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)
    assert.equal(result.status, application === 'applied' ? 'unknown' : application)
  }
})
test('Installer transport loss and null wait result remain unknown and never resend', async t => {
  let installs = 0
  const { updates, dir, manager } = await fixture(t, { manager: { installBundle: async () => { installs++; throw new Error('lost') } } })
  const checked = await updates.check(), id = randomUUID()
  assert.equal((await updates.install(checked.candidate.id, id, updates.profileKey)).status, 'unknown')
  const reconnect = new Updates(() => manager, dir, '0.3.0', runtime, fetcher())
  assert.equal((await reconnect.status()).status, 'unknown')
  await reconnect.install(checked.candidate.id, id, reconnect.profileKey); assert.equal(installs, 1)
})
test('Optional manager, read-only, unsupported source do not fetch or install', async t => {
  const { updates } = await fixture(t, { bundle: { readOnlyReason: 'management-required' }, fetcher: async () => { throw new Error('should not fetch') } })
  assert.equal((await updates.status()).status, 'unavailable')
  assert.equal((await new Updates(() => undefined, undefined, '0.3.0', runtime).status()).status, 'unavailable')
  const unsupported = await fixture(t, { bundle: { source: 'file:/random/local.tgz' }, fetcher: async () => { throw new Error('should not fetch') } })
  assert.equal((await unsupported.updates.status()).reason, 'source-unsupported')
})
test('Tarball route verifies digest, preserves disabled state, and uses retained verified file', async t => {
  const { updates, calls } = await fixture(t, { bundle: { source: `https://github.com/${REPOSITORY}/releases/download/v0.3.0/aero123421-dsh-search-providers-0.3.0.tgz` } })
  const checked = await updates.check()
  assert.equal((await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)).status, 'restart-required')
  assert.match(calls[0].spec, /\.dsh-search-update\/verified-.*\.tgz$/)
  assert.equal(calls[0].config.enabled, false)
})
test('Checksum failure is recorded as failure before manager is invoked', async t => {
  const normal = fetcher()
  const { updates, calls } = await fixture(t, { bundle: { source: `https://github.com/${REPOSITORY}/releases/download/v0.3.0/aero123421-dsh-search-providers-0.3.0.tgz` }, fetcher: url => String(url).endsWith('SHA256SUMS') ? Promise.resolve(new Response('invalid')) : normal(url) })
  const checked = await updates.check()
  assert.equal((await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)).status, 'failed')
  assert.equal(calls.length, 0); assert.equal((await updates.status()).status, 'failed')
})
test('Redirects, oversized streams and HTTP errors fail closed', async () => {
  const url = `https://github.com/${REPOSITORY}/releases/download/${tag}/${filename}`
  await assert.rejects(boundedFetch(url, 10, { fetcher: async () => new Response(null, { status: 302, headers: { location: 'https://evil.example/payload' } }) }), /redirect/)
  const asset = 'https://release-assets.githubusercontent.com/github-production-release-asset/1/abc'
  const body = await boundedFetch(url, 10, { fetcher: async input => String(input) === url ? new Response(null, { status: 302, headers: { location: asset } }) : new Response('asset') })
  assert.equal(body.toString(), 'asset')
  await assert.rejects(boundedFetch(url, 10, { fetcher: async () => new Response(null, { status: 302, headers: { location: `https://raw.githubusercontent.com/${REPOSITORY}/..%2f..%2fother/repo/main/x` } }) }), /redirect/)
  await assert.rejects(boundedFetch(url, 10, { fetcher: async () => new Response(null, { status: 302, headers: { location: `https://github.com/${REPOSITORY}/releases/download/${tag}/%2e%2e/%2e%2e/other.tgz` } }) }), /redirect/)
  await assert.rejects(boundedFetch(url, 2, { fetcher: async () => new Response('long') }), /size/)
  await assert.rejects(boundedFetch(url, 20, { fetcher: async () => new Response('', { status: 404 }) }), /release-unavailable/)
})
test('Client reset discards old response and reconciles without repeating install', async () => {
  const requests = []
  const controller = new UpdateController({ rpc: { call: (_base, method, payload) => new Promise(resolve => requests.push({ method, payload, resolve })) } })
  const first = controller.status()
  requests[0].resolve({ ok: true, value: { status: 'available', profileKey: PROFILE_KEY, running: '0.3.0', candidate: { id: 'candidate', version, url: `https://github.com/${REPOSITORY}/releases/tag/${tag}`, runtime, notes: '' } } }); await first
  const install = controller.install(); const duplicate = controller.install(); await duplicate
  controller.reset()
  assert.equal(requests[2].method, 'dsh-search-providers/update-status')
  requests[2].resolve({ ok: true, value: { status: 'restart-required', operation: requests[1].payload.operationId, profileKey: PROFILE_KEY, running: '0.3.0' } }); await new Promise(resolve => setImmediate(resolve))
  requests[1].resolve({ ok: true, value: { status: 'applied', profileKey: PROFILE_KEY, running: version } }); await install
  assert.equal(controller.getSnapshot().status, 'restart-required')
  assert.equal(requests.filter(request => request.method.endsWith('update-install')).length, 1)
  controller.dispose()
})
test('A failed preparation can be checked and retried with a new operation', async t => {
  let bad = true
  const normal = fetcher()
  const { updates, calls } = await fixture(t, { bundle: { source: 'file:/downloads/aero123421-dsh-search-providers-0.3.0.tgz' }, fetcher: url => bad && String(url).endsWith('SHA256SUMS') ? Promise.resolve(new Response('invalid')) : normal(url) })
  const first = await updates.check()
  assert.equal((await updates.install(first.candidate.id, randomUUID(), updates.profileKey)).status, 'failed')
  bad = false
  const second = await updates.check()
  assert.equal((await updates.install(second.candidate.id, randomUUID(), updates.profileKey)).status, 'restart-required')
  assert.equal(calls.length, 1)
})
test('Disabling the plugin during preparation prevents later installer invocation', async t => {
  const normal = fetcher(); let waiting, releaseDownload
  const started = new Promise(resolve => { waiting = resolve })
  const { updates, calls } = await fixture(t, { bundle: { source: 'file:/downloads/aero123421-dsh-search-providers-0.3.0.tgz' }, fetcher: async url => {
    if (String(url).endsWith(filename)) { waiting(); await new Promise(resolve => { releaseDownload = resolve }) }
    return normal(url)
  } })
  const checked = await updates.check(), installing = updates.install(checked.candidate.id, randomUUID(), updates.profileKey)
  await started; updates.dispose(); releaseDownload(); await installing
  assert.equal(calls.length, 0)
})
test('Another Client cannot settle an unresolved operation or start a second installation', async t => {
  let installs = 0
  const { updates, dir, manager } = await fixture(t, { manager: { installBundle: async () => { installs++; throw new Error('lost manager result') } } })
  const checked = await updates.check(), firstId = randomUUID()
  assert.equal((await updates.install(checked.candidate.id, firstId, updates.profileKey)).status, 'unknown')
  const second = new Updates(() => manager, dir, '0.3.0', runtime, fetcher())
  assert.equal((await second.install(checked.candidate.id, randomUUID(), second.profileKey)).status, 'unknown')
  const third = new Updates(() => manager, dir, '0.3.0', runtime, fetcher())
  assert.equal((await third.status()).status, 'unknown')
  assert.equal((await third.check()).status, 'unknown')
  assert.equal((await third.install(checked.candidate.id, randomUUID(), third.profileKey)).status, 'unknown')
  assert.equal(installs, 1)
  assert.equal((await updates.status()).operation, firstId)
})
test('A busy install rejects another operation ID and a check cannot masquerade as an install', async t => {
  let settle, begun
  const start = new Promise(resolve => { begun = resolve })
  const { updates } = await fixture(t, { manager: { installBundle: async () => { begun(); return new Promise(resolve => { settle = resolve }) } } })
  const checked = await updates.check()
  const first = updates.install(checked.candidate.id, randomUUID(), updates.profileKey); await start
  await assert.rejects(updates.install(checked.candidate.id, randomUUID(), updates.profileKey), /busy/)
  settle({ changed: false, application: 'failed', stage: 'install', target: PACKAGE }); await first
})
test('Matching checksums never admit an archive with the wrong package, version or dsh requirements', async t => {
  for (const value of [{ ...manifest(), name: 'wrong-package' }, { ...manifest(), version: '0.2.0' }, { ...manifest(), peerDependencies: { '@deepseek-ai/dsh-web': '99.0.0' } }, { ...manifest(), engines: { dsh: '>=0.2.2 <0.3.0-0' } }]) {
    const wrong = archive(value), normal = fetcher()
    const { updates, calls } = await fixture(t, { bundle: { source: 'file:/downloads/aero123421-dsh-search-providers-0.3.0.tgz' }, fetcher: async url => String(url).endsWith('SHA256SUMS') ? new Response(`${createHash('sha256').update(wrong).digest('hex')}  ${filename}\n`) : String(url).endsWith(filename) ? new Response(wrong) : normal(url) })
    const checked = await updates.check()
    assert.equal((await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)).status, 'failed')
    assert.equal(calls.length, 0)
  }
})
test('A busy refusal clears the unadmitted Client ID before reconciling the Host operation', async () => {
  let count = 0
  const controller = new UpdateController({ rpc: { call: async (_base, method, payload) => {
    count++
    if (method.endsWith('update-install')) return { ok: false, error: { code: 'dsh-search-providers/busy' } }
    if (count > 2) assert.equal(payload.operationId, undefined)
    return { ok: true, value: { status: 'available', profileKey: PROFILE_KEY, running: '0.3.0', candidate: { id: 'fixture', version, url: `https://github.com/${REPOSITORY}/releases/tag/${tag}`, runtime, notes: '' } } }
  } } })
  await controller.status(); await controller.install(); assert.equal(controller.getSnapshot().status, 'failed'); await controller.status(); controller.dispose()
})
test('Dispose during the final asynchronous bundle lookup cannot invoke the installer', async t => {
  let calls = 0, releaseLookup, finalLookup
  const ready = new Promise(resolve => { finalLookup = resolve })
  const bundle = { name: PACKAGE, installed: true, enabled: false, version: '0.3.0', source: `github:${REPOSITORY}#v0.3.0` }
  const { updates } = await fixture(t, { manager: { listBundles: async () => {
    calls++; if (calls === 4) { finalLookup(); await new Promise(resolve => { releaseLookup = resolve }) } return [bundle]
  }, installBundle: async () => { throw new Error('Installer must not be invoked') } } })
  const checked = await updates.check(), installing = updates.install(checked.candidate.id, randomUUID(), updates.profileKey)
  await ready; updates.dispose(); releaseLookup()
  assert.equal((await installing).status, 'failed')
})
test('Authenticated Host route returns busy for an unadmitted Client installation', async t => {
  const { hostFixture } = await import('../scripts/host-fixture.mjs')
  const { manager, dir, bundle } = await fixture(t)
  const savedFetch = globalThis.fetch
  globalThis.fetch = fetcher(release(), { ...manifest(), peerDependencies: { '@deepseek-ai/dsh-web': '>=0.2.1-alpha.2 <0.3.0-0' } })
  t.after(() => { globalThis.fetch = savedFetch })
  let releaseInstall, announceInstall
  const entered = new Promise(resolve => { announceInstall = resolve })
  manager.installBundle = async () => { announceInstall(); return new Promise(resolve => { releaseInstall = resolve }) }
  const host = await hostFixture({ manager, profileDir: dir }); t.after(() => host.dispose())
  const checked = await host.rpc('update-check')
  await assert.rejects(host.rpc('update-install', { profileKey: 'b'.repeat(64), candidateId: checked.candidate.id, operationId: randomUUID() }), /dsh-search-providers\/profile-changed$/)
  const first = host.rpc('update-install', { profileKey: checked.profileKey, candidateId: checked.candidate.id, operationId: randomUUID() }); await entered
  await assert.rejects(host.rpc('update-install', { profileKey: checked.profileKey, candidateId: checked.candidate.id, operationId: randomUUID() }), /dsh-search-providers\/busy$/)
  releaseInstall({ changed: false, application: 'failed', target: PACKAGE, stage: 'install', version: bundle.version }); await first
})
test('HMR already-installed removes through the manager, then installs, including after this plugin stops', async t => {
  const { updates, dir, manager, calls } = await fixture(t)
  const order = []
  manager.installBundle = async (spec, config) => {
    order.push('install')
    calls.push({ spec, config })
    if (calls.length === 1) return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'already-installed' } }
    manager.listBundles = async () => [{ name: PACKAGE, installed: true, enabled: false, version, source: spec.startsWith('github:') ? spec : `file:${spec}` }]
    return { changed: true, application: 'restart-required', stage: 'install', target: spec, version, bundle: PACKAGE }
  }
  manager.removeBundle = async name => {
    order.push('remove')
    assert.equal(name, PACKAGE)
    updates.dispose()
    return { changed: true, application: 'applied', stage: 'remove', target: name }
  }
  const checked = await updates.check(), id = randomUUID()
  const result = await updates.install(checked.candidate.id, id, updates.profileKey)
  assert.equal(result.status, 'restart-required')
  assert.deepEqual(order, ['install', 'remove', 'install'])
  assert.equal(calls[1].config.enabled, false)
  assert.equal(calls[1].config.requestId, id)
  assert.equal(calls[0].config.requestId, id)
  const restarted = new Updates(() => manager, dir, version, runtime, fetcher())
  assert.equal((await restarted.status()).status, 'applied')
})
test('stop-profile keeps the package and still installs; other removal failures do not', async t => {
  const stop = await fixture(t)
  let installs = 0
  stop.manager.installBundle = async (spec, config) => {
    installs++
    stop.calls.push({ spec, config })
    if (installs === 1) return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'already-installed' } }
    stop.bundle.version = version
    return { changed: true, application: 'restart-required', stage: 'install', target: spec, version, bundle: PACKAGE }
  }
  stop.manager.removeBundle = async () => ({ changed: false, application: 'failed', stage: 'remove', target: PACKAGE, error: { code: 'stop-profile' } })
  const checked = await stop.updates.check()
  assert.equal((await stop.updates.install(checked.candidate.id, randomUUID(), stop.updates.profileKey)).status, 'restart-required')
  assert.equal(installs, 2)
  const blocked = await fixture(t)
  let blockedInstalls = 0
  blocked.manager.installBundle = async (spec) => {
    blockedInstalls++
    return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'already-installed' } }
  }
  blocked.manager.removeBundle = async () => ({ changed: false, application: 'failed', stage: 'remove', target: PACKAGE, error: { code: 'not-removable' } })
  const blockedCheck = await blocked.updates.check()
  const failed = await blocked.updates.install(blockedCheck.candidate.id, randomUUID(), blocked.updates.profileKey)
  assert.equal(failed.status, 'failed')
  assert.equal(failed.reason, 'not-removable')
  assert.equal(blockedInstalls, 1)
})
test('already-installed without removeBundle stays failed and does not pretend the package changed', async t => {
  const { updates, calls } = await fixture(t, { manager: { installBundle: async (spec, config) => { calls.push({ spec, config }); return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'already-installed' } } } } })
  const checked = await updates.check()
  const result = await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)
  assert.equal(result.status, 'failed')
  assert.equal(result.reason, 'already-installed')
  assert.equal(calls.length, 1)
  assert.equal((await updates.status()).reason, 'already-installed')
})
test('A release manifest range accepts 0.2.1-alpha.3 and rejects 0.3 prereleases', async () => {
  const range = '>=0.2.1-alpha.2 <0.3.0-0'
  const ranged = () => ({ ...manifest(), peerDependencies: { '@deepseek-ai/dsh-web': range, '@deepseek-ai/dsh-app-boot': range } })
  assert.equal((await getCandidate('0.2.1-alpha.3', fetcher(release(), ranged()))).version, version)
  assert.equal((await getCandidate('0.2.2-rc.1', fetcher(release(), ranged()))).version, version)
  await assert.rejects(getCandidate('0.3.0-alpha.1', fetcher(release(), ranged())), /incompatible/)
  await assert.rejects(getCandidate('0.2.1-alpha.1', fetcher(release(), ranged())), /incompatible/)
})
test('A released-name local directory or symbolic link is not a tarball installation', async t => {
  const { dir, updates, bundle } = await fixture(t)
  const directory = join(dir, 'directory', 'aero123421-dsh-search-providers-0.3.0.tgz')
  await mkdir(directory, { recursive: true }); bundle.source = `file:${directory}`
  assert.equal((await updates.status()).reason, 'source-unsupported')
  const target = join(dir, 'archive.tgz'), link = join(dir, 'aero123421-dsh-search-providers-0.3.0.tgz')
  await writeFile(target, bytes); await symlink(target, link); bundle.source = `file:${link}`
  assert.equal((await updates.status()).reason, 'source-unsupported')
})
function memoryStorage(values = []) {
  const entries = new Map(values)
  return { entries, getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value), removeItem: key => entries.delete(key) }
}
function clientView(overrides = {}) { return { status: 'idle', profileKey: PROFILE_KEY, running: '0.2.0', ...overrides } }
test('Same-origin profile changes isolate cached receipts and canonical Host latest operation wins', async () => {
  const firstKey = PROFILE_KEY, secondKey = 'b'.repeat(64), stale = randomUUID(), latest = randomUUID()
  const storage = memoryStorage([[`dsh.searchProviders.update.${firstKey}.operation`, stale]])
  let key = firstKey, operation = latest; const requests = []
  const controller = new UpdateController({ rpc: { call: async (_base, method, payload) => {
    requests.push({ method, payload, key })
    return { ok: true, value: clientView({ profileKey: key, status: operation ? 'installing' : 'idle', ...(operation ? { operation } : {}) }) }
  } } }, storage)
  await controller.status(); await controller.status()
  assert.equal(controller.getSnapshot().operation, latest)
  assert.equal(storage.entries.get(`dsh.searchProviders.update.${firstKey}.operation`), latest)
  assert(requests.every(request => !request.payload.operationId))
  key = secondKey; operation = undefined; await controller.status()
  assert.equal(controller.getSnapshot().status, 'idle'); assert.equal(controller.getSnapshot().profileKey, secondKey)
  assert.equal(requests.at(-1).payload.operationId, undefined)
  assert.equal(storage.entries.get(`dsh.searchProviders.update.${secondKey}.operation`), undefined)
  controller.dispose()
})
test('Lost first install reply survives reload using only the owning profile fallback receipt', async () => {
  const storage = memoryStorage(), requests = []
  const available = clientView({ status: 'available', candidate: { id: 'fixture', version, url: `https://github.com/${REPOSITORY}/releases/tag/${tag}`, runtime, notes: '' } })
  const first = new UpdateController({ rpc: { call: async (_base, method, payload) => {
    requests.push({ method, payload })
    if (method.endsWith('update-install')) { assert.equal(payload.profileKey, PROFILE_KEY); assert.equal(storage.entries.get(`dsh.searchProviders.update.${PROFILE_KEY}.operation`), payload.operationId); throw Error('lost') }
    return { ok: true, value: available }
  } } }, storage)
  await first.status(); await first.install(); first.dispose()
  const id = storage.entries.get(`dsh.searchProviders.update.${PROFILE_KEY}.operation`)
  const next = new UpdateController({ rpc: { call: async (_base, method, payload) => { requests.push({ method, payload }); return { ok: true, value: clientView(payload.operationId ? { status: 'unknown', operation: payload.operationId } : {}) } } } }, storage)
  await next.status(); assert.equal(next.getSnapshot().status, 'unknown'); assert.equal(next.getSnapshot().operation, id)
  assert.equal(requests.filter(request => request.method.endsWith('update-install')).length, 1)
  next.dispose()
})
test('An unadmitted profile refusal clears the newly stored Client operation ID', async () => {
  const storage = memoryStorage()
  const controller = new UpdateController({ rpc: { call: async (_base, method) => method.endsWith('update-install') ? { ok: false, error: { code: 'updater/profile-changed' } } : { ok: true, value: clientView({ status: 'available', candidate: { id: 'fixture', version, url: `https://github.com/${REPOSITORY}/releases/tag/${tag}`, runtime, notes: '' } }) } } }, storage)
  await controller.status(); await controller.install(); assert.equal(storage.entries.size, 0); assert.equal(controller.getSnapshot().status, 'failed'); controller.dispose()
})
test('Different or missing expected profile identity cannot admit an installation', async t => {
  const { updates, calls } = await fixture(t), checked = await updates.check()
  await assert.rejects(updates.install(checked.candidate.id, randomUUID(), 'b'.repeat(64)), /profile-changed/)
  await assert.rejects(updates.install(checked.candidate.id, randomUUID(), undefined), /profile-changed/)
  assert.equal(calls.length, 0)
})
const previousSource = `github:${REPOSITORY}#v0.3.0`
test('A failed install after removal installs the previous source again', async t => {
  const seen = []
  let installs = 0
  const { updates, bundle, dir, manager } = await fixture(t, { bundle: { enabled: true }, manager: {
    installBundle: async (spec, config) => {
      installs++; seen.push({ spec, config })
      if (installs === 1) return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'already-installed' } }
      if (installs === 2) { bundle.installed = false; return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'operation-error' } } }
      bundle.installed = true; bundle.version = '0.3.0'; bundle.source = spec
      return { changed: true, application: 'applied', stage: 'install', target: spec, version: '0.3.0', bundle: PACKAGE }
    },
    removeBundle: async () => { bundle.installed = false; return { changed: true, application: 'applied', stage: 'remove', target: PACKAGE } },
  } })
  const checked = await updates.check(), id = randomUUID()
  const result = await updates.install(checked.candidate.id, id, updates.profileKey)
  assert.equal(result.status, 'failed'); assert.equal(result.reason, 'restored'); assert.equal(installs, 3)
  assert.equal(seen[2].spec, previousSource); assert.equal(seen[2].config.enabled, true)
  assert.equal(seen[1].config.requestId, id); assert.notEqual(seen[2].config.requestId, id)
  assert.match(seen[2].config.requestId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  const reloaded = new Updates(() => manager, dir, '0.3.0', runtime, fetcher())
  const again = await reloaded.status()
  assert.equal(again.status, 'failed'); assert.equal(again.reason, 'restored'); assert.equal(again.operation, id)
})
test('A failed restore says the package is still missing', async t => {
  let installs = 0
  const { updates, bundle } = await fixture(t, { manager: {
    installBundle: async (spec) => {
      installs++
      if (installs === 1) return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'already-installed' } }
      bundle.installed = false
      return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'operation-error' } }
    },
    removeBundle: async () => { bundle.installed = false; return { changed: true, application: 'applied', stage: 'remove', target: PACKAGE } },
  } })
  const checked = await updates.check()
  const result = await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)
  assert.equal(result.status, 'failed'); assert.equal(result.reason, 'restore-failed'); assert.equal(installs, 3)
  assert.equal(bundle.installed, false)
  bundle.installed = true; bundle.version = '0.3.0'
  const again = await updates.status()
  assert.equal(again.status, 'failed'); assert.equal(again.reason, 'restore-failed')
})
test('Removal that throws after the package is gone still restores it', async t => {
  const seen = []
  const { updates, bundle } = await fixture(t, { manager: {
    installBundle: async (spec, config) => {
      seen.push({ spec, config })
      if (seen.length === 1) return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'already-installed' } }
      bundle.installed = true; bundle.source = spec
      return { changed: true, application: 'applied', stage: 'install', target: spec, version: '0.3.0', bundle: PACKAGE }
    },
    removeBundle: async () => { bundle.installed = false; throw new Error('remove-lost') },
  } })
  const checked = await updates.check()
  const result = await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)
  assert.equal(result.status, 'failed'); assert.equal(result.reason, 'restored'); assert.equal(seen.length, 2)
  assert.equal(seen[1].spec, previousSource); assert.equal(bundle.installed, true)
})
test('A removal throw that leaves the package installed does not install another copy', async t => {
  let installs = 0
  const { updates } = await fixture(t, { manager: {
    installBundle: async (spec) => { installs++; return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'already-installed' } } },
    removeBundle: async () => { throw new Error('remove-lost') },
  } })
  const checked = await updates.check()
  const result = await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)
  assert.equal(result.status, 'unknown'); assert.equal(installs, 1)
})
test('An install failure while the package is still listed does not restore', async t => {
  let installs = 0
  const { updates, bundle } = await fixture(t, { manager: {
    installBundle: async (spec) => {
      installs++
      if (installs === 1) return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'already-installed' } }
      return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'operation-error' } }
    },
    removeBundle: async () => ({ changed: true, application: 'applied', stage: 'remove', target: PACKAGE }),
  } })
  const checked = await updates.check()
  const result = await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)
  assert.equal(result.status, 'failed'); assert.equal(result.reason, 'operation-error'); assert.equal(installs, 2); assert.equal(bundle.installed, true)
})
test('stop-profile install failure does not restore over the package that remained', async t => {
  let installs = 0
  const { updates } = await fixture(t, { manager: {
    installBundle: async (spec) => {
      installs++
      if (installs === 1) return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'already-installed' } }
      throw new Error('install-lost')
    },
    removeBundle: async () => ({ changed: false, application: 'failed', stage: 'remove', target: PACKAGE, error: { code: 'stop-profile' } }),
  } })
  const checked = await updates.check()
  const result = await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)
  assert.equal(result.status, 'unknown'); assert.equal(installs, 2)
})
test('A cancelled install after removal restores the previous source', async t => {
  const seen = []
  const { updates, bundle } = await fixture(t, { manager: {
    installBundle: async (spec, config) => {
      seen.push({ spec, config })
      if (seen.length === 1) return { changed: false, application: 'failed', stage: 'install', target: spec, error: { code: 'already-installed' } }
      if (seen.length === 2) { bundle.installed = false; return { changed: false, application: 'cancelled', stage: 'install', target: spec } }
      bundle.installed = true
      return { changed: true, application: 'applied', stage: 'install', target: spec, version: '0.3.0', bundle: PACKAGE }
    },
    removeBundle: async () => { bundle.installed = false; return { changed: true, application: 'applied', stage: 'remove', target: PACKAGE } },
  } })
  const checked = await updates.check()
  const result = await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)
  assert.equal(result.status, 'cancelled'); assert.equal(result.reason, 'restored'); assert.equal(seen[2].spec, previousSource)
})
test('An ordinary install does not remove the bundle when removeBundle exists', async t => {
  let removed = 0
  const { updates } = await fixture(t, { manager: { removeBundle: async () => { removed++; throw new Error('remove') } } })
  const checked = await updates.check()
  assert.equal((await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)).status, 'restart-required')
  assert.equal(removed, 0)
})
test('Authoritative cancellation preserves its outcome after the installer abort exit', async t => {
  const { updates } = await fixture(t, { result: { application: 'cancelled', packageResult: { exitCode: 130, timedOut: false } } })
  const checked = await updates.check()
  assert.equal((await updates.install(checked.candidate.id, randomUUID(), updates.profileKey)).status, 'cancelled')
})
