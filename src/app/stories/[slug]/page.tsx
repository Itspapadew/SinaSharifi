import { client } from '@/sanity/lib/client'
import { storyBySlugQuery, allStoriesQuery } from '@/sanity/lib/queries'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import StoryGallery from '@/components/StoryGallery'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await client.fetch(storyBySlugQuery, { slug })
  if (!story) return {}
  return {
    title: `${story.title} — Sina Sharifi`,
    description: story.location,
  }
}

export async function generateStaticParams() {
  const stories = await client.fetch(allStoriesQuery)
  return stories
    .filter((s: any) => s.slug?.current)
    .map((s: any) => ({ slug: s.slug.current }))
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await client.fetch(storyBySlugQuery, { slug })
  if (!story) notFound()

  const galleryImages = (story.images || []).map((img: any) => ({
    src: img.src,
    caption: img.caption || '',
  }))

  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <div style={{ padding: "1.5rem 2.5rem", borderBottom: "0.5px solid var(--charcoal)" }}>
        <Link href="/" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189", textDecoration: "none" }}>
          ← Back
        </Link>
      </div>

      <div style={{ position: "relative", width: "100%", paddingBottom: "56%", background: "#e8e4de" }}>
        <Image src={story.coverSrc} alt={story.title} fill style={{ objectFit: "cover" }} priority />
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 2.5rem 2rem" }}>
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 1rem" }}>
          {story.category}{story.location && ` · ${story.location}`}{story.camera && ` · ${story.camera}`}
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 300, color: "#1a1814", lineHeight: 1.1, margin: "0 0 2rem", letterSpacing: "0.02em" }}>
          {story.title}
        </h1>
        {story.story && (
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "20px", fontWeight: 300, color: "#3a3530", lineHeight: 1.8 }}>
            <PortableText value={story.story} />
          </div>
        )}
      </div>

      {galleryImages.length > 0 && (
        <div style={{ padding: "2rem 2.5rem 4rem", maxWidth: "1400px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189", marginBottom: "1.5rem" }}>
            {galleryImages.length} {galleryImages.length === 1 ? 'photograph' : 'photographs'}
          </p>
          <StoryGallery images={galleryImages} />
        </div>
      )}

      <footer style={{ padding: "2rem 2.5rem", borderTop: "0.5px solid var(--charcoal)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "#9a9189", margin: 0 }}>Sina <em>Sharifi</em></p>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#dedad4" }}>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
