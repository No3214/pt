/**
 * Accessibility Audit - Run: npx tsx scripts/audit-a11y.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SRC = path.resolve(__dirname, '../src')

const rules = [
  { p: /<img[^>]*(?!alt=)[^>]*\/?\s*>/, r: 'img-alt', m: 'Image missing alt', s: 'error' },
  { p: /onClick=[^>]*(?:div|span|p)\b/, r: 'click-div', m: 'onClick on non-interactive element', s: 'error' },
  { p: /dangerouslySetInnerHTML/, r: 'xss', m: 'XSS risk', s: 'error' },
]

function walk(dir: string): string[] {
  const f: string[] = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) f.push(...walk(p))
    else if (e.name.endsWith('.tsx')) f.push(p)
  }
  return f
}

function main() {
  console.log('Accessibility Audit\n')
  const files = walk(SRC)
  let errors = 0, warnings = 0
  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf-8').split('\n')
    const rel = path.relative(SRC, file)
    const content = lines.join('\n')
    lines.forEach((line, i) => {
      for (const rule of rules) {
        if (rule.p.test(line)) {
          console.log(`${rule.s === 'error' ? 'ERR' : 'WARN'} ${rel}:${i+1} [${rule.r}] ${rule.m}`)
          if (rule.s === 'error') errors++; else warnings++
        }
      }
    })
    if ((content.includes('modal') || content.includes('Modal')) && !content.includes('role="dialog"')) {
      console.log(`ERR ${rel} [modal-aria] Missing role=dialog`)
      errors++
    }
  }
  console.log(`\n${errors} errors, ${warnings} warnings`)
  const css = fs.readdirSync(SRC, { recursive: true }).filter(f => String(f).endsWith('.css'))
  let hasRM = false
  for (const c of css) { if (fs.readFileSync(path.join(SRC, String(c)), 'utf-8').includes('prefers-reduced-motion')) hasRM = true }
  console.log(`prefers-reduced-motion: ${hasRM ? 'Found' : 'MISSING'}`)
  process.exit(errors > 0 ? 1 : 0)
}
main()
