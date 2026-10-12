import { spawn } from 'node:child_process'
import { mkdtemp, rm, mkdir, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
const requestedSource = process.argv[2] ?? '.'
const root = requestedSource.startsWith('github:') ? requestedSource : resolve(requestedSource)
const temp = await mkdtemp(join(tmpdir(), 'dsh-search-native-')), env = { ...process.env, DSH_HOME: join(temp, 'home') }
let server, browser, output = ''
const cleaned = value => value.replace(/https?:\/\/[^\s]*[?&]token=[^\s]*/g, '[authenticated URL]')
async function command(args) {
  const child = spawn('dsh', args, { cwd: temp, env, stdio: ['ignore', 'pipe', 'pipe'] })
  let captured = ''; child.stdout.on('data', chunk => { captured += chunk }); child.stderr.on('data', chunk => { captured += chunk })
  const code = await new Promise(resolve => child.on('exit', resolve))
  if (code !== 0) throw new Error(`DSH command failed (${code}): ${cleaned(captured).slice(-3000)}`)
}
try {
  await command(['plugin', '--profile', 'web', 'add', '-w', root])
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
  await api('provider', { provider: 'exa', enabled: false, revision: snapshot.revision }); snapshot = await api('list')
  assert.equal(snapshot.entries.find(row => row.id === 'exa').configured, true)
  await api('default', { provider: 'native', revision: snapshot.revision, searchRevision: snapshot.searchRevision }); snapshot = await api('list')
  assert.equal(snapshot.searchProvider, 'deepseek-official')
  // Dismiss only the upstream onboarding dialogs in this isolated test profile.
  for (let attempt = 0; attempt < 6; attempt++) {
    for (const name of ['Continue', 'Configure later', '继续', '稍后配置']) {
      const button = page.getByRole('button', { name, exact: true })
      if (await button.isVisible().catch(() => false)) await button.click()
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  const settings = page.getByRole('button', { name: /^(Settings|设置)$/ })
  if (await settings.isVisible().catch(() => false)) {
    await settings.click()
    await page.getByRole('button', { name: 'Web search provider', exact: true }).click()
    await page.getByRole('heading', { name: 'Web search provider', exact: true }).waitFor()
    await page.locator('.dsh-search-provider').first().waitFor()
    assert.equal(await page.locator('.dsh-search-provider').count(), 9)
    await mkdir('artifacts', { recursive: true }); await page.waitForFunction(() => !document.body.innerText.includes('Unable to create default workspace'), null, { timeout: 8000 }).catch(() => {})
    await page.screenshot({ path: 'artifacts/native-settings-en.png' })
    const fx = page.locator('.dsh-search-provider').filter({ has: page.getByText('FxTwitter', { exact: true }) })
    assert.equal(await fx.getByRole('button', { name: 'Save API key', exact: true }).count(), 0)
    assert.equal(await fx.getByRole('button', { name: 'Use for web search', exact: true }).count(), 0)
    await fx.getByRole('button', { name: 'Choose features', exact: true }).click()
    await page.getByRole('switch', { name: 'Use feature: X search', exact: true }).waitFor()
    assert.equal(await page.getByRole('switch', { name: 'Use feature: X search', exact: true }).getAttribute('aria-checked'), 'true')
    await page.screenshot({ path: 'artifacts/native-x-search-en.png', animations: 'disabled' })
  } else throw new Error('The native Settings launcher was not found')
  assert.deepEqual(errors, [])
  console.log('Isolated dsh Web profile: native installation, authenticated UI/API, Loader default-provider reconciliation, feature settings, preserved credentials, and standard-provider restoration passed')
} finally {
  await browser?.close()
  if (server && server.exitCode === null) { server.kill('SIGTERM'); await new Promise(resolve => { const timer = setTimeout(() => { server.kill('SIGKILL'); resolve() }, 3000); server.once('exit', () => { clearTimeout(timer); resolve() }) }) }
  await rm(temp, { recursive: true, force: true })
}
