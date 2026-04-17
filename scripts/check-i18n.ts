/**
 * i18n Key Sync Checker - Run: npx tsx scripts/check-i18n.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const LOCALES_DIR = path.resolve(__dirname, '../src/locales')
const LANGUAGES = ['tr','en','es','fr','de','it','pt','ru','zh','ja','ar','ko','hi']

function getKeys(obj: Record<string, any>, prefix = ''): string[] {
  const keys: string[] = []
  for (const [key, val] of Object.entries(obj)) {
    const k = prefix ? `${prefix}.${key}` : key
    if (val && typeof val === 'object' && !Array.isArray(val)) keys.push(...getKeys(val, k))
    else keys.push(k)
  }
  return keys
}

async function main() {
  console.log('i18n Key Sync Check\n')
  let totalMissing = 0
  for (const lang of LANGUAGES) {
    const content = fs.readFileSync(path.join(LOCALES_DIR, `${lang}.ts`), 'utf-8')
    const match = content.match(/export\s+const\s+\w+\s*=\s*(\{[\s\S]*\})\s*;?\s*$/)
    if (!match) { console.log(`Could not parse ${lang}.ts`); continue }
    const obj = new Function(`return ${match[1]}`)()
    const keys = getKeys(obj)
    if (lang === 'tr') { console.log(`Base TR: ${keys.length} keys`); continue }
    const baseContent = fs.readFileSync(path.join(LOCALES_DIR, 'tr.ts'), 'utf-8')
    const baseMatch = baseContent.match(/export\s+const\s+\w+\s*=\s*(\{[\s\S]*\})\s*;?\s*$/)
    if (!baseMatch) continue
    const baseKeys = getKeys(new Function(`return ${baseMatch[1]}`)())
    const missing = baseKeys.filter(k => !keys.includes(k))
    if (missing.length === 0) console.log(`OK ${lang.toUpperCase()}: ${keys.length} keys`)
    else { console.log(`MISSING ${lang.toUpperCase()}: ${missing.length} keys`); totalMissing += missing.length }
  }
  console.log(totalMissing === 0 ? '\nAll in sync!' : `\n${totalMissing} missing keys total`)
  process.exit(totalMissing > 0 ? 1 : 0)
}
main()
