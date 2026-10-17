import { spawn } from 'node:child_process'
import { mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { VERSION } from '../src/version.ts'
const requestedSource = process.argv[2] ?? '.'
const root = requestedSource.startsWith('github:') ? requestedSource : resolve(requestedSource)
const temp = await mkdtemp(join(tmpdir(), 'dsh-search-native-')), env = { ...process.env, DSH_HOME: join(temp, 'home') }
let server, browser, output = ''
const cleaned = value => value.replace(/https?:\/\/[^\s]*[?&]token=[^\s]*/g, '[authenticated URL]')
// 0.2.1-alpha.2 puts Settings on the sidebar. 0.2.1-alpha.3 replaces that
// trigger with the signed-out account menu (visible label More, accessible
// name Account menu) and keeps Settings as a menu item.
async function openSettings(page) {
  const opener = page.getByRole('button', { name: /^(Settings|设置|Account menu|账号菜单)$/ })
  await opener.first().waitFor()
  const name = (await opener.first().getAttribute('aria-label')) ?? ''
  if (/^(Account menu|账号菜单)$/.test(name)) {
    await opener.first().click()
    await page.getByRole('menuitem', { name: /^(Settings|设置)$/ }).click()
    return
  }
  await opener.first().click()
}
async function command(args) {
  const child = spawn('dsh', args, { cwd: temp, env, stdio: ['ignore', 'pipe', 'pipe'] })
  let captured = ''; child.stdout.on('data', chunk => { captured += chunk }); child.stderr.on('data', chunk => { captured += chunk })
  const code = await new Promise(resolve => child.on('exit', resolve))
  if (code !== 0) throw new Error(`DSH command failed (${code}): ${cleaned(captured).slice(-3000)}`)
}
async function startServer() {
  output = ''
  server = spawn('dsh', ['--profile', 'web', '--no-open', '--port', '0'], { cwd: temp, env, stdio: ['ignore', 'pipe', 'pipe'] })
  server.stdout.on('data', chunk => { output += chunk }); server.stderr.on('data', chunk => { output += chunk })
  let launch
  const deadline = Date.now() + 45_000
  while (Date.now() < deadline) {
    const candidate = output.match(/https?:\/\/127\.0\.0\.1:\d+\/[^\s]*/)?.[0]
    if (candidate && new URL(candidate).searchParams.has('token')) { launch = candidate; break }
    if (server.exitCode !== null) throw new Error(`DSH startup failed: ${cleaned(output).slice(-3000)}`)
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  if (!launch) throw new Error(`DSH startup did not become ready: ${cleaned(output).slice(-3000)}`)
  return launch
}
async function stopServer() {
  if (server && server.exitCode === null) {
    server.kill('SIGTERM')
    await new Promise(resolve => { const timer = setTimeout(() => server.kill('SIGKILL'), 3000); server.once('exit', () => { clearTimeout(timer); resolve() }) })
  }
}
try {
  await command(['plugin', '--profile', 'web', 'add', '-w', root])
  // Use the ordinary user patch in this private DSH_HOME to mark the pinned
  // welcome copy as acknowledged and skip unrelated credential onboarding.
  // Interactive dismissal races ConfigEditor-triggered reconnects.
  await writeFile(join(temp, 'home', 'cordis.patch.yml'), "- id: ui-settings-general\n  config:\n    welcomeNoticeVersion: '2026-09-28.1'\n- id: ui-settings-models\n  config:\n    credentialOnboarding: false\n")
  const launch = await startServer()
  browser = await chromium.launch({ headless: true, ...process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {} })
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })
  const errors = []; page.on('pageerror', error => errors.push(error.message))
  await page.goto(launch).catch(() => { throw new Error('Could not open the authenticated DSH page') })
  const api = async (method, payload = {}) => page.evaluate(async ({ method, payload }) => {
    const endpoint = `dsh-search-providers/${method}`
    const response = await fetch(`/api/${endpoint}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'client-request', rpcId: 'native-check', method: endpoint, payload }) })
    const result = (await response.json()).result
    if (!result.ok) throw new Error(result.error.code)
    return result.value
  }, { method, payload })
  const updateStatus = await api('update-status'); assert.equal(updateStatus.running, VERSION)
  assert.ok(['idle', 'unavailable'].includes(updateStatus.status))
  let snapshot = await api('list'); assert.equal(snapshot.entries.length, 8); assert.equal(snapshot.searchProvider, 'deepseek-official')
  const fxEntry = snapshot.entries.find(row => row.id === 'fxtwitter'); assert.equal(fxEntry.supportsKeys, false); assert.equal(fxEntry.webSearch, false)
  await api('provider', { provider: 'fxtwitter', enabled: true, revision: snapshot.revision }); snapshot = await api('list')
  await api('tool', { provider: 'fxtwitter', capability: 'x', enabled: true, revision: snapshot.revision }); snapshot = await api('list')
  assert.deepEqual(snapshot.tools.x, { provider: 'fxtwitter', enabled: true }); assert.equal(snapshot.searchProvider, 'deepseek-official')
  await api('provider', { provider: 'keenable', enabled: true, revision: snapshot.revision }); snapshot = await api('list')
  await api('default', { provider: 'keenable', revision: snapshot.revision, searchRevision: snapshot.searchRevision })
  snapshot = await api('list'); assert.equal(snapshot.searchProvider, 'dsh-search-providers-keenable')
  await api('tool', { provider: 'keenable', capability: 'extract', enabled: true, revision: snapshot.revision })
  snapshot = await api('list'); assert.deepEqual(snapshot.tools.extract, { provider: 'keenable', enabled: true })
  await api('save-key', { provider: 'exa', key: 'native-fixture-key' }); snapshot = await api('list')
  assert.equal(snapshot.entries.find(row => row.id === 'exa').configured, true)
  assert.equal(JSON.stringify(snapshot).includes('native-fixture-key'), false)
  await api('provider', { provider: 'exa', enabled: true, revision: snapshot.revision }); snapshot = await api('list')
  const searchOptions = { country: 'JP', mode: 'instant', includeDomains: ['example.com'], publishedAfter: '2026-01-01' }
  await api('search-options', { provider: 'exa', options: searchOptions, revision: snapshot.revision }); snapshot = await api('list')
  assert.deepEqual(snapshot.entries.find(row => row.id === 'exa').search, searchOptions)
  const stale = snapshot.revision
  await api('search-options', { provider: 'exa', options: { country: 'JP', mode: 'instant' }, revision: snapshot.revision }); snapshot = await api('list')
  assert.deepEqual(snapshot.entries.find(row => row.id === 'exa').search, { country: 'JP', mode: 'instant' })
  await assert.rejects(api('search-options', { provider: 'exa', options: {}, revision: stale }))
  await api('search-options', { provider: 'exa', options: {}, revision: snapshot.revision }); snapshot = await api('list')
  assert.deepEqual(snapshot.entries.find(row => row.id === 'exa').search, {})
  await api('search-options', { provider: 'exa', options: searchOptions, revision: snapshot.revision }); snapshot = await api('list')
  await api('tool', { provider: 'exa', capability: 'batchExtract', enabled: true, revision: snapshot.revision }); snapshot = await api('list')
  await api('tool', { provider: 'exa', capability: 'web', enabled: true, revision: snapshot.revision }); snapshot = await api('list')
  await api('provider', { provider: 'exa', enabled: false, revision: snapshot.revision }); snapshot = await api('list')
  // Restart the actual isolated Host, not only the browser, to verify persisted settings/credentials.
  await stopServer(); await page.goto(await startServer()).catch(() => { throw new Error('Could not reopen the isolated DSH page') })
  snapshot = await api('list')
  assert.deepEqual(snapshot.entries.find(row => row.id === 'exa').search, searchOptions)
  assert.equal(snapshot.entries.find(row => row.id === 'exa').enabled, false)
  assert.equal(snapshot.entries.find(row => row.id === 'exa').configured, true)
  assert.equal(snapshot.tools.batchExtract.enabled, true); assert.equal(snapshot.tools.web.enabled, true)
  assert.equal(snapshot.searchProvider, 'dsh-search-providers-keenable')
  assert.equal(snapshot.entries.find(row => row.id === 'exa').configured, true)
  await api('default', { provider: 'native', revision: snapshot.revision, searchRevision: snapshot.searchRevision }); snapshot = await api('list')
  assert.equal(snapshot.searchProvider, 'deepseek-official')
  await openSettings(page)
  await page.getByRole('button', { name: 'Web search provider', exact: true }).click()
  await page.getByRole('heading', { name: 'Web search provider', exact: true }).waitFor()
  await page.locator('.dsh-search-provider').first().waitFor()
  assert.equal(await page.locator('.dsh-search-provider').count(), 9)
  await mkdir('artifacts', { recursive: true }); await page.waitForFunction(() => !document.body.innerText.includes('Unable to create default workspace'), null, { timeout: 8000 }).catch(() => {})
  await page.screenshot({ path: 'artifacts/native-settings-en.png' })
  const exa = page.locator('.dsh-search-provider').filter({ has: page.getByText('Exa', { exact: true }) })
  await exa.getByRole('button', { name: 'Search settings', exact: true }).click()
  await page.getByRole('dialog', { name: 'Exa · Search settings', exact: true }).waitFor()
  const optionsDialog = page.getByRole('dialog', { name: 'Exa · Search settings', exact: true })
  try {
    assert.equal(await optionsDialog.getByLabel('Country / region', { exact: true }).inputValue(), 'JP')
    assert.equal(await optionsDialog.getByLabel('Search mode', { exact: true }).inputValue(), 'instant')
  } catch (error) {
    await page.screenshot({ path: 'artifacts/native-search-options-failure.png', animations: 'disabled' })
    throw new Error(`Native search settings assertion failed (${errors.length} page errors): ${error.message}`)
  }
  await page.screenshot({ path: 'artifacts/native-search-options-en.png', animations: 'disabled' })
  await page.getByRole('button', { name: 'Cancel', exact: true }).click()
  const fx = page.locator('.dsh-search-provider').filter({ has: page.getByText('FxTwitter', { exact: true }) })
  assert.equal(await fx.getByRole('button', { name: 'Save API key', exact: true }).count(), 0)
  assert.equal(await fx.getByRole('button', { name: 'Use for web search', exact: true }).count(), 0)
  await fx.getByRole('button', { name: 'Choose features', exact: true }).click()
  await page.getByRole('switch', { name: 'Use feature: X search', exact: true }).waitFor()
  assert.equal(await page.getByRole('switch', { name: 'Use feature: X search', exact: true }).getAttribute('aria-checked'), 'true')
  await page.screenshot({ path: 'artifacts/native-x-search-en.png', animations: 'disabled' })
  await page.locator('.dsh-search-dialog').getByRole('button', { name: 'Close', exact: true }).click()
  const row = page.locator('.dsh-search-update'); await row.waitFor()
  assert.equal(await row.count(), 1)
  assert.match(await row.innerText(), new RegExp(VERSION.replaceAll('.', '\\.')))
  // Simulate authenticated wire results to exercise rendering and install deduplication
  // without asking the real profile manager to install a fictional release.
  let starts = 0, wireState = 'available'
  const candidate = { id: 'ui-fixture', version: '0.5.0', tag: 'v0.5.0', notes: 'Update fixture', url: 'https://github.com/Aero123421/dsh-search-providers/releases/tag/v0.5.0', runtime: '0.2.1-alpha.2' }
  await page.route('**/api/dsh-search-providers/update-*', async route => {
    const request = route.request().postDataJSON()
    if (request.method.endsWith('update-install')) { starts++; wireState = 'restart-required' }
    const value = { profileKey: updateStatus.profileKey, status: request.method.endsWith('update-check') ? 'available' : wireState, running: VERSION, installed: wireState === 'restart-required' ? '0.5.0' : VERSION, candidate }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ type: 'server-response', rpcId: request.rpcId, result: { ok: true, value } }) })
  })
  // Reload creates a new Client and must reconcile using update-status.
  await page.reload()
  await openSettings(page)
  await page.getByRole('button', { name: 'Web search provider', exact: true }).click()
  await row.getByRole('button', { name: 'Update', exact: true }).click()
  await row.getByText('Restart DSH to use the installed version.', { exact: true }).waitFor()
  assert.equal(starts, 1)
  await page.reload()
  await openSettings(page)
  await page.getByRole('button', { name: 'Web search provider', exact: true }).click()
  await row.getByText('Restart DSH to use the installed version.', { exact: true }).waitFor()
  assert.equal(starts, 1)
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(await row.evaluate(element => element.scrollWidth <= element.clientWidth), true)
  await page.screenshot({ path: 'artifacts/native-update-narrow.png', animations: 'disabled' })
  assert.deepEqual(errors, [])
  console.log('Isolated dsh Web profile: native installation, authenticated UI/API, Loader default-provider reconciliation, feature/search settings replacement and Host restart persistence, preserved credentials, and standard-provider restoration passed')
} finally {
  await browser?.close()
  await stopServer()
  await rm(temp, { recursive: true, force: true })
}
