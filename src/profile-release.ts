import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { Document, isMap, isSeq, parseDocument, type YAMLSeq } from 'yaml'

export const PACKAGE = '@aero123421/dsh-search-providers'
const ENTRY_ID = 'dsh-search-providers'
const PROVIDER_PREFIX = `${ENTRY_ID}-`
const WEB_ID = 'web'
const WEB_NAME = '@deepseek-ai/dsh-web'
const NATIVE_FALLBACK = 'deepseek-official'
const HOOK_MARK = 'dsh-search-providers-uninstall-hook'

export function replacingPath(profileDir: string): string {
  return join(profileDir, '.dsh-search-update', 'replacing')
}
export function markReplacing(profileDir: string): void {
  const filename = replacingPath(profileDir)
  mkdirSync(dirname(filename), { recursive: true })
  writeFileSync(filename, '1\n')
}
export function clearReplacing(profileDir: string): void {
  try { unlinkSync(replacingPath(profileDir)) }
  catch (error) { if (!error || typeof error !== 'object' || (error as { code?: string }).code !== 'ENOENT') throw error }
}
export function replacing(profileDir: string): boolean {
  return existsSync(replacingPath(profileDir))
}
function readJson(filename: string): Record<string, unknown> | undefined {
  try { return JSON.parse(readFileSync(filename, 'utf8')) as Record<string, unknown> }
  catch { return undefined }
}
export function stillInstalled(profileDir: string): boolean {
  const manifest = readJson(join(profileDir, 'package.json'))
  if (!manifest) return true
  const fields = ['dependencies', 'devDependencies', 'optionalDependencies']
  return fields.some(field => {
    const section = manifest[field]
    return !!section && typeof section === 'object' && !Array.isArray(section) && Object.hasOwn(section, PACKAGE)
  })
}
function bundleSelected(profileDir: string): boolean {
  const manifest = readJson(join(profileDir, 'package.json'))
  const profile = manifest?.dsh
  const bundles = profile && typeof profile === 'object' && !Array.isArray(profile) ? (profile as { profile?: { bundles?: unknown } }).profile?.bundles : undefined
  if (!Array.isArray(bundles)) return true
  return bundles.includes(PACKAGE)
}
const JS_TAG = { tag: 'tag:yaml.org,2002:js', resolve: (value: unknown) => value }
function patchDocument(profileDir: string): { filename: string; document: Document; items: YAMLSeq['items'] } | undefined {
  const filename = join(profileDir, 'cordis.patch.yml')
  if (!existsSync(filename)) return undefined
  const document = parseDocument(readFileSync(filename, 'utf8'), { customTags: [JS_TAG] })
  const contents = document.contents
  if (document.errors.length > 0 || !isSeq(contents)) return undefined
  return { filename, document, items: contents.items }
}
function entryDisabled(profileDir: string): boolean {
  const parsed = patchDocument(profileDir)
  if (!parsed) return false
  let disabled = false
  parsed.items.forEach((item, index) => {
    if (!isMap(item) || item.has('insert') || parsed.document.getIn([index, 'id']) !== ENTRY_ID) return
    disabled = parsed.document.getIn([index, 'disabled']) === true
  })
  return disabled
}
export function credentialsPath(profileDir: string): string {
  return join(profileDir, '..', '..', '.credentials.yaml')
}
/** Put the standard web search provider back when this plugin no longer supplies it. */
export function restoreSearchProvider(profileDir: string): boolean {
  const parsed = patchDocument(profileDir)
  if (!parsed) return false
  const { document, items } = parsed
  let native = NATIVE_FALLBACK
  let webIndex = -1
  items.forEach((item, index) => {
    if (!isMap(item)) return
    const id = document.getIn([index, 'id'])
    if (id === ENTRY_ID && !item.has('insert')) {
      const saved = document.getIn([index, 'config', 'nativeSearchProvider'])
      if (typeof saved === 'string' && saved && !saved.startsWith(PROVIDER_PREFIX)) native = saved
    }
    if (id === WEB_ID) {
      const name = document.getIn([index, 'name'])
      if (!name || name === WEB_NAME) webIndex = index
    }
  })
  if (webIndex < 0) return false
  const current = document.getIn([webIndex, 'config', 'searchProvider'])
  if (typeof current !== 'string' || !current.startsWith(PROVIDER_PREFIX)) return false
  document.setIn([webIndex, 'config', 'searchProvider'], native)
  writeFileSync(parsed.filename, String(document))
  return true
}
/** Host is stopping this plugin. Restore search only when it will not be registered again. Keys stay. */
export function releaseOnUnload(profileDir: string): void {
  if (replacing(profileDir)) return
  if (bundleSelected(profileDir) && !entryDisabled(profileDir)) return
  restoreSearchProvider(profileDir)
}
/** `pnpm remove` is resolving this package away, or an update finished with the package gone.
* Pass `false` from the pnpm hook: during `afterAllResolved`, package.json still lists the package
* while the resolved lockfile already omits it. The post-update call omits the argument and reads package.json.
* Saved keys stay: the credentials file is shared by every profile of the DSH_HOME and the explicit
* delete in the settings UI is the single removal path.
*/
export function releaseOnRemove(profileDir: string, installed?: boolean): void {
  if (replacing(profileDir) || (installed ?? stillInstalled(profileDir))) return
  restoreSearchProvider(profileDir)
}
const pnpmfile = `// ${HOOK_MARK}
const fs = require('fs')
const path = require('path')
const PACKAGE = ${JSON.stringify(PACKAGE)}
module.exports = {
  hooks: {
    afterAllResolved(lockfile) {
      try {
        const hook = path.join(process.cwd(), 'node_modules', PACKAGE, 'dist/uninstall-hook.cjs')
        if (!fs.existsSync(hook)) return lockfile
        const importers = lockfile && lockfile.importers || {}
        const listed = Object.values(importers).some((importer) => {
          if (!importer || typeof importer !== 'object') return false
          return ['dependencies', 'devDependencies', 'optionalDependencies'].some((field) => {
            const section = importer[field]
            return !!section && Object.prototype.hasOwnProperty.call(section, PACKAGE)
          })
        })
        if (!listed) require(hook).releaseOnRemove(process.cwd(), false)
      } catch {
        process.stderr.write('${ENTRY_ID}: uninstall cleanup failed\\n')
      }
      return lockfile
    },
  },
}
`
export function ensureUninstallHook(profileDir: string): 'installed' | 'present' | 'updated' | 'skipped' {
  const filename = join(profileDir, '.pnpmfile.cjs')
  if (!existsSync(filename)) {
    writeFileSync(filename, pnpmfile)
    return 'installed'
  }
  const current = readFileSync(filename, 'utf8')
  if (!current.includes(HOOK_MARK)) return 'skipped'
  if (current === pnpmfile) return 'present'
  writeFileSync(filename, pnpmfile)
  return 'updated'
}
