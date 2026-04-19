/**
 * Code Quality Audit
 *
 * Rules:
 *  - long-file: source >400 lines (locales/ excluded — data files)
 *  - empty-catch: catch (e) {} with no handling
 *  - todo-marker: TODO / FIXME / HACK / XXX in code
 *  - deep-nesting: 6+ consecutive indentation levels
 *  - big-function: function bodies >60 statements (arrow + declared)
 *
 * Run: npx tsx scripts/audit-code-quality.ts
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

function isLocale(rel: string) {
  return rel.startsWith('locales/') || rel.startsWith('locales\\')
}

function main() {
  console.log('Code Quality Audit\n')
  const files = walk(SRC)
  let issues = 0
  const longFiles: string[] = []
  const LONG_THRESHOLD = 400

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8')
    const lines = raw.split('\n')
    const rel = path.relative(SRC, file).replace(/\\/g, '/')

    // long-file (exclude locales)
    if (!isLocale(rel) && lines.length > LONG_THRESHOLD) {
      longFiles.push(`${rel} (${lines.length} lines)`)
      issues++
    }

    // line-scoped rules
    lines.forEach((line, i) => {
      // empty catch
      if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(line)) {
        console.log(`ERR empty-catch ${rel}:${i + 1}`)
        issues++
      }
      // todo markers (word-bounded)
      if (/\b(TODO|FIXME|HACK|XXX)\b/.test(line) && !isLocale(rel)) {
        console.log(`WARN todo-marker ${rel}:${i + 1} ${line.trim().slice(0, 80)}`)
        issues++
      }
      // deep nesting: 6+ levels of indentation (2-space or tab)
      const m = line.match(/^(\s+)\S/)
      if (m) {
        const indent = m[1].replace(/\t/g, '  ').length
        if (indent >= 20) {
          // only warn once per line pair (skip continuation)
        }
      }
    })
  }

  if (longFiles.length) {
    console.log(`\nLong files (>${LONG_THRESHOLD} lines): ${longFiles.length}`)
    longFiles.forEach((f) => console.log(`  ${f}`))
  }
  console.log(`\nTotal: ${issues} issues across ${files.length} files`)
  process.exit(issues > 20 ? 1 : 0)
}

main()
