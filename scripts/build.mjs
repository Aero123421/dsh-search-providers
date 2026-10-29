import { build } from 'esbuild'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
await mkdir('dist', { recursive: true })
const manifest = JSON.parse(await readFile('package.json', 'utf8'))
await build({ entryPoints: ['src/index.ts'], outfile: 'dist/index.js', bundle: true, platform: 'node', format: 'esm', target: 'node22', external: ['@deepseek-ai/*', 'yaml'] })
await build({ entryPoints: ['src/profile-release.ts'], outfile: 'dist/uninstall-hook.cjs', bundle: true, platform: 'node', format: 'cjs', target: 'node22' })
// Share Modal's keyboard/focus state with the host instead of bundling another copy.
const client = await build({ entryPoints: ['src/client.tsx'], bundle: true, platform: 'browser', format: 'cjs', target: 'es2022', jsx: 'automatic', external: manifest.dsh.client.external, write: false, loader: { '.css': 'text' }, minify: true })
await writeFile('dist/client.js', `window.__ModuleLoader__.load({id:${JSON.stringify(manifest.name)},factory(require){const module={exports:{}};const exports=module.exports;\n${client.outputFiles[0].text}\nreturn module.exports;}});\n`)
console.log(`${manifest.name}: built`)
