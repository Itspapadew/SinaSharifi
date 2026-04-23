import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/studio') || pathname.startsWith('/admin')) {
    const auth = req.cookies.get('studio-auth')?.value
    if (auth === 'ilovevina9') return NextResponse.next()

    // Check if submitting password
    if (req.method === 'POST') return NextResponse.next()

    // Show password page
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sina Sharifi — Studio</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #fff; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
          .wrap { text-align: center; }
          h1 { font-family: Georgia, serif; font-weight: 300; font-size: 28px; margin-bottom: 2rem; color: #111; }
          em { font-style: italic; color: #a07850; }
          input { border: none; border-bottom: 1px solid #ccc; padding: 10px 0; font-size: 16px; width: 240px; outline: none; text-align: center; }
          button { display: block; margin: 1.5rem auto 0; padding: 10px 32px; background: #111; color: #fff; border: none; cursor: pointer; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Sina <em>Sharifi</em></h1>
          <form method="POST" action="/api/studio-auth">
            <input type="password" name="password" placeholder="Password" autofocus />
            <button type="submit">Enter</button>
          </form>
        </div>
      </body>
      </html>
    `, {
      status: 401,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/studio/:path*', '/admin/:path*'],
}
