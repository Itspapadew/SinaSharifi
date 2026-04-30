"use client";
import { useState } from "react";

type Photo = {
  key: string;
  filename?: string;
  previewUrl?: string;
  width?: number;
  height?: number;
}

const SIZES = [
  { label: '12×18"', sku: 'GLOBAL-FAP-12x18', price: 35, description: 'Small — perfect for desk or shelf' },
  { label: '24×16"', sku: 'GLOBAL-FAP-24x16', price: 60, description: 'Medium — ideal for living room' },
  { label: '36×24"', sku: 'GLOBAL-FAP-36x24', price: 95, description: 'Large — statement piece' },
]

const PAPERS = [
  { id: 'matte', label: 'Enhanced Matte', desc: '200gsm archival · no glare', multiplier: 1 },
  { id: 'hahnemuhle', label: 'Hahnemuhle Fine Art', desc: '310gsm cotton rag · museum grade', multiplier: 1.4 },
]

export default function ClientPrintModal({ photo, shootName, onClose }: {
  photo: Photo
  shootName: string
  onClose: () => void
}) {
  const [sizeIndex, setSizeIndex] = useState(0)
  const [paperId, setPaperId] = useState('matte')
  const [loading, setLoading] = useState(false)

  const size = SIZES[sizeIndex]
  const paper = PAPERS.find(p => p.id === paperId)!
  const price = Math.round(size.price * paper.multiplier)

  const handleOrder = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            title: `${shootName} — Client Print`,
            size: size.label,
            paper: paper.label,
            imageUrl: photo.previewUrl || '',
            price,
            quantity: 1,
            sku: size.sku,
          }]
        })
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
        zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", maxWidth: "520px", width: "100%",
          padding: "2.5rem", position: "relative",
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "1rem", right: "1rem",
          background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#9a9189",
        }}>×</button>

        {/* Photo preview */}
        {photo.previewUrl && (
          <div style={{ marginBottom: "1.5rem", height: "180px", overflow: "hidden" }}>
            <img src={photo.previewUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 0.5rem" }}>Order a Print</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "28px", fontWeight: 300, color: "#111", margin: "0 0 2rem" }}>
          Fine Art Print
        </h2>

        {/* Size selection */}
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 0.75rem" }}>Size</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "1.5rem" }}>
          {SIZES.map((s, i) => (
            <button key={s.sku} onClick={() => setSizeIndex(i)} style={{
              padding: "12px 16px", border: "0.5px solid",
              borderColor: sizeIndex === i ? "#a07850" : "#e0e0e0",
              background: sizeIndex === i ? "rgba(160,120,80,0.05)" : "transparent",
              cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#111", margin: 0 }}>{s.label}</p>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: 0 }}>{s.description}</p>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "20px", color: "#111", margin: 0 }}>${Math.round(s.price * paper.multiplier)}</p>
            </button>
          ))}
        </div>

        {/* Paper selection */}
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 0.75rem" }}>Paper</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "2rem" }}>
          {PAPERS.map(p => (
            <button key={p.id} onClick={() => setPaperId(p.id)} style={{
              padding: "12px 16px", border: "0.5px solid",
              borderColor: paperId === p.id ? "#a07850" : "#e0e0e0",
              background: paperId === p.id ? "rgba(160,120,80,0.05)" : "transparent",
              cursor: "pointer", textAlign: "left",
            }}>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#111", margin: 0 }}>{p.label}</p>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: 0 }}>{p.desc}</p>
            </button>
          ))}
        </div>

        {/* Order button */}
        <button
          onClick={handleOrder}
          disabled={loading}
          style={{
            width: "100%", padding: "16px",
            background: loading ? "#e0e0e0" : "#111",
            color: loading ? "#9a9189" : "#fff",
            border: "none", cursor: loading ? "wait" : "pointer",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase",
            borderRadius: "2px",
          }}
        >
          {loading ? "Redirecting..." : `Order Print — $${price}`}
        </button>

        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", textAlign: "center", margin: "1rem 0 0" }}>
          Printed and shipped by Prodigi · Free shipping on orders over $75
        </p>
      </div>
    </div>
  )
}
