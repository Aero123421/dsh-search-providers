import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'
import { compileOfficial } from './upstream.mjs'
import { hostFixture } from './host-fixture.mjs'
await mkdir('artifacts', { recursive: true })
await compileOfficial('scripts/browser-fixture.jsx', '.cache/browser-fixture.js')
const fixture = await hostFixture({ authenticate: request => {
  const cookie = request.headers instanceof Headers ? request.headers.get('cookie') : request.headers.cookie
  return cookie?.includes('fixture-session=ready') ?? false
} })
const files = new Map([
  ['/fixture.js', resolve('.cache/browser-fixture.js')], ['/plugin.js', resolve('dist/client.js')],
  ['/base.css', resolve('.cache/upstream/packages/client/ui-theme/src/styles/base.css')],
  ['/tokens.css', resolve('.cache/upstream/packages/client/ui-theme/src/styles/design-platform.css')],
])
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    if (url.pathname.startsWith('/api/')) {
      const rejection = fixture.ctx.connection.requestRejection(req)
      if (rejection !== undefined) { res.writeHead(rejection); res.end('rejected'); return }
      const chunks = []; for await (const chunk of req) chunks.push(chunk)
      const request = new Request(url, { method: req.method, headers: req.headers, body: Buffer.concat(chunks) })
      const result = await fixture.handler.fetch(request)
      res.writeHead(result.status, Object.fromEntries(result.headers)); res.end(Buffer.from(await result.arrayBuffer())); return
    }
    if (files.has(url.pathname)) { res.setHeader('content-type', url.pathname.endsWith('.css') ? 'text/css' : 'text/javascript'); res.end(await readFile(files.get(url.pathname))); return }
    res.setHeader('content-type', 'text/html'); res.setHeader('set-cookie', 'fixture-session=ready; HttpOnly; SameSite=Strict; Path=/')
    res.end('<!doctype html><html lang="ja"><head><meta charset="utf-8"><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/base.css"><style>body{margin:0;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family)}.fixture-settings{max-width:760px;margin:24px auto;padding:24px}</style></head><body><div id="app"></div><script src="/fixture.js"></script><script src="/plugin.js"></script><script>mountPlugins()</script></body></html>')
  } catch { res.writeHead(500); res.end('Fixture failed') }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}`
let browser
try {
  assert.equal((await fetch(`${base}/api/dsh-search-providers/list`, { method: 'POST' })).status, 401)
  browser = await chromium.launch({ headless: true, ...process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {} })
  const page = await browser.newPage({ viewport: { width: 1100, height: 1000 } }), errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(base)
  await page.waitForFunction(() => !!window.testRuntime, { timeout: 5000 }).catch(() => { throw new Error(`Browser mount failed: ${errors.join('; ')}`) })
  await page.getByRole('heading', { name: '検索プロバイダー', exact: true }).waitFor()
  await page.getByText('単独の無料プランはなく', { exact: false }).waitFor()
  await page.getByRole('link', { name: 'Brave のプラン説明', exact: true }).waitFor()
  await page.getByText('HTTP 429', { exact: false }).waitFor()
  await page.screenshot({ path: 'artifacts/notes-ja-light.png', animations: 'disabled' })
  assert.equal(await page.locator('.dsh-search-provider').count(), 9)
  const updates = page.locator('.dsh-search-update'); assert.equal(await updates.count(), 1)
  await updates.getByText('この構成では自動更新できません。', { exact: false }).waitFor()
  assert.equal(await updates.getByRole('button', { name: '更新を確認', exact: true }).isDisabled(), true)
  const fx = page.locator('.dsh-search-provider').filter({ has: page.getByText('FxTwitter', { exact: true }) })
  assert.equal(await fx.getByRole('button', { name: 'APIキーを保存', exact: true }).count(), 0)
  assert.equal(await fx.getByRole('button', { name: '通常検索に使う', exact: true }).count(), 0)
  const fxSwitch = fx.getByRole('switch', { name: 'このプロバイダーを使う: FxTwitter', exact: true })
  await fxSwitch.click()
  await page.waitForFunction(() => document.querySelector('[aria-label="このプロバイダーを使う: FxTwitter"]')?.getAttribute('aria-checked') === 'true')
  await fx.getByRole('button', { name: '使う機能を選ぶ', exact: true }).click()
  await page.getByRole('switch', { name: '機能を使う: X検索', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('[aria-label="機能を使う: X検索"]')?.getAttribute('aria-checked') === 'true')
  assert.ok(fixture.ctx.tools.get('x_search'))
  await page.screenshot({ path: 'artifacts/x-search-ja.png', animations: 'disabled' })
  await page.keyboard.press('Escape'); await page.getByRole('dialog').waitFor({ state: 'hidden' })
  await fxSwitch.click()
  await page.waitForFunction(() => document.querySelector('[aria-label="このプロバイダーを使う: FxTwitter"]')?.getAttribute('aria-checked') === 'false')
  assert.equal(fixture.ctx.tools.get('x_search'), undefined); assert.equal(fixture.value.tools.x.enabled, true)
  await fxSwitch.click()
  await page.waitForFunction(() => document.querySelector('[aria-label="このプロバイダーを使う: FxTwitter"]')?.getAttribute('aria-checked') === 'true')
  assert.ok(fixture.ctx.tools.get('x_search'))
  const exa = page.locator('.dsh-search-provider').filter({ has: page.getByText('Exa', { exact: true }) })
  await exa.getByRole('button', { name: 'APIキーを保存', exact: true }).click()
  const input = page.getByLabel('APIキー', { exact: true })
  assert.equal(await input.getAttribute('type'), 'password')
  await input.fill('browser-fixture-secret-key'); await page.getByRole('button', { name: '保存', exact: true }).click()
  await exa.getByText('キー保存済み', { exact: true }).waitFor()
  assert.equal(await page.getByText('browser-fixture-secret-key', { exact: true }).count(), 0)
  const providerSwitch = exa.getByRole('switch', { name: 'このプロバイダーを使う: Exa', exact: true })
  await providerSwitch.click(); await page.waitForFunction(() => document.querySelector('[aria-label="このプロバイダーを使う: Exa"]')?.getAttribute('aria-checked') === 'true')
  await exa.getByRole('button', { name: '通常検索に使う', exact: true }).click()
  await exa.getByText('既定', { exact: true }).waitFor()
  await page.screenshot({ path: 'artifacts/settings-ja-light.png', animations: 'disabled' })
  await page.evaluate(() => document.body.setAttribute('data-ds-dark-theme', ''))
  await page.screenshot({ path: 'artifacts/settings-ja-dark.png', animations: 'disabled' })
  await exa.getByRole('button', { name: '使う機能を選ぶ', exact: true }).click()
  await page.getByRole('switch', { name: '機能を使う: 論文検索', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('[aria-label="機能を使う: 論文検索"]')?.getAttribute('aria-checked') === 'true')
  assert.ok(fixture.ctx.tools.get('search_papers')); assert.equal(fixture.ctx.tools.get('search_news'), undefined)
  await page.screenshot({ path: 'artifacts/features-ja-dark.png', animations: 'disabled' })
  await page.getByLabel('機能を検索').fill('論文'); assert.equal(await page.getByRole('switch').count(), 9)
  await page.keyboard.press('Escape'); await page.getByRole('dialog').waitFor({ state: 'hidden' })
  await providerSwitch.click(); await page.getByText('既定のプロバイダーが無効です。有効にするか、別の検索先を選んでください。', { exact: true }).waitFor()
  assert.equal(fixture.ctx.tools.get('search_papers'), undefined)
  assert.equal((await fixture.ctx.credentials.readRecord('dsh-search-providers/exa')).key, 'browser-fixture-secret-key')
  await providerSwitch.click()
  await page.waitForFunction(() => document.querySelector('[aria-label="このプロバイダーを使う: Exa"]')?.getAttribute('aria-checked') === 'true')
  assert.ok(fixture.ctx.tools.get('search_papers'))
  const native = page.locator('.dsh-search-provider').filter({ has: page.getByText('DSH標準', { exact: true }) })
  await native.getByRole('button', { name: '通常検索に使う', exact: true }).click(); await native.getByText('既定', { exact: true }).waitFor()
  await page.setViewportSize({ width: 390, height: 780 })
  assert.equal(await updates.evaluate(element => element.scrollWidth <= element.clientWidth), true)
  await page.screenshot({ path: 'artifacts/update-ja-narrow.png', animations: 'disabled' })
  await exa.getByRole('button', { name: '使う機能を選ぶ', exact: true }).click()
  await page.screenshot({ path: 'artifacts/features-ja-narrow.png', animations: 'disabled' })
  assert.ok(await page.evaluate(() => document.querySelector('[role="dialog"]').getBoundingClientRect().right <= innerWidth))
  await page.keyboard.press('Escape'); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await exa.getByRole('button', { name: 'APIキーを変更', exact: true }).click()
  await page.getByRole('button', { name: '保存したキーを削除', exact: true }).click()
  await exa.getByText('APIキー未設定', { exact: true }).waitFor()
  assert.equal(await providerSwitch.isEnabled(), true)
  await providerSwitch.click()
  await page.waitForFunction(() => document.querySelector('[aria-label="このプロバイダーを使う: Exa"]')?.getAttribute('aria-checked') === 'false')
  assert.equal(await providerSwitch.isEnabled(), false)
  assert.equal(fixture.ctx.tools.get('search_papers'), undefined)
  for (const [language, title, note] of [['en', 'Web search provider', 'no standalone free plan'], ['zh', '网页搜索提供商', '没有单独的免费计划']]) {
    await page.evaluate(language => testRuntime.locale.setLocale(language), language)
    await page.getByRole('heading', { name: title, exact: true }).waitFor()
    await page.getByText(note, { exact: false }).waitFor()
  }
  await page.evaluate(() => testRuntime.dispose()); assert.equal(await page.locator('style[data-dsh-search-providers]').count(), 0)
  assert.deepEqual(errors, [])
  console.log('Native UI primitives, authenticated RPC, key masking, default/feature/provider toggles, retained credentials, ja/en/zh, light/dark, narrow layout, Escape and unload passed')
} finally { await browser?.close(); await fixture.dispose(); await new Promise(resolve => server.close(resolve)) }
