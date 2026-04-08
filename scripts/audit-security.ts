/**
 * Security Audit - Run: npx tsx scripts/audit-security.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SRC = path.resolve(__dirname, '../src')
const ROOT = path.resolve(__dirname, '..')

const patterns = [
  { p: /dangerouslySetInnerHTML/, r: 'xss', m: 'XSS risk', s: 'critical' },
  { p: /eval\s*\(/, r: 'eval', m: 'eval() detected', s: 'critical' },
  { p: /console\.log\s*\(/, r: 'console', m: 'console.log in prod', s: 'low' },
  { p: /\bany\b\s*[;,)\]}]/, r: 'any', m: 'TypeScript any', s: 'low' },
]

function walk(dir: string): string[] {
  const f: string[] = []
  if (!fs.existsSync(dir)) return f
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory() && !e.name.includes('node_modules')) f.push(...walk(p))
    else if (/\.(ts|tsx)$/.test(e.name)) f.push(p)
  }
  return f
}

function main() {
  console.log('Security Audit\n')
  const files = walk(SRC)
  const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 }
  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf-8').split('\n')
    const rel = path.relative(ROOT, file)
    lines.forEach((line, i) => {
      if (line.trim().startsWith('//')) return
      for (const p of patterns) {
        if (p.p.test(line)) { console.log(`[${p.s}] ${rel}:${i+1} ${p.m}`); counts[p.s]++ }
      }
    })
  }
  // Check headers
  const hp = path.join(ROOT, 'public/_headers')
  if (fs.existsSync(hp)) {
    const h = fs.readFileSync(hp, 'utf-8')
    console.log(`\nHeaders: CSP=${h.includes('Content-Security-Policy')} XFO=${h.includes('X-Frame-Options')} PP=${h.includes('Permissions-Policy')}`)
  }
  console.log(`\nCritical: ${counts.critical}, High: ${counts.high}, Low: ${counts.low}`)
  process.exit(counts.critical > 0 ? 1 : 0)
}
main()
