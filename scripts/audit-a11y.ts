/**
 * Accessibility Audit
 * Scans .tsx files for common a11y violations with precise rules.
 *
 * Rules:
 *  - img-alt: <img> tag without alt= attribute
 *  - click-div: onClick on <div>, <span>, <p>, <section>, <article> etc (non-interactive)
 *  - xss: dangerouslySetInnerHTML (warning)
 *  - modal-aria: components that render a Modal-style fullscreen overlay without role="dialog"
 *
 * Run: npx tsx scripts/audit-a11y.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SRC = path.resolve(__dirname, '../src')

// Match <img ...> / <img .../> and capture the attribute string.
const IMG_TAG = /<img\b([^>]*?)\/?>/g

// onClick directly on a non-interactive element tag.
const CLICK_DIV_TAG =
  /<(?:div|span|p|section|article|header|footer|main|aside|nav|ul|ol|li)\b[^>]*\bonClick\s*=/

function walk(dir: string): string[] {
  const files: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(full))
    else if (entry.name.endsWith('.tsx')) files.push(full)
  }
  return files
}

function stripComments(src: string): string {
  // Strip block comments and JSDoc lines to avoid false positives from examples.
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\*.*$/gm, '')
    .replace(/\/\/.*$/gm, '')
}

function lineOf(src: string, idx: number): number {
  return src.slice(0, idx).split('\n').length
}

function isModalFile(src: string, filename: string): boolean {
  // A file defines a modal if it's named *Modal.tsx AND renders fixed inset-0.
  const namedModal = /\bModal\.tsx$/i.test(filename)
  const hasFixedInset =
    /className\s*=\s*["'`][^"'`]*\bfixed\b[^"'`]*\binset-0\b/.test(src) ||
    /className\s*=\s*\{[^}]*\bfixed\b[^}]*\binset-0\b/.test(src)
  return namedModal && hasFixedInset
}

function hasDialogRole(src: string): boolean {
  return (
    /role\s*=\s*["']dialog["']/.test(src) ||
    /role\s*=\s*\{\s*["']dialog["']/.test(src)
  )
}

function main() {
  console.log('Accessibility Audit\n')
  const files = walk(SRC)
  let errors = 0
  let warnings = 0

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8')
    const src = stripComments(raw)
    const rel = path.relative(SRC, file).replace(/\\/g, '/')

    // img-alt
    IMG_TAG.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = IMG_TAG.exec(src))) {
      if (!/\balt\s*=/.test(m[1])) {
        console.log(`ERR ${rel}:${lineOf(src, m.index)} [img-alt] <img> missing alt`)
        errors++
      }
    }

    // click on non-interactive elements + XSS warn
    src.split('\n').forEach((line, i) => {
      if (CLICK_DIV_TAG.test(line)) {
        console.log(`ERR ${rel}:${i + 1} [click-div] onClick on non-interactive element`)
        errors++
      }
      if (/dangerouslySetInnerHTML/.test(line)) {
        console.log(`WARN ${rel}:${i + 1} [xss] dangerouslySetInnerHTML used`)
        warnings++
      }
    })

    // modal without role=dialog
    if (isModalFile(src, file) && !hasDialogRole(src)) {
      console.log(`ERR ${rel} [modal-aria] Modal missing role="dialog"`)
      errors++
    }
  }

  console.log(`\n${errors} errors, ${warnings} warnings`)

  // prefers-reduced-motion check across CSS
  const css: string[] = []
  function walkCSS(dir: string) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) walkCSS(p)
      else if (e.name.endsWith('.css')) css.push(p)
    }
  }
  walkCSS(SRC)
  let hasRM = false
  for (const c of css) {
    if (fs.readFileSync(c, 'utf-8').includes('prefers-reduced-motion')) {
      hasRM = true
      break
    }
  }
  console.log(`prefers-reduced-motion: ${hasRM ? 'Found' : 'MISSING'}`)

  process.exit(errors > 0 ? 1 : 0)
}

main()
