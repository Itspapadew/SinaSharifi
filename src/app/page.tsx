import { client } from '@/sanity/lib/client'
import { homePhotosQuery } from '@/sanity/lib/queries'
import HomeGrid from '@/components/HomeGrid'
import WorldMap from '@/components/WorldMap'

export const revalidate = 60

export default async function Home() {
  const { photos, quickUploads } = await client.fetch(homePhotosQuery)

  const allPhotos: any[] = []

  for (const p of photos || []) {
    if (p.src) allPhotos.push({
      id: p._id,
      title: p.title || '',
      location: p.location || '',
      category: p.category || '',
      src: `${p.src}?w=1600&fit=max`,
      availableAsPrint: p.availableAsPrint || false,
      price: p.price,
      publishedAt: p.publishedAt,
    })
  }

  for (const q of quickUploads || []) {
    for (const [i, imgSrc] of (q.images || []).entries()) {
      if (imgSrc) allPhotos.push({
        id: `${q._id}-${i}`,
        title: '',
        location: q.location || '',
        category: q.category || '',
        src: `${imgSrc}?w=1600&fit=max`,
        availableAsPrint: false,
        publishedAt: q.publishedAt,
      })
    }
  }

  allPhotos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const limited = allPhotos.slice(0, 20)

  return (
    <>
      <HomeGrid photos={limited} />
      <WorldMap />
    </>
  )
}
