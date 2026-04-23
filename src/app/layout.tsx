import type { Metadata } from 'next'
import CartDrawer from '@/components/CartDrawer'
import Nav from '@/components/Nav'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sina Sharifi — The world, witnessed.',
  description: 'Fine art photography by Sina Sharifi. Limited edition prints from the Balkans, Mediterranean, wildlife and macro. The world, witnessed.',
  metadataBase: new URL('https://sharifisina.com'),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Sina Sharifi — The world, witnessed.',
    description: 'Fine art photography. Limited edition prints from the Balkans, Mediterranean, wildlife and macro.',
    url: 'https://sharifisina.com',
    siteName: 'Sina Sharifi',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sina Sharifi Photography',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sina Sharifi — The world, witnessed.',
    description: 'Fine art photography. Limited edition prints from the Balkans, Mediterranean, wildlife and macro.',
    images: ['/og-image.jpg'],
  },
  keywords: ['fine art photography', 'limited edition prints', 'Balkans photography', 'Mediterranean photography', 'wildlife photography', 'macro photography', 'Sina Sharifi'],
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
