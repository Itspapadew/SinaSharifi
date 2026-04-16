import { client } from '@/sanity/lib/client'
import { latestStoriesQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import PortfolioGrid from '@/components/PortfolioGrid'

export const revalidate = 60

export default async function Home() {
  const stories = await client.fetch(latestStoriesQuery)

  const mapped = stories.map((s: any) => ({
    id: s._id,
    title: s.title,
    location: s.location || '',
    category: s.category,
    slug: s.slug?.current,
    src: urlFor(s.coverImage).width(1800).url(),
    availableAsPrint: s.availableAsPrint,
    price: s.price,
  }))

  return <PortfolioGrid photos={mapped} />
}
