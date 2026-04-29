import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { createClient } from '@sanity/client'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const GALLERY_SLUG = process.argv[2]
const PHOTOS_FOLDER = process.argv[3]

if (!GALLERY_SLUG || !PHOTOS_FOLDER) {
  console.error('\nUsage: node scripts/upload-client-gallery.mjs <gallery-slug> <photos-folder>')
  console.error('Example: node scripts/upload-client-gallery.mjs sarah-wedding-2024 ~/Desktop/Sarah\n')
  process.exit(1)
}

// ─── R2 CLIENT ────────────────────────────────────────────────────────────────
const r2 = new S3Client({
  region: 'auto',
  endpoint: 'https://319a615abb303499484a163dccbe5519.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '569b53344dee6b2305b75d72114fc33e',
    secretAccessKey: 'b54ff9af86e1b0a24a8743a461269409178bfb41dce5b27e78e3d3f1c391933c',
  },
})
const BUCKET = 'sina-sharifi-clients'
const PUBLIC_URL = 'https://pub-d16033d48d5d41f4aac820c8b8d8c961.r2.dev'

// ─── SANITY CLIENT ────────────────────────────────────────────────────────────
const sanity = createClient({
  projectId: 'x99xbcur',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skEmBdfmKQE5CQRyjizw2NxxizwY4AhJAa8oUKmDtatetQmT9HaHxxBkJaausnebaqNxw8PYuKBquJ59fnBBuyECo178pB7DiB5uDjBoevk7lztslqfb5koZ1QgnFdB3xHGnrtaFUwXLkmVIsObhEshe1YQyQazueDO7zkxQ59qsUihKqn5S',
  useCdn: false,
})

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif']

function getFiles(folder) {
  const expanded = folder.replace(/^~/, process.env.HOME)
  return fs.readdirSync(expanded)
    .filter(f => SUPPORTED.includes(path.extname(f).toLowerCase()))
    .map(f => path.join(expanded, f))
    .sort()
}

async function uploadToR2(key, buffer, contentType) {
  await r2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }))
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Find gallery in Sanity
  const gallery = await sanity.fetch(
    `*[_type == "clientGallery" && slug.current == $slug][0]{ _id, shootName, clientName }`,
    { slug: GALLERY_SLUG }
  )

  if (!gallery) {
    console.error(`\n❌ No gallery found with slug "${GALLERY_SLUG}"`)
    console.error('Create it first in the Sanity studio at sharifisina.com/studio\n')
    process.exit(1)
  }

  console.log(`\n✅ Found gallery: "${gallery.shootName}" — ${gallery.clientName}`)

  // 2. Get photo files
  const files = getFiles(PHOTOS_FOLDER)
  console.log(`📸 Found ${files.length} photos\n`)

  if (files.length === 0) {
    console.error('❌ No supported photos found in folder')
    process.exit(1)
  }

  const photos = []

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i]
    const filename = path.basename(filePath)
    const ext = path.extname(filename).toLowerCase()
    const base = path.basename(filename, ext)

    console.log(`[${i + 1}/${files.length}] ${filename}`)

    const buffer = fs.readFileSync(filePath)
    const meta = await sharp(buffer).metadata()

    const fullKey = `${GALLERY_SLUG}/full/${base}.jpg`
    const previewKey = `${GALLERY_SLUG}/preview/${base}.jpg`

    const fullBuffer = await sharp(buffer).jpeg({ quality: 95 }).toBuffer()
    const previewBuffer = await sharp(buffer).resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 80 }).toBuffer()

    process.stdout.write(`  ↑ full-res...`)
    await uploadToR2(fullKey, fullBuffer, 'image/jpeg')
    process.stdout.write(` ✓  preview...`)
    await uploadToR2(previewKey, previewBuffer, 'image/jpeg')
    console.log(` ✓`)

    photos.push({
      _key: `photo-${i}-${Date.now()}`,
      key: fullKey,
      filename: filename,
      previewUrl: `${PUBLIC_URL}/${previewKey}`,
      width: meta.width || 0,
      height: meta.height || 0,
      size: buffer.length,
    })
  }

  // 3. Save to Sanity
  console.log(`\n📝 Saving to Sanity...`)
  await sanity.patch(gallery._id).set({ photos }).commit()

  console.log(`\n✅ Done! ${photos.length} photos uploaded.`)
  console.log(`🔗 https://sharifisina.com/clients/${GALLERY_SLUG}\n`)
}

main().catch(err => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
