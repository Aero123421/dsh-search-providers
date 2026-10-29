import { readFile, readdir, access, mkdir } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { build } from 'esbuild'

export const upstreamRoot = resolve('.cache/upstream')
const pinned = JSON.parse(await readFile('upstream.json', 'utf8'))
export async function ensureUpstream() {
  try {
    await access(join(upstreamRoot, 'packages/client/locale/src/client/index.ts'))
    const revision = spawnSync('git', ['-C', upstreamRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' })
    if (revision.status !== 0 || revision.stdout.trim() !== pinned.commit) throw new Error('Cached Harness source does not match upstream.json')
    return
  } catch (error) { if (error?.code !== 'ENOENT') throw error }
  await mkdir('.cache', { recursive: true })
  for (const args of [['init',upstreamRoot],['-C',upstreamRoot,'fetch','--depth=1',pinned.repository,pinned.commit],['-C',upstreamRoot,'checkout','--detach','FETCH_HEAD']]) {
    const result = spawnSync('git', args, { stdio:'inherit' })
    if (result.status !== 0) throw new Error('Could not fetch the pinned official Harness source')
  }
}

async function packageRoots(folder, result = new Map()) {
  for (const item of await readdir(folder, { withFileTypes:true })) {
    if (!item.isDirectory() || ['node_modules','lib','.git'].includes(item.name)) continue
    const path = join(folder,item.name)
    try { const manifest=JSON.parse(await readFile(join(path,'package.json'),'utf8')); result.set(manifest.name,path) } catch {}
    await packageRoots(path,result)
  }
  return result
}

export async function compileOfficial(entry, outfile) {
  await ensureUpstream()
  const roots=await packageRoots(upstreamRoot)
  const primitiveEntry=resolve('.cache/official-locale-primitives.ts')
  await (await import('node:fs/promises')).writeFile(primitiveEntry, `export * from '../scripts/native-components.jsx';\n`)
  const aliases={name:'official-source-packages',setup(builder){
    builder.onResolve({filter:/^@deepseek-ai\//},async args=>{
      if(args.path==='@deepseek-ai/dsh-client-ui-primitives')return {path:primitiveEntry}
      const [,scope,tail]=args.path.match(/^(@deepseek-ai\/[^/]+)(.*)$/)
      const root=roots.get(scope)
      if (!root) return
      const sub=tail.replace(/^\//,'')
      const candidates=sub.startsWith('src/')?[join(root,sub)]:sub?[join(root,'src',`${sub}.ts`),join(root,'src',sub,'index.ts')]:[join(root,'src/index.ts')]
      for(const path of candidates)try{await access(path);return {path}}catch{}
      throw new Error(`No official source entry for ${args.path}`)
    })
  }}
  // Resolve Harness imports from the pinned source; use node_modules for third-party dependencies.
  const nodePaths=[resolve('node_modules'),...(process.env.DSH_TEST_NODE_MODULES?[resolve(process.env.DSH_TEST_NODE_MODULES)]:[])]
  await build({entryPoints:[entry],outfile,bundle:true,platform:'browser',format:'iife',target:'es2022',jsx:'automatic',nodePaths,alias:{react:resolve('node_modules/react'),'react-dom':resolve('node_modules/react-dom')},plugins:[aliases],loader:{'.module.css':'local-css','.css':'text'},logLevel:'silent',tsconfigRaw:{compilerOptions:{experimentalDecorators:true}}})
}
