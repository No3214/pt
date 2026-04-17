/**
 * Convert PNG/JPG to WebP - Run: npx tsx scripts/convert-images-webp.ts
 * Requires: npm install sharp --save-dev
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PUB = path.resolve(__dirname, '../public')

function walk(dir: string): string[] {
  const f: string[] = []
  if (!fs.existsSync(dir)) return f
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) f.push(...walk(p))
    else if (/\.(png|jpg|jpeg)$/i.test(e.name)) f.push(p)
  }
  return f
}

async function main() {
  console.log('Image to WebP Converter\n')
  let sharp: any
  try { sharp = (await import('sharp')).default }
  catch { console.log('Install sharp: npm i sharp -D'); process.exit(1) }
  const imgs = walk(PUB)
  console.log(`Found ${imgs.length} images\n`)
  let saved = 0
  for (const img of imgs) {
    const before = fs.statSync(img).size
    const out = img.replace(/\.(png|jpg|jpeg)$/i, '.webp')
    await sharp(img).webp({ quality: 82 }).toFile(out)
    const after = fs.statSync(out).size
    saved += before - after
    console.log(`${path.relative(PUB, img)}: ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB`)
  }
  console.log(`\nTotal saved: ${(saved/1024).toFixed(0)}KB`)
}
main()
