/**
 * Bundle Size Audit — gzipped-first
 *
 * Walks the build output, reports raw + gzipped JS/CSS sizes, and enforces
 * transfer-size budgets. Gzipped bytes are what Cloudflare actually serves,
 * so they are the honest first-paint metric; raw bytes stay for context.
 *
 * Budgets (gzipped):
 *   - Eager chunks: ≤ 350KB each. These ship on first paint; a miss here
 *     means real users pay the tax on every cold visit.
 *   - Lazy chunks (per LAZY_CHUNK_RE): ≤ 150KB each. These load on demand,
 *     but an oversized chunk still delays route transitions.
 *
 * Modes:
 *   BUNDLE_DIR=<path>  audit a prebuilt directory (skip build)
 *   default            audit ./dist — fail with a hint if missing
 *
 * Run:
 *   npx tsx scripts/audit-bundle.ts
 *   BUNDLE_DIR=/tmp/vite-dist npx tsx scripts/audit-bundle.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import * as zlib from 'zlib'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DIST = path.resolve(process.env.BUNDLE_DIR || path.resolve(__dirname, '../dist'))

// Transfer-size budgets (gzipped bytes).
const EAGER_GZ_BUDGET = 350 * 1024
const LAZY_GZ_BUDGET = 150 * 1024
// Raw reporting threshold — only affects visibility, not gate.
const RAW_REPORT_THRESHOLD = 250 * 1024
const TOP_N = 12

/**
 * Chunks loaded lazily — on-demand from user action — evaluated against
 * the relaxed lazy budget. Keep this list tight: adding a chunk here is
 * opting out of eager regression protection.
 */
const LAZY_CHUNK_RE =
  /^assets\/(pdf-export|image-export|charts|confetti|admin(-[a-z0-9]+)?|portal|portalv2|email|three|scroll|weighttrendchart|levelatmosphere|assessment|assessmentpage|builder|calendar|clients|dashboard|foodtracker|layout|leads|login|nutrition|onboardingform|progress|settings|studentmeasurementform|crypto|purify|index\.es|ai|constants|circle-check)-/i

function fmt(b: number) {
  return b < 1024
    ? `${b}B`
    : b < 1048576
      ? `${(b / 1024).toFixed(1)}KB`
      : `${(b / 1048576).toFixed(2)}MB`
}

function gzipSize(p: string): number {
  return zlib.gzipSync(fs.readFileSync(p), { level: 9 }).length
}

function walk(dir: string, ext?: string): { name: string; size: number; gz: number }[] {
  const r: { name: string; size: number; gz: number }[] = []
  if (!fs.existsSync(dir)) return r
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) r.push(...walk(p, ext))
    else if (!ext || e.name.endsWith(ext)) {
      const size = fs.statSync(p).size
      const gz = ext === '.js' || ext === '.css' ? gzipSize(p) : 0
      r.push({ name: path.relative(DIST, p), size, gz })
    }
  }
  return r
}

function main() {
  console.log(`Bundle Size Audit — ${DIST}\n`)
  if (!fs.existsSync(DIST)) {
    console.log(`No build output at ${DIST}. Run \`npm run build\` or set BUNDLE_DIR.`)
    process.exit(1)
  }
  const js = walk(DIST, '.js').sort((a, b) => b.gz - a.gz)
  const css = walk(DIST, '.css')
  const all = walk(DIST)
  const totalJS = js.reduce((s, f) => s + f.size, 0)
  const totalJSGz = js.reduce((s, f) => s + f.gz, 0)
  const totalCSS = css.reduce((s, f) => s + f.size, 0)
  const totalCSSGz = css.reduce((s, f) => s + f.gz, 0)
  const totalAll = all.reduce((s, f) => s + f.size, 0)

  console.log(`JS chunks by gzipped size (top ${TOP_N} of ${js.length}):`)
  console.log(`  ${'raw'.padStart(10)}  ${'gz'.padStart(10)}  name`)
  js.slice(0, TOP_N).forEach((f) =>
    console.log(`  ${fmt(f.size).padStart(10)}  ${fmt(f.gz).padStart(10)}  ${f.name}`)
  )
  console.log(`  ${'='.repeat(10)}  ${'='.repeat(10)}`)
  console.log(`  ${fmt(totalJS).padStart(10)}  ${fmt(totalJSGz).padStart(10)}  total JS`)
  console.log(`  ${fmt(totalCSS).padStart(10)}  ${fmt(totalCSSGz).padStart(10)}  total CSS`)
  console.log(`  ${fmt(totalAll).padStart(10)}  ${' '.padStart(10)}  total dist\n`)

  type Row = (typeof js)[number]
  const isLazy = (f: Row) => LAZY_CHUNK_RE.test(f.name)
  const eagerViolations = js.filter((f) => !isLazy(f) && f.gz > EAGER_GZ_BUDGET)
  const lazyViolations = js.filter((f) => isLazy(f) && f.gz > LAZY_GZ_BUDGET)

  const rawLargeLazy = js.filter((f) => isLazy(f) && f.size > RAW_REPORT_THRESHOLD && f.gz <= LAZY_GZ_BUDGET)
  if (rawLargeLazy.length) {
    console.log(`Lazy chunks over ${fmt(RAW_REPORT_THRESHOLD)} raw (within ${fmt(LAZY_GZ_BUDGET)} gz budget):`)
    rawLargeLazy.forEach((f) => console.log(`  ${fmt(f.size).padStart(10)}  ${fmt(f.gz).padStart(10)}  ${f.name}`))
    console.log('')
  }

  let failed = false
  if (eagerViolations.length) {
    console.log(`EAGER budget violation (gz > ${fmt(EAGER_GZ_BUDGET)}):`)
    eagerViolations.forEach((f) =>
      console.log(`  ${fmt(f.size).padStart(10)}  ${fmt(f.gz).padStart(10)}  ${f.name}`)
    )
    failed = true
  }
  if (lazyViolations.length) {
    console.log(`\nLAZY budget violation (gz > ${fmt(LAZY_GZ_BUDGET)}):`)
    lazyViolations.forEach((f) =>
      console.log(`  ${fmt(f.size).padStart(10)}  ${fmt(f.gz).padStart(10)}  ${f.name}`)
    )
    failed = true
  }
  if (failed) process.exit(1)

  console.log(
    `All chunks within budgets — eager ≤ ${fmt(EAGER_GZ_BUDGET)} gz, lazy ≤ ${fmt(LAZY_GZ_BUDGET)} gz.`
  )
}

main()
