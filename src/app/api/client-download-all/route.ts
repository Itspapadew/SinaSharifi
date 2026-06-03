import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import JSZip from 'jszip'

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
    const zip = new JSZip()

    for (const key of keys) {
      try {
        const cmd = new GetObjectCommand({ Bucket: 'sina-sharifi-clients', Key: key })
        const res = await r2.send(cmd)
        if (res.Body) {
          const filename = key.split('/').pop() || 'photo.jpg'
          const reader = res.Body.transformToWebStream().getReader()
          const chunks: Uint8Array[] = []
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            chunks.push(value)
          }
          zip.file(filename, Buffer.concat(chunks))
        }
      } catch (e) {
        console.error(`Failed to fetch ${key}:`, e)
      }
    }

    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    })

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    })
  } catch (err: any) {
    console.error('ZIP error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
