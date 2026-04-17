/**
 * AuditCodex - Full Project Audit. Run: npx tsx scripts/auditcodex.ts
 */
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

function run(name: string, cmd: string) {
  const start = Date.now()
  try {
    execSync(cmd, { cwd: ROOT, encoding: 'utf-8', timeout: 60000, stdio: 'pipe' })
    return { name, ok: true, ms: Date.now() - start }
  } catch { return { name, ok: false, ms: Date.now() - start } }
}

function main() {
  console.log('AuditCodex - Full Project Audit\n')
  console.log(`Branch: ${execSync('git branch --show-current', { cwd: ROOT, encoding: 'utf-8' }).trim()}`)
  console.log(`Commit: ${execSync('git log --oneline -1', { cwd: ROOT, encoding: 'utf-8' }).trim()}\n`)

  const checks = [
    run('TypeScript', 'npx tsc --noEmit'),
    run('Accessibility', 'npx tsx scripts/audit-a11y.ts'),
    run('Security', 'npx tsx scripts/audit-security.ts'),
    run('SEO', 'npx tsx scripts/audit-seo.ts'),
    run('Code Quality', 'npx tsx scripts/audit-code-quality.ts'),
    run('Images', 'npx tsx scripts/optimize-images.ts'),
  ]

  console.log('Results:')
  checks.forEach(c => console.log(`${c.ok ? 'PASS' : 'FAIL'} ${c.name} (${c.ms}ms)`))

  // PT-specific
  console.log('\nPT Checks:')
  console.log(`AI Council: ${fs.existsSync(path.join(ROOT, 'src/lib/ai-council.ts')) ? 'OK' : 'MISSING'}`)
  const lb = fs.existsSync(path.join(ROOT, 'src/components/Lightbox.tsx')) ? fs.readFileSync(path.join(ROOT, 'src/components/Lightbox.tsx'), 'utf-8') : ''
  console.log(`createPortal: ${lb.includes('createPortal') ? 'OK' : 'MISSING'}`)
  const locales = fs.existsSync(path.join(ROOT, 'src/locales')) ? fs.readdirSync(path.join(ROOT, 'src/locales')).filter(f => f.endsWith('.ts') && f !== 'index.ts').length : 0
  console.log(`i18n: ${locales}/13 languages`)
  console.log(`Headers: ${fs.existsSync(path.join(ROOT, 'public/_headers')) ? 'OK' : 'MISSING'}`)

  const fails = checks.filter(c => !c.ok)
  const grade = fails.length === 0 ? 'A' : fails.length <= 1 ? 'B' : fails.length <= 2 ? 'C' : 'D'
  console.log(`\nGrade: ${grade} (${checks.length - fails.length}/${checks.length} pass)`)
  console.log(fails.length === 0 ? 'SAFE TO DEPLOY' : `FIX ${fails.length} ISSUES FIRST`)
  process.exit(fails.length > 0 ? 1 : 0)
}
main()
