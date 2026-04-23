import { Suspense } from 'react'
import { client } from '@/sanity/lib/client'
import { printsQuery } from '@/sanity/lib/queries'
import PrintsClient from '@/components/PrintsClient'

export const revalidate = 60

export const metadata = {
  title: 'Prints — Sina Sharifi',
  description: 'Limited edition fine art prints by Sina Sharifi.',
}

async function PrintsData() {
  const photos = await client.fetch(printsQuery)
  const prints = photos.map((p: any) => ({
    id: p._id,
    title: p.title,
    location: p.location || '',
    category: p.category || '',
    image: `${p.src}?w=1200&fit=max`,
    basePrice: p.price || 45,
    edition: p.edition || 50,
  }))
  return <PrintsClient prints={prints} />
}

export default function PrintsPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: "var(--nav-height)" }} />}>
      <PrintsData />
    </Suspense>
  )
}
