import { client } from '@/sanity/lib/client'
import { storyBySlugQuery, latestStoriesQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

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
  const stories = await client.fetch(latestStoriesQuery)
  return stories.map((s: any) => ({ slug: s.slug.current }))
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await client.fetch(storyBySlugQuery, { slug })
  if (!story) notFound()

  const allImages = [
    story.coverImage,
    ...(story.images || []),
  ].filter(Boolean)

  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>

      {/* Back */}
      <div style={{ padding: "1.5rem 2.5rem", borderBottom: "0.5px solid var(--charcoal)" }}>
        <Link href="/" style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "10px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#9a9189",
          textDecoration: "none",
        }}>
          ← Back
        </Link>
      </div>

      {/* Hero image */}
      <div style={{ position: "relative", width: "100%", paddingBottom: "56%", background: "#e8e4de" }}>
        <Image
          src={urlFor(story.coverImage).width(2000).url()}
          alt={story.title}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Story header */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 2.5rem 2rem" }}>
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#9a9189",
          margin: "0 0 1rem",
        }}>
          {story.category} {story.location && `· ${story.location}`} {story.camera && `· ${story.camera}`}
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 300,
          color: "#1a1814",
          lineHeight: 1.1,
          margin: "0 0 2rem",
          letterSpacing: "0.02em",
        }}>
          {story.title}
        </h1>

        {/* Story text */}
        {story.story && (
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "20px",
            fontWeight: 300,
            color: "#3a3530",
            lineHeight: 1.8,
            letterSpacing: "0.01em",
          }}>
            <PortableText value={story.story} />
          </div>
        )}
      </div>

      {/* Photo gallery */}
      {allImages.length > 1 && (
        <div style={{ padding: "2rem 2.5rem 4rem", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "4px" }}>
            {allImages.slice(1).map((img: any, i: number) => (
              <div key={i} style={{ position: "relative", paddingBottom: "75%", background: "#e8e4de" }}>
                <Image
                  src={urlFor(img).width(1200).url()}
                  alt={img.caption || story.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
                {img.caption && (
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1rem 1.25rem",
                    background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                  }}>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "14px",
                      color: "rgba(240,236,228,0.85)",
                      margin: 0,
                    }}>
                      {img.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print CTA */}
      {story.availableAsPrint && (
        <div style={{
          margin: "0 2.5rem 4rem",
          padding: "2.5rem",
          border: "0.5px solid var(--charcoal)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
          maxWidth: "1400px",
        }}>
          <div>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 4px" }}>
              Available as a limited edition print
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "24px", color: "#1a1814", margin: 0 }}>
              {story.title} {story.price && <em style={{ color: "#a07850" }}>from ${story.price}</em>}
            </p>
          </div>
          <Link href="/prints" style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#f7f5f1",
            background: "#1a1814",
            border: "0.5px solid #1a1814",
            padding: "14px 32px",
            borderRadius: "2px",
            textDecoration: "none",
            whiteSpace: "nowrap",
            fontWeight: 300,
          }}>
            Shop Prints
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        padding: "2rem 2.5rem",
        borderTop: "0.5px solid var(--charcoal)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "#9a9189", margin: 0 }}>
          Sina <em>Sharifi</em>
        </p>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#dedad4" }}>
          © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}
