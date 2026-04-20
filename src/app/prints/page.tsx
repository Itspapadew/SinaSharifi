import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import PrintsClient from '@/components/PrintsClient'

export const revalidate = 60

export const metadata = {
  title: 'Prints — Sina Sharifi',
  description: 'Limited edition fine art prints by Sina Sharifi.',
}

const printsQuery = `
  *[_type == "photo" && availableAsPrint == true] | order(publishedAt desc) {
    _id,
    title,
    location,
    category,
    image,
    price,
    edition,
    "sold": 0,
  }
`

export default async function PrintsPage() {
  const photos = await client.fetch(printsQuery)

  const prints = photos.map((p: any) => ({
    id: p._id,
    title: p.title,
    location: p.location || '',
    category: p.category,
    image: urlFor(p.image).width(1200).url(),
    sizes: [
      { label: '12"×18"', price: p.price || 150 },
      { label: '20"×30"', price: Math.round((p.price || 150) * 1.8) },
      { label: '30"×45"', price: Math.round((p.price || 150) * 2.7) },
    ],
    edition: p.edition || 50,
    sold: p.sold || 0,
    story: '',
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
            No prints available yet. Mark photos as available in the <a href="/studio" style={{ color: "#a07850" }}>studio</a>.
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
