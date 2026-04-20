import { client } from '@/sanity/lib/client'
import { printsQuery } from '@/sanity/lib/queries'
import PrintsClient from '@/components/PrintsClient'

export const revalidate = 60

export const metadata = {
  title: 'Prints — Sina Sharifi',
  description: 'Limited edition fine art prints by Sina Sharifi.',
}

export default async function PrintsPage() {
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

  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <div style={{ padding: "3.5rem 2.5rem 2rem", borderBottom: "0.5px solid var(--charcoal)" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 300, color: "#1a1814", margin: "0 0 0.5rem" }}>
          Prints
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "18px", color: "#9a9189", margin: 0 }}>
          Limited edition fine art prints — archival quality, signed and numbered.
        </p>
      </div>

      {prints.length === 0 ? (
        <div style={{ padding: "6rem 2.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "24px", color: "#9a9189" }}>
            No prints available yet. Check back soon.
          </p>
        </div>
      ) : (
        <PrintsClient prints={prints} />
      )}

      <footer style={{ padding: "2rem 2.5rem", borderTop: "0.5px solid var(--charcoal)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "#9a9189", margin: 0 }}>Sina <em>Sharifi</em></p>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#dedad4" }}>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
