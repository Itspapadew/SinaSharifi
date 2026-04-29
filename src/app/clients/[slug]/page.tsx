import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import ClientGallery from '@/components/ClientGallery'
import { notFound } from 'next/navigation'

const clientGalleryQuery = groq`
  *[_type == "clientGallery" && slug.current == $slug][0] {
    _id,
    shootName,
    clientName,
    "slug": slug.current,
    password,
    message,
    allowDownload,
    expiresAt,
    photos[] {
      key,
      filename,
      previewUrl,
      width,
      height,
      size,
    }
  }
`

export default async function ClientPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await client.fetch(clientGalleryQuery, { slug })
  if (!gallery) notFound()
  if (gallery.expiresAt && new Date(gallery.expiresAt) < new Date()) notFound()
  return <ClientGallery gallery={gallery} />
}
