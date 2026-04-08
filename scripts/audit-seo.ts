/**
 * SEO Audit - Run: npx tsx scripts/audit-seo.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

function main() {
  console.log('SEO Audit\n')
  let pass = 0, fail = 0
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8')
  const checks = [
    ['Title', html.includes('<title>')],
    ['Meta desc', html.includes('meta name="description"')],
    ['OG title', html.includes('og:title')],
    ['OG desc', html.includes('og:description')],
    ['OG image', html.includes('og:image')],
    ['Twitter', html.includes('twitter:card')],
    ['Canonical', html.includes('canonical')],
    ['Lang', html.includes('lang=')],
    ['Viewport', html.includes('viewport')],
    ['robots.txt', fs.existsSync(path.join(ROOT, 'public/robots.txt'))],
    ['sitemap.xml', fs.existsSync(path.join(ROOT, 'public/sitemap.xml'))],
  ] as [string, boolean][]
  for (const [name, ok] of checks) {
    console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`)
    if (ok) pass++; else fail++
  }
  console.log(`\nScore: ${pass}/${pass + fail}`)
  process.exit(fail > 0 ? 1 : 0)
}
main()
