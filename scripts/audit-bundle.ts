/**
 * Bundle Size Audit
 *
 * Walks the build output and reports JS/CSS sizes, flagging any file over the
 * 250KB raw budget (roughly 80KB gzipped). Prints the top-N heaviest chunks so
 * regressions are easy to spot.
 *
 * Modes:
 *   BUNDLE_DIR=<path>  audit a prebuilt directory (skip build)
 *   default            audit ./dist — fall back to `echo` message if missing
 *
 * Run:
 *   npx tsx scripts/audit-bundle.ts
 *   BUNDLE_DIR=/tmp/vite-dist npx tsx scripts/audit-bundle.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DIST = path.resolve(process.env.BUNDLE_DIR || path.resolve(__dirname, '../dist'))

const BUDGET_BYTES = 250 * 1024
const TOP_N = 10

/**
 * Chunks that are loaded lazily — on-demand from user action — and can exceed
 * the 250KB eager budget without affecting landing-page performance.
 * Keep this list tight: adding a chunk here is opting out of a regression gate.
 */
const LAZY_CHUNK_RE =
  /^assets\/(pdf-export|image-export|charts|confetti|admin(-[a-z0-9]+)?|portal|email|three|scroll)-/

function fmt(b: number) {
  return b < 1024
    ? `${b}B`
    : b < 1048576
      ? `${(b / 1024).toFixed(1)}KB`
      : `${(b / 1048576).toFixed(2)}MB`
}

function walk(dir: string, ext?: string): { name: string; size: number }[] {
  const r: { name: string; size: number }[] = []
  if (!fs.existsSync(dir)) return r
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) r.push(...walk(p, ext))
    else if (!ext || e.name.endsWith(ext))
      r.push({ name: path.relative(DIST, p), size: fs.statSync(p).size })
  }
  return r
}

function main() {
  console.log(`Bundle Size Audit — ${DIST}\n`)
  if (!fs.existsSync(DIST)) {
    console.log(`No build output at ${DIST}. Run \`npm run build\` or set BUNDLE_DIR.`)
    process.exit(1)
  }
  const js = walk(DIST, '.js').sort((a, b) => b.size - a.size)
  const css = walk(DIST, '.css')
  const all = walk(DIST)
  const totalJS = js.reduce((s, f) => s + f.size, 0)
  const totalCSS = css.reduce((s, f) => s + f.size, 0)
  const totalAll = all.reduce((s, f) => s + f.size, 0)

  console.log(`JS (top ${TOP_N} of ${js.length}):`)
  js.slice(0, TOP_N).forEach((f) => console.log(`  ${fmt(f.size).padStart(10)}  ${f.name}`))
  console.log(`  ${'='.repeat(10)}`)
  console.log(`  ${fmt(totalJS).padStart(10)}  (~${fmt(Math.round(totalJS * 0.32))} gz) total JS`)
  console.log(`  ${fmt(totalCSS).padStart(10)}  total CSS`)
  console.log(`  ${fmt(totalAll).padStart(10)}  total dist`)

  const over = js.filter((f) => f.size > BUDGET_BYTES)
  const overLazy = over.filter((f) => LAZY_CHUNK_RE.test(f.name))
  const overEager = over.filter((f) => !LAZY_CHUNK_RE.test(f.name))

  if (overLazy.length) {
    console.log(`\nLazy chunks over ${fmt(BUDGET_BYTES)} (allowed, loaded on demand):`)
    overLazy.forEach((f) => console.log(`  ${fmt(f.size).padStart(10)}  ${f.name}`))
  }
  if (overEager.length) {
    console.log(`\nEAGER chunks over ${fmt(BUDGET_BYTES)} (budget violation):`)
    overEager.forEach((f) => console.log(`  ${fmt(f.size).padStart(10)}  ${f.name}`))
    process.exit(1)
  }
  console.log(`\nAll eager chunks within ${fmt(BUDGET_BYTES)} budget.`)
}

main()
