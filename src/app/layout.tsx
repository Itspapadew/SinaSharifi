import type { Metadata } from 'next'
import { CartDrawer } from '@/components/CartDrawer'
import Nav from '@/components/Nav'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sina Sharifi — The world, witnessed.',
  description: 'Fine art photography by Sina Sharifi. Limited edition prints, licensing, and more.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <CartDrawer />
        {children}
      </body>
    </html>
  )
}
