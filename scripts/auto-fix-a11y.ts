/**
 * Auto-Fix A11y Issues - Run: npx tsx scripts/auto-fix-a11y.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SRC = path.resolve(__dirname, '../src')
let fixes = 0

function walk(dir: string): string[] {
  const f: string[] = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) f.push(...walk(p))
    else if (e.name.endsWith('.tsx')) f.push(p)
  }
  return f
}

function fix(file: string) {
  let c = fs.readFileSync(file, 'utf-8')
  const orig = c
  if ((c.includes('modal') || c.includes('Modal')) && !c.includes('role="dialog"')) {
    c = c.replace(/(className=["'][^"']*fixed[^"']*inset-0[^"']*z-[^"']*["'])/g, (m) =>
      m.includes('role=') ? m : `role="dialog" aria-modal="true" ${m}`)
  }
  if (c !== orig) { fs.writeFileSync(file, c); console.log(`Fixed: ${path.relative(SRC, file)}`); fixes++ }
}

function main() {
  console.log('Auto-Fix A11y\n')
  walk(SRC).forEach(fix)
  console.log(fixes ? `\nFixed ${fixes} files` : 'No fixable issues')
}
main()
