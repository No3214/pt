/**
 * Pre-Deploy Check Suite
 *
 * Runs all pre-deploy gates sequentially and exits non-zero if any fail.
 * Build and bundle audit run against a unique tmp directory so repeated runs
 * don't race on stale artifacts or hit filesystem EPERM on mounted workspaces.
 *
 * Run: npx tsx scripts/pre-deploy.ts
 */

import { execSync } from 'child_process'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

interface CheckResult {
  name: string
  status: 'pass' | 'fail'
  duration: number
  output: string
}

function runCheck(name: string, command: string, env: NodeJS.ProcessEnv = {}): CheckResult {
  const start = Date.now()
  try {
    const output = execSync(command, {
      cwd: ROOT,
      encoding: 'utf-8',
      timeout: 180_000,
      stdio: 'pipe',
      env: { ...process.env, ...env },
    })
    return { name, status: 'pass', duration: Date.now() - start, output }
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string; message?: string }
    const output = [err.stdout, err.stderr, err.message].filter(Boolean).join('\n')
    return { name, status: 'fail', duration: Date.now() - start, output }
  }
}

function main() {
  console.log('Pre-Deploy Check Suite\n')

  // Unique tmp dir so concurrent or restarted runs don't collide.
  const bundleDir = path.join(os.tmpdir(), `arena-bundle-${process.pid}-${Date.now()}`)
  fs.mkdirSync(bundleDir, { recursive: true })
  const cleanup = () => {
    try {
      fs.rmSync(bundleDir, { recursive: true, force: true })
    } catch {
      /* mounted filesystems may deny unlink; tmp cleaner handles leftovers */
    }
  }

  const steps: { name: string; cmd: string; env?: NodeJS.ProcessEnv }[] = [
    { name: 'TypeScript', cmd: 'npx tsc --noEmit' },
    { name: 'ESLint', cmd: 'npx eslint src --max-warnings 0 --quiet' },
    { name: 'i18n Sync', cmd: 'npx tsx scripts/check-i18n.ts' },
    { name: 'Accessibility', cmd: 'npx tsx scripts/audit-a11y.ts' },
    { name: 'Security', cmd: 'npx tsx scripts/audit-security.ts' },
    { name: 'Code Quality', cmd: 'npx tsx scripts/audit-code-quality.ts' },
    {
      name: 'Build',
      cmd: `npx vite build --outDir ${JSON.stringify(bundleDir)} --emptyOutDir`,
    },
    {
      name: 'Bundle Size',
      cmd: 'npx tsx scripts/audit-bundle.ts',
      env: { BUNDLE_DIR: bundleDir },
    },
  ]

  const results: CheckResult[] = []
  steps.forEach((s, i) => {
    console.log(`[${i + 1}/${steps.length}] ${s.name}...`)
    results.push(runCheck(s.name, s.cmd, s.env))
  })

  console.log('\nRESULTS:')
  results.forEach((r) => {
    const icon = r.status === 'pass' ? 'PASS' : 'FAIL'
    console.log(`  ${icon}  ${r.name.padEnd(14)} (${r.duration}ms)`)
  })

  const failures = results.filter((r) => r.status === 'fail')
  if (failures.length === 0) {
    console.log('\nALL CHECKS PASSED')
  } else {
    console.log(`\n${failures.length} FAILED:`)
    failures.forEach((f) => {
      console.log(`\n--- ${f.name} ---`)
      console.log(f.output.slice(0, 2000))
    })
  }

  cleanup()
  process.exit(failures.length > 0 ? 1 : 0)
}

main()
