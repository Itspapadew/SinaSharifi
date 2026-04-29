import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2, BUCKET } from '@/lib/r2'

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json()
    if (!key) return NextResponse.json({ error: 'No key' }, { status: 400 })

    const url = await getSignedUrl(r2, new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }), { expiresIn: 3600 }) // 1 hour

    return NextResponse.json({ url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
