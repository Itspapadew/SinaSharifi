import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { createClient } from '@sanity/client'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const GALLERY_SLUG = process.argv[2]
const PHOTOS_FOLDER = process.argv[3]

if (!GALLERY_SLUG || !PHOTOS_FOLDER) {
  console.error('\nUsage: node scripts/upload-client-gallery.mjs <gallery-slug> <photos-folder>')
  console.error('Example: node scripts/upload-client-gallery.mjs sarah-s-photoshoot ~/Desktop/Sarah\n')
  process.exit(1)
}

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

const sanity = createClient({
  projectId: 'x99xbcur',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skEmBdfmKQE5CQRyjizw2NxxizwY4AhJAa8oUKmDtatetQmT9HaHxxBkJaausnebaqNxw8PYuKBquJ59fnBBuyECo178pB7DiB5uDjBoevk7lztslqfb5koZ1QgnFdB3xHGnrtaFUwXLkmVIsObhEshe1YQyQazueDO7zkxQ59qsUihKqn5S',
  useCdn: false,
})

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif']

function getFiles(folder) {
  const expanded = folder.replace(/^~/, process.env.HOME)
  return fs.readdirSync(expanded)
    .filter(f => SUPPORTED.includes(path.extname(f).toLowerCase()))
    .map(f => path.join(expanded, f))
    .sort()
}

async function existsInR2(key) {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }))
    return true
  } catch {
    return false
  }
}

async function uploadToR2(key, buffer, contentType, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await r2.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }))
      return
    } catch (err) {
      if (attempt === retries) throw err
      console.log(`  ⚠ Retry ${attempt}/${retries}...`)
      await new Promise(r => setTimeout(r, 2000 * attempt))
    }
  }
}

async function main() {
  const gallery = await sanity.fetch(
    `*[_type == "clientGallery" && slug.current == $slug][0]{ _id, shootName, clientName, photos }`,
    { slug: GALLERY_SLUG }
  )

  if (!gallery) {
    console.error(`\n❌ No gallery found with slug "${GALLERY_SLUG}"`)
    process.exit(1)
  }

  console.log(`\n✅ Found gallery: "${gallery.shootName}" — ${gallery.clientName}`)

  const files = getFiles(PHOTOS_FOLDER)
  console.log(`📸 Found ${files.length} photos\n`)

  // Load existing photos from Sanity to resume
  const existing = new Map()
  if (gallery.photos?.length) {
    for (const p of gallery.photos) {
      existing.set(p.filename, p)
    }
    console.log(`⏩ ${existing.size} already uploaded — skipping those\n`)
  }

  const photos = [...existing.values()]
  let uploaded = 0
  let skipped = 0

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i]
    const filename = path.basename(filePath)
    const ext = path.extname(filename).toLowerCase()
    const base = path.basename(filename, ext)

    // Skip if already uploaded
    if (existing.has(filename)) {
      skipped++
      continue
    }

    console.log(`[${i + 1}/${files.length}] ${filename}`)

    try {
      const buffer = fs.readFileSync(filePath)
      const meta = await sharp(buffer).metadata()

      const fullKey = `${GALLERY_SLUG}/full/${filename}`
      const previewKey = `${GALLERY_SLUG}/preview/${base}.jpg`

      const previewBuffer = await sharp(buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer()

      // Check if already in R2 (partial resume)
      const fullExists = await existsInR2(fullKey)
      const previewExists = await existsInR2(previewKey)

      if (!fullExists) {
        process.stdout.write(`  ↑ full-res...`)
        await uploadToR2(fullKey, buffer, 'image/jpeg')
        process.stdout.write(` ✓`)
      } else {
        process.stdout.write(`  ✓ full-res (cached)`)
      }

      if (!previewExists) {
        process.stdout.write(`  preview...`)
        await uploadToR2(previewKey, previewBuffer, 'image/jpeg')
        console.log(` ✓`)
      } else {
        console.log(`  ✓ preview (cached)`)
      }

      photos.push({
        _key: `photo-${i}-${Date.now()}`,
        key: fullKey,
        filename,
        previewUrl: `${PUBLIC_URL}/${previewKey}`,
        width: meta.width || 0,
        height: meta.height || 0,
        size: buffer.length,
      })

      uploaded++

      // Save progress to Sanity every 10 photos
      if (uploaded % 10 === 0) {
        process.stdout.write(`\n💾 Saving progress (${uploaded} uploaded)...`)
        await sanity.patch(gallery._id).set({ photos }).commit()
        console.log(` ✓\n`)
      }

    } catch (err) {
      console.error(`\n❌ Failed: ${filename} — ${err.message}`)
      console.log('💾 Saving progress before exit...')
      await sanity.patch(gallery._id).set({ photos }).commit()
      console.log(`✅ Progress saved. Re-run the same command to resume.\n`)
      process.exit(1)
    }
  }

  // Final save
  console.log(`\n💾 Final save to Sanity...`)
  await sanity.patch(gallery._id).set({ photos }).commit()

  console.log(`\n✅ Done!`)
  console.log(`   Uploaded: ${uploaded}`)
  console.log(`   Skipped:  ${skipped}`)
  console.log(`   Total:    ${photos.length}`)
  console.log(`\n🔗 https://sharifisina.com/clients/${GALLERY_SLUG}\n`)
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message)
  process.exit(1)
})
