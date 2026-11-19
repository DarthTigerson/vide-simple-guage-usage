import { build } from 'esbuild'
import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const p = (...s) => resolve(root, ...s)

rmSync(p('dist'), { recursive: true, force: true })
mkdirSync(p('dist/assets'), { recursive: true })

// Renderer: ES module, React resolved from the host at runtime.
await build({
  entryPoints: [p('src/renderer/index.tsx')],
  outfile: p('dist/renderer.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  jsx: 'automatic',
  minify: true,
  alias: {
    react: p('src/renderer/shims/react.ts'),
    'react-dom': p('src/renderer/shims/react-dom.ts'),
    'react-dom/client': p('src/renderer/shims/react-dom.ts'),
    'react/jsx-runtime': p('src/renderer/shims/jsx-runtime.ts'),
    'react/jsx-dev-runtime': p('src/renderer/shims/jsx-runtime.ts'),
  },
  define: { 'process.env.NODE_ENV': '"production"' },
})

// Scoped Tailwind (config: tailwind.config.js, important: '.vapp-simple-gauge').
execFileSync(
  process.execPath,
  [p('node_modules/tailwindcss/lib/cli.js'), '-c', p('tailwind.config.js'), '-i', p('src/renderer/style.css'), '-o', p('dist/style.css'), '--minify'],
  { stdio: 'inherit', cwd: root },
)

cpSync(p('manifest.json'), p('dist/manifest.json'))
// Everything in assets/ (icon, screenshots) ships; store/README.md is the Store's About text.
cpSync(p('assets'), p('dist/assets'), { recursive: true })
cpSync(p('store/README.md'), p('dist/README.md'))
console.log('built dist/')
