import { client } from '@/sanity/lib/client'
import { allStoriesQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import PortfolioFilter from '@/components/PortfolioFilter'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Portfolio — Sina Sharifi',
  description: 'Wildlife, landscape, portrait, and macro photography by Sina Sharifi.',
}

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'macro', label: 'Macro' },
  { value: 'family', label: 'Family Portrait' },
]

export default async function PortfolioPage() {
  const stories = await client.fetch(allStoriesQuery)

  const photos = stories.map((s: any) => ({
    id: s._id,
    title: s.title,
    category: s.category,
    slug: s.slug?.current,
    src: urlFor(s.coverImage).width(1200).url(),
    availableAsPrint: s.availableAsPrint,
    price: s.price,
  }))

  return (
    <div style={{ paddingTop: 'var(--nav-height)' }}>
      <header style={{
        padding: '3.5rem 2.5rem 2.5rem',
        borderBottom: '0.5px solid var(--charcoal)',
        marginBottom: '2.5rem',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 300,
          fontSize: 'clamp(28px, 4vw, 44px)',
          color: 'var(--linen)',
          lineHeight: 1.1,
          letterSpacing: '0.01em',
          marginBottom: '0.75rem',
        }}>
          Portfolio
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          color: 'var(--ash)',
          fontWeight: 300,
          letterSpacing: '0.04em',
        }}>
          {photos.length} photograph{photos.length !== 1 ? 's' : ''}
        </p>
      </header>

      <PortfolioFilter photos={photos} categories={CATEGORIES} />

      <footer style={{
        padding: '2rem 2.5rem',
        borderTop: '0.5px solid var(--charcoal)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--ash)', margin: 0 }}>
          Sina <em>Sharifi</em>
        </p>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--charcoal)' }}>
          © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}
