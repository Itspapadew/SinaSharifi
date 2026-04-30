"use client";
import { useState } from "react";

type Photo = {
  key: string;
  filename?: string;
  previewUrl?: string;
}

type BookType = "softcover" | "hardcover" | "layflat"
type PageCount = 20 | 30 | 40 | 50

const BOOK_TYPES = [
  { id: "softcover" as BookType, label: "Softcover", desc: "Premium gloss paper · elegant and affordable", icon: "📗" },
  { id: "hardcover" as BookType, label: "Hardcover", desc: "Polished hard cover · perfect for weddings", icon: "📘" },
  { id: "layflat" as BookType, label: "Layflat", desc: "Opens completely flat · best for landscapes", icon: "📙" },
]

const PAGE_COUNTS: PageCount[] = [20, 30, 40, 50]

const PRICES: Record<BookType, Record<PageCount, number>> = {
  softcover: { 20: 120, 30: 160, 40: 200, 50: 240 },
  hardcover: { 20: 160, 30: 200, 40: 250, 50: 300 },
  layflat:   { 20: 200, 30: 260, 40: 320, 50: 380 },
}

export default function ClientBookModal({ photos, shootName, clientName, onClose }: {
  photos: Photo[]
  shootName: string
  clientName: string
  onClose: () => void
}) {
  const [step, setStep] = useState<"type" | "pages" | "photos" | "confirm">("type")
  const [bookType, setBookType] = useState<BookType>("hardcover")
  const [pageCount, setPageCount] = useState<PageCount>(30)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [note, setNote] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const maxPhotos = pageCount
  const price = PRICES[bookType][pageCount]

  const togglePhoto = (key: string) => {
    setSelectedPhotos(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        if (next.size >= maxPhotos) return prev // limit reached
        next.add(key)
      }
      return next
    })
  }

  const handleSubmit = async () => {
    setSending(true)
    try {
      const selected = photos.filter(p => selectedPhotos.has(p.key))
      const photoList = selected.map((p, i) => `${i + 1}. ${p.filename || p.key} — ${p.previewUrl}`).join('\n')

      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName,
          email: "client-gallery@sharifisina.com",
          message: `📚 BOOK REQUEST\n\nClient: ${clientName}\nShoot: ${shootName}\n\nBook type: ${bookType}\nPage count: ${pageCount} pages\nEstimated price: $${price}\nPhotos selected: ${selected.length}/${maxPhotos}\n\nClient note:\n${note || "None"}\n\nSelected photos:\n${photoList}`,
        }),
      })
      setSent(true)
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setSending(false)
    }
  }

  const label: React.CSSProperties = {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: "10px", letterSpacing: "0.16em",
    textTransform: "uppercase", color: "#9a9189", margin: "0 0 0.75rem",
    display: "block",
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
      zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", overflowY: "auto",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", width: "100%",
        maxWidth: step === "photos" ? "900px" : "540px",
        maxHeight: "90vh", overflowY: "auto",
        padding: "2.5rem", position: "relative",
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "1rem", right: "1rem",
          background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#9a9189",
        }}>×</button>

        {/* Header */}
        <p style={{ ...label, margin: "0 0 0.5rem" }}>Order a Photobook</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "32px", fontWeight: 300, color: "#111", margin: "0 0 0.5rem" }}>
          {shootName}
        </h2>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "2rem" }}>
          {["type", "pages", "photos", "confirm"].map((s, i) => (
            <div key={s} style={{
              height: "3px", flex: 1, borderRadius: "2px",
              background: ["type", "pages", "photos", "confirm"].indexOf(step) >= i ? "#a07850" : "#e0e0e0",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {sent ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <p style={{ fontSize: "40px", margin: "0 0 1rem" }}>📚</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "28px", fontWeight: 300, color: "#111", margin: "0 0 0.75rem" }}>
              Request received!
            </h3>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "18px", color: "#9a9189", margin: "0 0 2rem" }}>
              I'll review your selection and be in touch within 24 hours with a preview and payment link.
            </p>
            <button onClick={onClose} style={{
              padding: "12px 32px", background: "#111", color: "#fff",
              border: "none", cursor: "pointer",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: "2px",
            }}>Close</button>
          </div>
        ) : (
          <>
            {/* STEP 1 — Book type */}
            {step === "type" && (
              <div>
                <span style={label}>Choose your book type</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "2rem" }}>
                  {BOOK_TYPES.map(bt => (
                    <button key={bt.id} onClick={() => setBookType(bt.id)} style={{
                      padding: "14px 16px", border: "0.5px solid",
                      borderColor: bookType === bt.id ? "#a07850" : "#e0e0e0",
                      background: bookType === bt.id ? "rgba(160,120,80,0.05)" : "transparent",
                      cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "1rem",
                    }}>
                      <span style={{ fontSize: "24px" }}>{bt.icon}</span>
                      <div>
                        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "14px", fontWeight: 500, color: "#111", margin: 0 }}>{bt.label}</p>
                        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "12px", color: "#9a9189", margin: 0 }}>{bt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep("pages")} style={{
                  width: "100%", padding: "14px", background: "#111", color: "#fff",
                  border: "none", cursor: "pointer", fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: "2px",
                }}>Next →</button>
              </div>
            )}

            {/* STEP 2 — Page count */}
            {step === "pages" && (
              <div>
                <span style={label}>Choose page count</span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "2rem" }}>
                  {PAGE_COUNTS.map(pc => (
                    <button key={pc} onClick={() => setPageCount(pc)} style={{
                      padding: "20px", border: "0.5px solid",
                      borderColor: pageCount === pc ? "#a07850" : "#e0e0e0",
                      background: pageCount === pc ? "rgba(160,120,80,0.05)" : "transparent",
                      cursor: "pointer", textAlign: "center",
                    }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "32px", fontWeight: 300, color: "#111", margin: "0 0 0.25rem" }}>{pc}</p>
                      <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: "0 0 0.5rem" }}>pages · up to {pc} photos</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "22px", color: "#a07850", margin: 0 }}>${PRICES[bookType][pc]}</p>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setStep("type")} style={{
                    flex: 1, padding: "14px", background: "transparent", color: "#111",
                    border: "0.5px solid #e0e0e0", cursor: "pointer",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: "2px",
                  }}>← Back</button>
                  <button onClick={() => setStep("photos")} style={{
                    flex: 2, padding: "14px", background: "#111", color: "#fff",
                    border: "none", cursor: "pointer", fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: "2px",
                  }}>Select Photos →</button>
                </div>
              </div>
            )}

            {/* STEP 3 — Photo selection */}
            {step === "photos" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{ ...label, margin: 0 }}>Select up to {maxPhotos} photos</span>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "12px", color: selectedPhotos.size >= maxPhotos ? "#a07850" : "#9a9189" }}>
                    {selectedPhotos.size}/{maxPhotos} selected
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "4px", marginBottom: "1.5rem", maxHeight: "50vh", overflowY: "auto" }}>
                  {photos.map(photo => {
                    const isSelected = selectedPhotos.has(photo.key)
                    const isDisabled = !isSelected && selectedPhotos.size >= maxPhotos
                    return (
                      <div
                        key={photo.key}
                        onClick={() => !isDisabled && togglePhoto(photo.key)}
                        style={{
                          position: "relative", paddingBottom: "100%", overflow: "hidden",
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          opacity: isDisabled ? 0.4 : 1,
                          border: isSelected ? "3px solid #a07850" : "3px solid transparent",
                          transition: "border 0.2s, opacity 0.2s",
                        }}
                      >
                        {photo.previewUrl && (
                          <img src={photo.previewUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                        {isSelected && (
                          <div style={{
                            position: "absolute", top: "6px", right: "6px",
                            background: "#a07850", color: "#fff",
                            width: "22px", height: "22px", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "13px", fontWeight: "bold",
                          }}>✓</div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setStep("pages")} style={{
                    flex: 1, padding: "14px", background: "transparent", color: "#111",
                    border: "0.5px solid #e0e0e0", cursor: "pointer",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: "2px",
                  }}>← Back</button>
                  <button
                    onClick={() => setStep("confirm")}
                    disabled={selectedPhotos.size === 0}
                    style={{
                      flex: 2, padding: "14px", background: selectedPhotos.size === 0 ? "#e0e0e0" : "#111",
                      color: selectedPhotos.size === 0 ? "#9a9189" : "#fff",
                      border: "none", cursor: selectedPhotos.size === 0 ? "not-allowed" : "pointer",
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: "2px",
                    }}
                  >Review Order →</button>
                </div>
              </div>
            )}

            {/* STEP 4 — Confirm */}
            {step === "confirm" && (
              <div>
                <span style={label}>Review your order</span>

                {/* Summary */}
                <div style={{ background: "#f9f9f9", padding: "1.5rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#9a9189" }}>Book type</span>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#111", textTransform: "capitalize" }}>{bookType}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#9a9189" }}>Pages</span>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#111" }}>{pageCount} pages</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#9a9189" }}>Photos selected</span>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#111" }}>{selectedPhotos.size}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "0.5px solid #e0e0e0" }}>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "14px", color: "#111", fontWeight: 500 }}>Estimated price</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "24px", color: "#a07850" }}>${price}</span>
                  </div>
                </div>

                {/* Selected photos preview */}
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                  {photos.filter(p => selectedPhotos.has(p.key)).slice(0, 8).map(p => (
                    <div key={p.key} style={{ width: "60px", height: "60px", overflow: "hidden", borderRadius: "2px" }}>
                      {p.previewUrl && <img src={p.previewUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                  ))}
                  {selectedPhotos.size > 8 && (
                    <div style={{ width: "60px", height: "60px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px" }}>
                      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "12px", color: "#9a9189" }}>+{selectedPhotos.size - 8}</span>
                    </div>
                  )}
                </div>

                {/* Note */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={label}>Any notes? (optional)</span>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="e.g. please start with the beach photos, I'd love a romantic feel..."
                    style={{
                      width: "100%", padding: "12px",
                      border: "0.5px solid #e0e0e0", background: "transparent",
                      fontFamily: "'Inter', system-ui, sans-serif", fontSize: "14px",
                      color: "#111", outline: "none", resize: "vertical", minHeight: "80px",
                    }}
                  />
                </div>

                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: "0 0 1rem", lineHeight: 1.6 }}>
                  This sends a request — I'll review your selection, design a preview, and send you a payment link within 24 hours.
                </p>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setStep("photos")} style={{
                    flex: 1, padding: "14px", background: "transparent", color: "#111",
                    border: "0.5px solid #e0e0e0", cursor: "pointer",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: "2px",
                  }}>← Back</button>
                  <button onClick={handleSubmit} disabled={sending} style={{
                    flex: 2, padding: "14px",
                    background: sending ? "#e0e0e0" : "#a07850",
                    color: sending ? "#9a9189" : "#fff",
                    border: "none", cursor: sending ? "wait" : "pointer",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: "2px",
                  }}>
                    {sending ? "Sending..." : `Request Book — $${price}`}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
