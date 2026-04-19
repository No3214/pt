/**
 * i18n Merge Tool
 * TR (base) + EN (fallback translation) -> all locales.
 * Missing keys in a locale are filled with EN value (or TR if EN missing).
 * Existing translations are preserved.
 *
 * Run: npx tsx scripts/sync-i18n.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const LOCALES_DIR = path.resolve(__dirname, '../src/locales')
const TARGET_LOCALES = ['es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ar', 'ko', 'hi']

function loadLocale(code: string): Record<string, unknown> {
  const raw = fs.readFileSync(path.join(LOCALES_DIR, `${code}.ts`), 'utf-8')
  const m = raw.match(/export\s+const\s+\w+\s*=\s*(\{[\s\S]*\})\s*;?\s*$/)
  if (!m) throw new Error(`Cannot parse ${code}.ts`)
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  return new Function(`return ${m[1]}`)() as Record<string, unknown>
}

function isPlain(o: unknown): o is Record<string, unknown> {
  return !!o && typeof o === 'object' && !Array.isArray(o)
}

/**
 * deepMerge: for every key in `base`, if target has it (non-null), keep target's value.
 * Otherwise copy from fallback (EN), else from base (TR).
 */
function deepMerge(
  base: Record<string, unknown>,
  target: Record<string, unknown>,
  fallback: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, baseVal] of Object.entries(base)) {
    const targetVal = target?.[k]
    const fallbackVal = fallback?.[k]
    if (isPlain(baseVal)) {
      out[k] = deepMerge(
        baseVal,
        isPlain(targetVal) ? targetVal : {},
        isPlain(fallbackVal) ? fallbackVal : {},
      )
    } else if (Array.isArray(baseVal)) {
      // Arrays: keep target if shape matches, else fallback, else base
      if (Array.isArray(targetVal) && targetVal.length === baseVal.length) out[k] = targetVal
      else if (Array.isArray(fallbackVal) && fallbackVal.length === baseVal.length) out[k] = fallbackVal
      else out[k] = baseVal
    } else {
      // Primitive: target > fallback > base
      if (typeof targetVal === 'string' && targetVal.length > 0) out[k] = targetVal
      else if (typeof targetVal === 'number' || typeof targetVal === 'boolean') out[k] = targetVal
      else if (typeof fallbackVal === 'string' && fallbackVal.length > 0) out[k] = fallbackVal
      else if (typeof fallbackVal === 'number' || typeof fallbackVal === 'boolean') out[k] = fallbackVal
      else out[k] = baseVal
    }
  }
  return out
}

function serialize(code: string, obj: Record<string, unknown>): string {
  // Pretty-print with 2-space indent; use JSON.stringify then post-process to quote-less keys where safe.
  const json = JSON.stringify(obj, null, 2)
  // Replace "key": with key: when key is identifier-safe
  const withUnquotedKeys = json.replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)"\s*:/g, '$1:')
  // Wrap strings with double quotes (already done by JSON.stringify)
  return `export const ${code} = ${withUnquotedKeys};\n`
}

function countKeys(o: unknown, prefix = ''): string[] {
  const keys: string[] = []
  if (isPlain(o)) {
    for (const [k, v] of Object.entries(o)) {
      const full = prefix ? `${prefix}.${k}` : k
      if (isPlain(v)) keys.push(...countKeys(v, full))
      else keys.push(full)
    }
  }
  return keys
}

function main() {
  console.log('i18n Sync\n')
  const tr = loadLocale('tr')
  const en = loadLocale('en')
  const baseKeys = countKeys(tr)
  console.log(`Base TR: ${baseKeys.length} keys`)
  console.log(`EN: ${countKeys(en).length} keys`)

  for (const code of TARGET_LOCALES) {
    const target = loadLocale(code)
    const beforeKeys = countKeys(target)
    const merged = deepMerge(tr, target, en)
    const afterKeys = countKeys(merged)
    const out = serialize(code, merged)
    fs.writeFileSync(path.join(LOCALES_DIR, `${code}.ts`), out, 'utf-8')
    const delta = afterKeys.length - beforeKeys.length
    console.log(`${code.toUpperCase()}: ${beforeKeys.length} -> ${afterKeys.length} (+${delta})`)
  }
  console.log('\nDone.')
}

main()
