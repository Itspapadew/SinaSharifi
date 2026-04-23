import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()

  // Log to Vercel logs (always works, no extra service needed)
  console.log(`CONTACT FORM — From: ${name} <${email}>\n\n${message}`)

  // If you add Resend later, wire it here. For now redirect to mailto fallback.
  return NextResponse.json({ ok: true })
}
