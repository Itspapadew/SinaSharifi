import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.formData()
  const password = body.get('password')

  if (password === 'ilovevina9') {
    const res = NextResponse.redirect(new URL('/studio', req.url))
    res.cookies.set('studio-auth', 'ilovevina9', {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
    return res
  }

  return NextResponse.redirect(new URL('/studio', req.url))
}
