/**
 * Bundle Size Audit - Run: npx tsx scripts/audit-bundle.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DIST = path.resolve(__dirname, '../dist')

function fmt(b: number) { return b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(1)}KB` : `${(b/1048576).toFixed(2)}MB` }
function walk(dir: string, ext?: string): {name:string,size:number}[] {
  const r: {name:string,size:number}[] = []
  if (!fs.existsSync(dir)) return r
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) r.push(...walk(p, ext))
    else if (!ext || e.name.endsWith(ext)) r.push({ name: path.relative(DIST, p), size: fs.statSync(p).size })
  }
  return r
}

function main() {
  console.log('Bundle Size Audit\n')
  if (!fs.existsSync(DIST)) { console.log('No dist/ - run npm run build'); process.exit(1) }
  const js = walk(DIST, '.js').sort((a,b) => b.size - a.size)
  const css = walk(DIST, '.css')
  const all = walk(DIST)
  const totalJS = js.reduce((s,f) => s + f.size, 0)
  const totalCSS = css.reduce((s,f) => s + f.size, 0)
  const totalAll = all.reduce((s,f) => s + f.size, 0)
  console.log('JS:')
  js.slice(0,5).forEach(f => console.log(`  ${fmt(f.size).padStart(10)} ${f.name}`))
  console.log(`  Total JS: ${fmt(totalJS)} (~${fmt(Math.round(totalJS*0.35))} gz)`)
  console.log(`  Total CSS: ${fmt(totalCSS)}`)
  console.log(`  Total dist: ${fmt(totalAll)}`)
  const over = js.filter(f => f.size > 250*1024)
  if (over.length) { console.log(`\n${over.length} files over 250KB budget`); process.exit(1) }
  else console.log('\nAll within budget')
}
main()
