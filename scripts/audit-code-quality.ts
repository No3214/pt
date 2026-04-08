/**
 * Code Quality Audit - Run: npx tsx scripts/audit-code-quality.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SRC = path.resolve(__dirname, '../src')

function walk(dir: string): string[] {
  const f: string[] = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory() && !e.name.includes('node_modules')) f.push(...walk(p))
    else if (/\.(ts|tsx)$/.test(e.name)) f.push(p)
  }
  return f
}

function main() {
  console.log('Code Quality Audit\n')
  const files = walk(SRC)
  let issues = 0
  const longFiles: string[] = []
  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf-8').split('\n')
    const rel = path.relative(SRC, file)
    if (lines.length > 300) { longFiles.push(`${rel} (${lines.length} lines)`); issues++ }
    lines.forEach((line, i) => {
      if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(line)) { console.log(`empty-catch ${rel}:${i+1}`); issues++ }
    })
  }
  if (longFiles.length) { console.log(`Long files (>300 lines): ${longFiles.length}`); longFiles.forEach(f => console.log(`  ${f}`)) }
  console.log(`\nTotal: ${issues} issues across ${files.length} files`)
}
main()
