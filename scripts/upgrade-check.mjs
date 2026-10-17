import { spawn } from 'node:child_process'
import { mkdtemp, realpath, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, isAbsolute, join, resolve } from 'node:path'
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { VERSION } from '../src/version.ts'

const PACKAGE = '@aero123421/dsh-search-providers', OLD_VERSION = '0.3.2'
if (!process.argv[2]) throw new Error('Usage: node scripts/upgrade-check.mjs <official-0.3.2.tgz> [new-package-spec]')
const oldSource = resolve(process.argv[2]), requested = process.argv[3] ?? resolve('.')
const newSource = isAbsolute(requested) || /^\.{1,2}(?:[\\/]|$)/.test(requested) || (requested.endsWith('.tgz') && !requested.includes('://')) ? resolve(requested) : requested
assert.equal((await stat(oldSource)).isFile(), true, 'The old release must be a local tarball')
const temp = await realpath(await mkdtemp(join(tmpdir(), 'dsh-search-upgrade-')))
const temporaryRoot = await realpath(tmpdir()), home = join(temp, 'home')
assert.equal(dirname(temp), temporaryRoot)
assert.ok(basename(temp).startsWith('dsh-search-upgrade-'))
const env = { ...process.env, DSH_HOME: home }
for (const key of ['DEEPSEEK_API_KEY', 'KEENABLE_API_KEY', 'NIMBLE_API_KEY', 'TINYFISH_API_KEY', 'PARALLEL_API_KEY', 'EXA_API_KEY', 'BRAVE_API_KEY', 'PERPLEXITY_API_KEY']) delete env[key]
const fakeKey = 'isolated-upgrade-fixture-not-a-real-exa-key', children = new Set()
let host, browser
const clean = value => String(value).replace(/https?:\/\/[^\s]*[?&]token=[^\s]*/g, '[authenticated URL]').replaceAll(fakeKey, '[fixture key]')
function launch(command, args) {
  const child = spawn(command, args, { cwd: temp, env, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] })
  children.add(child)
  child.once('close', () => children.delete(child))
  return child
}
function signal(child, name) {
  if (!child.pid || child.exitCode !== null || child.signalCode !== null) return
  try { process.platform === 'win32' ? child.kill(name) : process.kill(-child.pid, name) }
  catch (error) { if (error.code !== 'ESRCH') throw error }
}
async function stop(child) {
  if (!child || !children.has(child)) return
  await new Promise((done, reject) => {
    const timer = setTimeout(() => { try { signal(child, 'SIGKILL') } catch (error) { reject(error) } }, 5000)
    child.once('close', () => { clearTimeout(timer); done() })
    try { signal(child, 'SIGTERM') } catch (error) { clearTimeout(timer); reject(error) }
  })
}
async function command(command, args) {
  const child = launch(command, args)
  let captured = ''
  child.stdout.on('data', chunk => { captured += chunk })
  child.stderr.on('data', chunk => { captured += chunk })
  return new Promise((done, reject) => {
    const timer = setTimeout(() => { signal(child, 'SIGKILL'); reject(new Error(`${command} command timed out: ${clean(captured).slice(-3000)}`)) }, 120_000)
    child.once('error', error => { clearTimeout(timer); reject(new Error(`${command} could not start: ${clean(error.message)}`)) })
    child.once('close', code => {
      clearTimeout(timer)
      if (code === 0) done(captured)
      else reject(new Error(`${command} command failed (${code}): ${clean(captured).slice(-3000)}`))
    })
  })
}
async function startHost() {
  host = launch('dsh', ['--profile', 'web', '--no-open', '--port', '0'])
  const child = host
  let output = ''
  return new Promise((done, reject) => {
    const timer = setTimeout(() => reject(new Error(`Isolated Host startup timed out: ${clean(output).slice(-3000)}`)), 45_000)
    function inspect(chunk) {
      output = (output + chunk).slice(-24_000)
      const candidate = output.match(/https?:\/\/127\.0\.0\.1:\d+\/[^\s]*/)?.[0]
      if (candidate && new URL(candidate).searchParams.has('token')) { clearTimeout(timer); done(candidate) }
    }
    child.stdout.on('data', inspect); child.stderr.on('data', inspect)
    child.once('error', error => { clearTimeout(timer); reject(new Error(`Isolated Host could not start: ${clean(error.message)}`)) })
    child.once('close', code => { clearTimeout(timer); reject(new Error(`Isolated Host exited (${code}): ${clean(output).slice(-3000)}`)) })
  })
}
function retained(snapshot) {
  return { searchProvider: snapshot.searchProvider, nativeSearchProvider: snapshot.nativeSearchProvider, tools: snapshot.tools,
    entries: snapshot.entries.map(({ id, enabled, configured, source }) => ({ id, enabled, configured, source })) }
}
function verifyUpgrade(snapshot, previous) {
  assert.deepEqual(retained(snapshot), retained(previous), 'Upgrade must retain defaults, native selection, credentials, provider states and existing feature selections')
  assert.equal(Object.hasOwn(snapshot.tools, 'web'), false, 'Upgrade must not select the new web feature automatically')
  assert.equal(Object.hasOwn(snapshot.tools, 'batchExtract'), false, 'Upgrade must not select the new batch extraction feature automatically')
  for (const entry of snapshot.entries) assert.deepEqual(entry.search, {}, `${entry.id} must preserve legacy search defaults`)
  assert.equal(JSON.stringify(snapshot).includes(fakeKey), false, 'Snapshots must not disclose the saved key')
}
try {
  const oldManifest = JSON.parse(await command('tar', ['-xOf', oldSource, 'package/package.json']))
  assert.equal(oldManifest.name, PACKAGE); assert.equal(oldManifest.version, OLD_VERSION)
  console.log(`Installing official ${OLD_VERSION} in an isolated temporary DSH_HOME`)
  await command('dsh', ['plugin', '--profile', 'web', 'add', '-w', oldSource])
  await writeFile(join(home, 'cordis.patch.yml'), "- id: ui-settings-general\n  config:\n    welcomeNoticeVersion: '2026-09-28.1'\n- id: ui-settings-models\n  config:\n    credentialOnboarding: false\n")
  browser = await chromium.launch({ headless: true, ...process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {} })
  const page = await browser.newPage()
  const openHost = async () => { await page.goto(await startHost()).catch(() => { throw new Error('Could not open the authenticated isolated DSH page') }) }
  const api = (method, payload = {}) => page.evaluate(async ({ method, payload }) => {
    const endpoint = `dsh-search-providers/${method}`, rpcId = `upgrade-${crypto.randomUUID()}`
    const response = await fetch(`/api/${endpoint}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'client-request', rpcId, method: endpoint, payload }) })
    if (!response.ok) throw new Error(`Isolated RPC HTTP ${response.status}`)
    const envelope = await response.json()
    if (envelope.rpcId !== rpcId || envelope.type !== 'server-response') throw new Error('Invalid isolated RPC response')
    if (!envelope.result.ok) throw new Error(envelope.result.error.code)
    return envelope.result.value
  }, { method, payload })
  await openHost()
  assert.equal((await api('update-status')).running, OLD_VERSION)
  let snapshot = await api('list')
  const originalNative = snapshot.searchProvider
  assert.equal(snapshot.entries.length, 8)
  await api('save-key', { provider: 'exa', key: fakeKey }); snapshot = await api('list')
  await api('provider', { provider: 'exa', enabled: true, revision: snapshot.revision }); snapshot = await api('list')
  for (const capability of ['papers', 'extract']) {
    await api('tool', { provider: 'exa', capability, enabled: true, revision: snapshot.revision }); snapshot = await api('list')
  }
  await api('provider', { provider: 'exa', enabled: false, revision: snapshot.revision }); snapshot = await api('list')
  await api('provider', { provider: 'keenable', enabled: true, revision: snapshot.revision }); snapshot = await api('list')
  await api('default', { provider: 'keenable', revision: snapshot.revision, searchRevision: snapshot.searchRevision }); snapshot = await api('list')
  await api('provider', { provider: 'fxtwitter', enabled: true, revision: snapshot.revision }); snapshot = await api('list')
  await api('tool', { provider: 'fxtwitter', capability: 'x', enabled: true, revision: snapshot.revision })
  const previous = await api('list')
  assert.equal((await api('update-status')).running, OLD_VERSION)
  assert.equal(previous.searchProvider, 'dsh-search-providers-keenable'); assert.equal(previous.nativeSearchProvider, originalNative)
  assert.equal(previous.entries.find(entry => entry.id === 'exa').enabled, false)
  assert.equal(previous.entries.find(entry => entry.id === 'exa').source, 'saved')
  assert.equal(previous.entries.find(entry => entry.id === 'exa').configured, true)
  assert.deepEqual(previous.tools, { papers: { provider: 'exa', enabled: true }, extract: { provider: 'exa', enabled: true }, x: { provider: 'fxtwitter', enabled: true } })
  console.log(`Verified old running ${OLD_VERSION}; stopping Host before manager CLI remove/add`)
  await stop(host)
  await command('dsh', ['plugin', '--profile', 'web', 'remove', '-w', PACKAGE])
  await command('dsh', ['plugin', '--profile', 'web', 'add', '-w', newSource])
  await openHost()
  assert.equal((await api('update-status')).running, VERSION)
  snapshot = await api('list'); verifyUpgrade(snapshot, previous)
  const options = { country: 'JP', mode: 'instant', includeDomains: ['example.com'], publishedAfter: '2026-01-01' }
  await api('search-options', { provider: 'exa', options, revision: snapshot.revision })
  await stop(host); await openHost()
  assert.equal((await api('update-status')).running, VERSION)
  snapshot = await api('list')
  assert.deepEqual(retained(snapshot), retained(previous))
  assert.deepEqual(snapshot.entries.find(entry => entry.id === 'exa').search, options)
  await api('search-options', { provider: 'exa', options: {}, revision: snapshot.revision })
  await stop(host); await openHost()
  assert.equal((await api('update-status')).running, VERSION)
  snapshot = await api('list'); verifyUpgrade(snapshot, previous)
  console.log(`PASS: official ${OLD_VERSION} -> running ${VERSION}; prior/native defaults, saved masked key, provider ON/OFF, papers/extract/X selections retained; new web/batchExtract selections absent; empty defaults and search-option save/reset persisted across actual Host restarts. No provider or model calls were made.`)
} finally {
  try { await browser?.close() }
  finally {
    await Promise.all([...children].map(child => stop(child)))
    // Never remove an inferred or unchecked path, even if installation/startup failed.
    assert.equal(await realpath(temp), temp)
    assert.equal(dirname(temp), temporaryRoot)
    assert.ok(basename(temp).startsWith('dsh-search-upgrade-'))
    assert.equal(resolve(home), join(temp, 'home'))
    await rm(temp, { recursive: true, force: true })
  }
}
