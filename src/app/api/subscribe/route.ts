import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    await resend.contacts.create({
      email,
      firstName: firstName || '',
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
