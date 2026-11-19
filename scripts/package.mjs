import { zipSync } from 'fflate'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'))

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const f = join(dir, n)
    return statSync(f).isDirectory() ? walk(f) : [f]
  })
}

const files = {}
for (const f of walk(dist).sort()) files[relative(dist, f).split(sep).join('/')] = new Uint8Array(readFileSync(f))
if (!files['manifest.json']) throw new Error('dist/ is empty: run npm run build first')

const zip = zipSync(files, { level: 9, mtime: new Date('2026-01-01T00:00:00Z') })
mkdirSync(join(root, 'release'), { recursive: true })
const out = join(root, 'release', `${manifest.id}-${manifest.version}.zip`)
writeFileSync(out, zip)
console.log(`wrote ${relative(root, out)}`)
console.log(`sha256: ${createHash('sha256').update(zip).digest('hex')}`)
console.log(`size: ${zip.length}`)
