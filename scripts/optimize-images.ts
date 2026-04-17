/**
 * Image Optimization Audit - Run: npx tsx scripts/optimize-images.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PUB = path.resolve(__dirname, '../public')

function fmt(b: number) { return b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(1)}KB` : `${(b/1048576).toFixed(2)}MB` }
function walk(dir: string): {name:string,size:number,ext:string}[] {
  const r: {name:string,size:number,ext:string}[] = []
  if (!fs.existsSync(dir)) return r
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) r.push(...walk(p))
    else {
      const ext = path.extname(e.name).slice(1).toLowerCase()
      if (['png','jpg','jpeg','gif','webp','avif','svg'].includes(ext))
        r.push({ name: path.relative(PUB, p), size: fs.statSync(p).size, ext })
    }
  }
  return r
}

function main() {
  console.log('Image Optimization Audit\n')
  const imgs = walk(PUB)
  const total = imgs.reduce((s,i) => s + i.size, 0)
  console.log(`Found ${imgs.length} images (${fmt(total)} total)\n`)
  const over = imgs.filter(i => i.size > 200*1024)
  if (over.length) {
    console.log(`${over.length} images over 200KB:`)
    over.forEach(i => console.log(`  ${fmt(i.size).padStart(10)} ${i.name}`))
  }
  const pngjpg = imgs.filter(i => ['png','jpg','jpeg'].includes(i.ext))
  if (pngjpg.length) {
    const savings = pngjpg.reduce((s,i) => s + Math.round(i.size * 0.65), 0)
    console.log(`\nConvert ${pngjpg.length} PNG/JPG to WebP: save ~${fmt(savings)}`)
  }
  console.log(over.length === 0 ? '\nAll optimized!' : `\nFix ${over.length} oversized images`)
}
main()
