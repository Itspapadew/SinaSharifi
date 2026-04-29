import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import ClientGallery from '@/components/ClientGallery'
import { notFound } from 'next/navigation'

const clientGalleryQuery = groq`
  *[_type == "clientGallery" && slug.current == $slug][0] {
    _id,
    clientName,
    "slug": slug.current,
    password,
    shootDate,
    message,
    photos[] {
      "key": asset->url,
      caption,
    }
  }
`

export default async function ClientPage({ params }: { params: { slug: string } }) {
  const gallery = await client.fetch(clientGalleryQuery, { slug: params.slug })
  if (!gallery) notFound()
  return <ClientGallery gallery={gallery} />
}
