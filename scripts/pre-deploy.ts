/**
 * Pre-Deploy Checker
 * Runs all audit scripts before deployment.
 * Run: npx tsx scripts/pre-deploy.ts
 */

import { execSync } from 'child_process'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT = path.resolve(__dirname, '..')

interface CheckResult {
  name: string
  status: 'pass' | 'fail' | 'skip'
  duration: number
  output: string
}

function runCheck(name: string, command: string): CheckResult {
  const start = Date.now()
  try {
    const output = execSync(command, { cwd: ROOT, encoding: 'utf-8', timeout: 60000, stdio: 'pipe' })
    return { name, status: 'pass', duration: Date.now() - start, output }
  } catch (e: any) {
    return { name, status: 'fail', duration: Date.now() - start, output: e.stdout || e.message }
  }
}

function main() {
  console.log('Pre-Deploy Check Suite\n')
  const results: CheckResult[] = []

  console.log('[1/7] TypeScript...')
  results.push(runCheck('TypeScript', 'npx tsc --noEmit'))
  console.log('[2/7] ESLint...')
  results.push(runCheck('ESLint', 'npx eslint src --max-warnings 0 --quiet'))
  console.log('[3/7] Build...')
  results.push(runCheck('Build', 'npm run build'))
  console.log('[4/7] i18n...')
  results.push(runCheck('i18n Sync', 'npx tsx scripts/check-i18n.ts'))
  console.log('[5/7] Accessibility...')
  results.push(runCheck('Accessibility', 'npx tsx scripts/audit-a11y.ts'))
  console.log('[6/7] Security...')
  results.push(runCheck('Security', 'npx tsx scripts/audit-security.ts'))
  console.log('[7/7] Bundle...')
  results.push(runCheck('Bundle Size', 'npx tsx scripts/audit-bundle.ts'))

  console.log('\nRESULTS:')
  results.forEach(r => {
    const icon = r.status === 'pass' ? 'PASS' : 'FAIL'
    console.log(`${icon} ${r.name} (${r.duration}ms)`)
  })

  const failures = results.filter(r => r.status === 'fail')
  if (failures.length === 0) console.log('\nALL CHECKS PASSED')
  else console.log(`\n${failures.length} FAILED`)
  process.exit(failures.length > 0 ? 1 : 0)
}
main()
