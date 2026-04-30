import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

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
    const { key, filename } = await req.json()
    if (!key) return NextResponse.json({ error: 'No key' }, { status: 400 })

    const url = await getSignedUrl(r2, new GetObjectCommand({
      Bucket: 'sina-sharifi-clients',
      Key: key,
      ResponseContentDisposition: `attachment; filename="${filename || key.split('/').pop()}"`,
    }), { expiresIn: 3600 })

    return NextResponse.json({ url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
