import { Suspense } from 'react'
import { client } from '@/sanity/lib/client'
import { portfolioPhotosQuery } from '@/sanity/lib/queries'
import PortfolioPage from '@/components/PortfolioPage'

export const revalidate = 60

async function PortfolioData() {
  const photos = await client.fetch(portfolioPhotosQuery)
  const mapped = photos.map((p: any) => ({
    id: p._id,
    title: p.title || '',
    location: p.location || '',
    category: p.category || '',
    src: `${p.src}?w=800&fit=max`,
    availableAsPrint: p.availableAsPrint || false,
    price: p.price,
  }))
  return <PortfolioPage photos={mapped} />
}

export default function Portfolio() {
  return (
    <Suspense fallback={<div style={{ paddingTop: "var(--nav-height)" }} />}>
      <PortfolioData />
    </Suspense>
  )
}
