import { client } from '@/sanity/lib/client'
import { homePhotosQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import HomeGrid from '@/components/HomeGrid'

export const revalidate = 60

export default async function Home() {
  const photos = await client.fetch(homePhotosQuery)

  const mapped = photos.map((p: any) => ({
    id: p._id,
    title: p.title,
    location: p.location || '',
    category: p.category,
    src: urlFor(p.image).width(800).height(800).fit('crop').url(),
    availableAsPrint: p.availableAsPrint,
    price: p.price,
  }))

  return <HomeGrid photos={mapped} />
}
