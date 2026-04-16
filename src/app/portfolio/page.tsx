import { client } from '@/sanity/lib/client'
import { portfolioPhotosQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import PortfolioPage from '@/components/PortfolioPage'

export const revalidate = 60

export default async function Portfolio() {
  const photos = await client.fetch(portfolioPhotosQuery)

  const mapped = photos.map((p: any) => ({
    id: p._id,
    title: p.title,
    location: p.location || '',
    category: p.category,
    src: urlFor(p.image).width(1200).url(),
    availableAsPrint: p.availableAsPrint,
    price: p.price,
  }))

  return <PortfolioPage photos={mapped} />
}
