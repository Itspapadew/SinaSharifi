import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import archiver from 'archiver'
import { Readable } from 'stream'

const r2 = new S3Client({
  region: 'auto',
  endpoint: 'https://319a615abb303499484a163dccbe5519.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '569b53344dee6b2305b75d72114fc33e',
    secretAccessKey: 'b54ff9af86e1b0a24a8743a461269409178bfb41dce5b27e78e3d3f1c391933c',
  },
})

export async function POST(req: NextRequest) {
  try {
    const { keys, shootName } = await req.json()
    if (!keys || !keys.length) return NextResponse.json({ error: 'No keys' }, { status: 400 })

    const zipFilename = `${(shootName || 'gallery').replace(/\s+/g, '-')}.zip`

    // Create a TransformStream to pipe archiver output
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()

    const archive = archiver('zip', { zlib: { level: 6 } })

    archive.on('data', (chunk: Buffer) => {
      writer.write(chunk)
    })

    archive.on('end', () => {
      writer.close()
    })

    archive.on('error', (err: Error) => {
      writer.abort(err)
    })

    // Add all photos to archive
    ;(async () => {
      for (const key of keys) {
        try {
          const cmd = new GetObjectCommand({ Bucket: 'sina-sharifi-clients', Key: key })
          const res = await r2.send(cmd)
          if (res.Body) {
            const filename = key.split('/').pop() || 'photo.jpg'
            const nodeStream = res.Body.transformToWebStream()
            const reader = nodeStream.getReader()
            const chunks: Uint8Array[] = []
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              chunks.push(value)
            }
            const buffer = Buffer.concat(chunks)
            archive.append(buffer, { name: filename })
          }
        } catch (e) {
          console.error(`Failed to fetch ${key}:`, e)
        }
      }
      archive.finalize()
    })()

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
