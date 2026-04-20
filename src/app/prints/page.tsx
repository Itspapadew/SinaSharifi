import Link from 'next/link'
import PrintsClient from '@/components/PrintsClient'

export const metadata = {
  title: 'Prints — Sina Sharifi',
  description: 'Limited edition fine art prints by Sina Sharifi.',
}

const prints = [
  {
    id: 'kotor-dawn',
    title: 'Kotor Dawn',
    location: 'Kotor, Montenegro',
    category: 'Landscape',
    story: 'Found this view at 5am after climbing the old city walls in complete darkness. The bay was perfectly still — not a boat moving, not a sound. The light lasted maybe four minutes.',
    image: '/prints/hero.jpg',
    sizes: [
      { label: '12"×18"', price: 150, priceId: 'price_small' },
      { label: '20"×30"', price: 280, priceId: 'price_medium' },
      { label: '30"×45"', price: 420, priceId: 'price_large' },
    ],
    edition: 50,
    sold: 12,
  },
  {
    id: 'kotor-rooftops',
    title: 'Kotor Rooftops',
    location: 'Kotor, Montenegro',
    category: 'Landscape',
    story: 'A seagull perched on an old chimney, the cathedral dome rising behind it, the fortress walls climbing the mountain above. Everything layered perfectly at dawn.',
    image: '/prints/portrait.jpg',
    sizes: [
      { label: '12"×18"', price: 150, priceId: 'price_small' },
      { label: '20"×30"', price: 280, priceId: 'price_medium' },
      { label: '30"×45"', price: 420, priceId: 'price_large' },
    ],
    edition: 50,
    sold: 8,
  },
  {
    id: 'atlantic-pool',
    title: 'Atlantic Pool',
    location: 'Azenhas do Mar, Portugal',
    category: 'Landscape',
    story: 'The natural tidal pool carved into the cliff at dusk. The ocean beyond was wild, but inside the pool everything was still. Two worlds separated by stone.',
    image: '/prints/wide.jpg',
    sizes: [
      { label: '12"×18"', price: 175, priceId: 'price_small' },
      { label: '20"×30"', price: 310, priceId: 'price_medium' },
      { label: '30"×45"', price: 460, priceId: 'price_large' },
    ],
    edition: 40,
    sold: 6,
  },
]

export default function PrintsPage() {
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

      <PrintsClient prints={prints} />

      <footer style={{ padding: "2rem 2.5rem", borderTop: "0.5px solid var(--charcoal)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
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
