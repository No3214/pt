/**
 * Security Audit
 * Strips string literals, template literals, and comments before matching patterns
 * to avoid false positives from user-facing copy.
 *
 * Run: npx tsx scripts/audit-security.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SRC = path.resolve(__dirname, '../src')
const ROOT = path.resolve(__dirname, '..')

type Pattern = { p: RegExp; r: string; m: string; s: 'critical' | 'high' | 'medium' | 'low' }

const patterns: Pattern[] = [
  { p: /dangerouslySetInnerHTML/, r: 'xss', m: 'XSS risk', s: 'critical' },
  { p: /\beval\s*\(/, r: 'eval', m: 'eval() detected', s: 'critical' },
  { p: /console\.log\s*\(/, r: 'console', m: 'console.log in prod', s: 'low' },
  // TypeScript any: match real type positions — " as any", ": any,", ": any)", etc.
  { p: /\bas\s+any\b/, r: 'any', m: 'TypeScript any cast', s: 'low' },
  { p: /:\s*any\s*[,)\]=>}]/, r: 'any', m: 'TypeScript any annotation', s: 'low' },
  { p: /<any\s*[,>]/, r: 'any', m: 'TypeScript any generic', s: 'low' },
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

/**
 * Replace all string contents, template-literal contents, and comments with
 * whitespace of the same length. This preserves line numbers while removing
 * any pattern-triggering content inside user-facing strings.
 */
function sanitize(src: string): string {
  const out = src.split('')
  const len = src.length
  let i = 0
  while (i < len) {
    const ch = src[i]
    const next = src[i + 1]
    // line comment
    if (ch === '/' && next === '/') {
      while (i < len && src[i] !== '\n') {
        out[i] = ' '
        i++
      }
      continue
    }
    // block comment
    if (ch === '/' && next === '*') {
      out[i] = ' '
      out[i + 1] = ' '
      i += 2
      while (i < len && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] !== '\n') out[i] = ' '
        i++
      }
      if (i < len) {
        out[i] = ' '
        out[i + 1] = ' '
        i += 2
      }
      continue
    }
    // strings " ' `
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      i++
      while (i < len && src[i] !== quote) {
        if (src[i] === '\\' && i + 1 < len) {
          if (src[i] !== '\n') out[i] = ' '
          if (src[i + 1] !== '\n') out[i + 1] = ' '
          i += 2
          continue
        }
        // template ${...} — keep code, null out the rest
        if (quote === '`' && src[i] === '$' && src[i + 1] === '{') {
          i += 2
          let depth = 1
          while (i < len && depth > 0) {
            if (src[i] === '{') depth++
            else if (src[i] === '}') depth--
            if (depth > 0) i++
          }
          if (i < len) i++ // skip closing }
          continue
        }
        if (src[i] !== '\n') out[i] = ' '
        i++
      }
      if (i < len) i++
      continue
    }
    i++
  }
  return out.join('')
}

function main() {
  console.log('Security Audit\n')
  const files = walk(SRC)
  const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 }
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8')
    const clean = sanitize(raw)
    const lines = clean.split('\n')
    const rel = path.relative(ROOT, file).replace(/\\/g, '/')
    lines.forEach((line, i) => {
      for (const p of patterns) {
        if (p.p.test(line)) {
          console.log(`[${p.s}] ${rel}:${i + 1} ${p.m}`)
          counts[p.s]++
        }
      }
    })
  }
  // Headers
  const hp = path.join(ROOT, 'public/_headers')
  if (fs.existsSync(hp)) {
    const h = fs.readFileSync(hp, 'utf-8')
    console.log(
      `\nHeaders: CSP=${h.includes('Content-Security-Policy')} XFO=${h.includes('X-Frame-Options')} PP=${h.includes('Permissions-Policy')}`,
    )
  }
  console.log(
    `\nCritical: ${counts.critical}, High: ${counts.high}, Medium: ${counts.medium}, Low: ${counts.low}`,
  )
  process.exit(counts.critical > 0 ? 1 : 0)
}

main()
