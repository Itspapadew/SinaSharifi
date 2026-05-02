"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import ClientPrintModal from "@/components/ClientPrintModal";
import ClientBookModal from "@/components/ClientBookModal";

type Photo = {
  key: string;
  filename?: string;
  previewUrl?: string;
  width?: number;
  height?: number;
  size?: number;
}

type Gallery = {
  shootName: string;
  clientName: string;
  slug: string;
  password: string;
  message?: string;
  allowDownload: boolean;
  expiresAt?: string;
  photos: Photo[];
}

// ─── Justified grid (desktop only) ───────────────────────────────────────────
function buildRows(photos: Photo[], containerWidth: number, targetRowHeight: number) {
  const rows: Photo[][] = []
  let currentRow: Photo[] = []
  let currentWidth = 0
  for (const photo of photos) {
    const aspect = (photo.width && photo.height) ? photo.width / photo.height : 1.5
    const scaledWidth = targetRowHeight * aspect
    if (currentWidth + scaledWidth > containerWidth && currentRow.length > 0) {
      rows.push(currentRow)
      currentRow = [photo]
      currentWidth = scaledWidth
    } else {
      currentRow.push(photo)
      currentWidth += scaledWidth
    }
  }
  if (currentRow.length > 0) rows.push(currentRow)
  return rows
}

function DesktopGrid({ photos, onPhotoClick }: {
  photos: Photo[]
  onPhotoClick: (index: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(1200)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth)
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const gap = 3
  const rows = buildRows(photos, containerWidth, 280)
  let globalIndex = 0

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {rows.map((row, ri) => {
        const totalAspect = row.reduce((sum, p) => sum + ((p.width && p.height) ? p.width / p.height : 1.5), 0)
        const gapSpace = gap * (row.length - 1)
        const rowHeight = (containerWidth - gapSpace) / totalAspect
        const rowStart = globalIndex
        globalIndex += row.length

        return (
          <div key={ri} style={{ display: "flex", gap: `${gap}px`, marginBottom: `${gap}px` }}>
            {row.map((photo, pi) => {
              const idx = rowStart + pi
              const aspect = (photo.width && photo.height) ? photo.width / photo.height : 1.5
              const photoWidth = rowHeight * aspect
              const isHovered = hoveredIndex === idx

              return (
                <div
                  key={photo.key || idx}
                  onClick={() => onPhotoClick(idx)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    position: "relative",
                    width: `${photoWidth}px`,
                    height: `${rowHeight}px`,
                    flexShrink: 0,
                    overflow: "hidden",
                    cursor: "zoom-in",
                    background: "#f0f0f0",
                  }}
                >
                  {photo.previewUrl && (
                    <img
                      src={photo.previewUrl}
                      alt={photo.filename || ""}
                      style={{
                        width: "100%", height: "100%", objectFit: "cover", display: "block",
                        transition: "transform 0.4s ease",
                        transform: isHovered ? "scale(1.03)" : "scale(1)",
                      }}
                    />
                  )}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)",
                    opacity: isHovered ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: "none",
                  }} />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ─── Mobile grid (2-column CSS grid) ─────────────────────────────────────────
function MobileGrid({ photos, onPhotoClick }: {
  photos: Photo[]
  onPhotoClick: (index: number) => void
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "3px",
      width: "100%",
    }}>
      {photos.map((photo, i) => (
        <div
          key={photo.key || i}
          onClick={() => onPhotoClick(i)}
          style={{
            position: "relative",
            paddingBottom: "100%",
            overflow: "hidden",
            cursor: "pointer",
            background: "#f0f0f0",
          }}
        >
          {photo.previewUrl && (
            <img
              src={photo.previewUrl}
              alt={photo.filename || ""}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", display: "block",
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ClientGallery({ gallery }: { gallery: Gallery }) {
  const [entered, setEntered] = useState("")
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadingAll, setDownloadingAll] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [printPhoto, setPrintPhoto] = useState<Photo | null>(null)
  const [showBookModal, setShowBookModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightbox(null); setPrintPhoto(null) }
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const photos = gallery.photos || []
  const prev = useCallback(() => setLightbox(i => i !== null ? (i - 1 + photos.length) % photos.length : 0), [photos.length])
  const next = useCallback(() => setLightbox(i => i !== null ? (i + 1) % photos.length : 0), [photos.length])

  const handleAuth = () => {
    if (entered === gallery.password) { setAuthed(true); setError(false) }
    else setError(true)
  }

  const handleDownload = async (photo: Photo) => {
    const key = photo.key
    const filename = photo.filename || "photo.jpg"
    if (isMobile && photo.previewUrl) {
      window.open(photo.previewUrl, "_blank")
      return
    }
    setDownloading(key)
    try {
      const res = await fetch("/api/client-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, filename }),
      })
      const { url } = await res.json()
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
    } catch {
      alert("Download failed. Please try again.")
    } finally {
      setDownloading(null)
    }
  }

  const handleDownloadAll = async () => {
    setDownloadingAll(true)
    try {
      const keys = photos.map(p => p.key)
      const res = await fetch("/api/client-download-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys, shootName: gallery.shootName }),
      })
      if (!res.ok) throw new Error("Failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${gallery.shootName.replace(/\s+/g, "-")}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert("Download failed. Please try again.")
    } finally {
      setDownloadingAll(false)
    }
  }

  // ─── Password screen ────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ paddingTop: "var(--nav-height)", minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem", width: "100%" }}>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 1rem" }}>Private Gallery</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "36px", fontWeight: 300, color: "#111", margin: "0 0 0.25rem" }}>{gallery.shootName}</h1>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "16px", color: "#9a9189", margin: "0 0 2.5rem" }}>{gallery.clientName}</p>
          <input
            type="password"
            placeholder="Enter your password"
            value={entered}
            onChange={e => setEntered(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAuth()}
            style={{
              width: "100%", padding: "14px 0", background: "transparent",
              border: "none", borderBottom: `0.5px solid ${error ? "#c0392b" : "#e0e0e0"}`,
              fontFamily: "'Inter', system-ui, sans-serif", fontSize: "15px",
              color: "#111", outline: "none", textAlign: "center", marginBottom: "1.5rem",
            }}
          />
          {error && <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "12px", color: "#c0392b", margin: "0 0 1rem" }}>Incorrect password.</p>}
          <button onClick={handleAuth} style={{
            width: "100%", padding: "14px", background: "#111", color: "#fff",
            border: "none", cursor: "pointer", fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: "2px",
          }}>View Gallery</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: "var(--nav-height)", background: "#fff", minHeight: "100vh", overflowX: "hidden", maxWidth: "100vw" }}>

      {/* Modals */}
      {printPhoto && <ClientPrintModal photo={printPhoto} shootName={gallery.shootName} onClose={() => setPrintPhoto(null)} />}
      {showBookModal && <ClientBookModal photos={photos} shootName={gallery.shootName} clientName={gallery.clientName} onClose={() => setShowBookModal(false)} />}

      {/* Lightbox */}
      {lightbox !== null && photos[lightbox]?.previewUrl && (
        <div style={{
          position: "fixed", inset: 0, background: "#000",
          zIndex: 1000, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          {/* Close */}
          <button onClick={() => setLightbox(null)} style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
            width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer",
            fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
          }}>×</button>

          {/* Image — with tap zones for mobile */}
          <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              src={photos[lightbox].previewUrl}
              alt={photos[lightbox].filename || ""}
              style={{ maxWidth: "92vw", maxHeight: "80vh", objectFit: "contain", display: "block", userSelect: "none" }}
            />

            {/* Mobile tap zones — left half = prev, right half = next */}
            {isMobile && (
              <>
                <div onClick={prev} style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "100%", cursor: "pointer" }} />
                <div onClick={next} style={{ position: "absolute", right: 0, top: 0, width: "50%", height: "100%", cursor: "pointer" }} />
              </>
            )}
          </div>

          {/* Navigation — arrows on desktop, buttons below on mobile */}
          {!isMobile && (
            <>
              <button onClick={prev} style={{
                position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
                width: "48px", height: "48px", borderRadius: "50%", fontSize: "24px",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>‹</button>
              <button onClick={next} style={{
                position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
                width: "48px", height: "48px", borderRadius: "50%", fontSize: "24px",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>›</button>
            </>
          )}

          {/* Bottom bar */}
          <div style={{
            width: "100%", padding: "1rem 1.5rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "rgba(0,0,0,0.5)",
          }}>
            {/* Counter + mobile save hint */}
            <div>
              <p style={{
                fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px",
                letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)", margin: 0,
              }}>{lightbox + 1} / {photos.length}</p>
              {isMobile && (
                <p style={{
                  fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px",
                  color: "rgba(255,255,255,0.3)", margin: "4px 0 0", letterSpacing: "0.08em",
                }}>Press & hold image to save to Photos</p>
              )}
            </div>

            {/* Mobile nav buttons */}
            {isMobile && (
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <button onClick={prev} style={{
                  background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
                  width: "40px", height: "40px", borderRadius: "50%", fontSize: "20px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>‹</button>
                <button onClick={next} style={{
                  background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
                  width: "40px", height: "40px", borderRadius: "50%", fontSize: "20px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>›</button>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px" }}>
              {gallery.allowDownload && (
                <button
                  onClick={() => handleDownload(photos[lightbox])}
                  style={{
                    background: "rgba(255,255,255,0.1)", color: "#fff",
                    border: "0.5px solid rgba(255,255,255,0.2)",
                    cursor: "pointer", padding: "8px 16px",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: "2px",
                  }}
                >↓</button>
              )}
              <button
                onClick={() => { setLightbox(null); setPrintPhoto(photos[lightbox]) }}
                style={{
                  background: "#a07850", color: "#fff", border: "none",
                  cursor: "pointer", padding: "8px 16px",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: "2px",
                }}
              >Print</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "3rem 1.5rem 1.5rem", borderBottom: "0.5px solid #e0e0e0" }}>
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 0.5rem" }}>Private Gallery</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 5vw, 48px)", fontWeight: 300, color: "#111", margin: "0 0 0.25rem" }}>{gallery.shootName}</h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "17px", color: "#9a9189", margin: "0 0 0.5rem" }}>{gallery.clientName}</p>
        {gallery.message && <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px", color: "#3a3530", lineHeight: 1.7, margin: "0 0 1rem" }}>{gallery.message}</p>}
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: "0 0 1.5rem" }}>{photos.length} photos</p>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {gallery.allowDownload && !isMobile && (
            <button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              style={{
                padding: "12px 20px",
                background: downloadingAll ? "#e0e0e0" : "#a07850",
                color: downloadingAll ? "#9a9189" : "#fff",
                border: "none", cursor: downloadingAll ? "wait" : "pointer",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase",
                borderRadius: "2px", whiteSpace: "nowrap",
              }}
            >{downloadingAll ? "Preparing..." : `↓ Download All`}</button>
          )}
          <button
            onClick={() => setShowBookModal(true)}
            style={{
              padding: "12px 20px", background: "transparent", color: "#111",
              border: "0.5px solid #111", cursor: "pointer",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase",
              borderRadius: "2px", whiteSpace: "nowrap",
            }}
          >📚 Order a Book</button>
        </div>
      </div>

      {/* Gallery grid */}
      <div style={{ padding: "3px" }}>
        {!photos.length ? (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "20px", color: "#9a9189", textAlign: "center", padding: "4rem 0" }}>Photos coming soon.</p>
        ) : isMobile ? (
          <MobileGrid photos={photos} onPhotoClick={setLightbox} />
        ) : (
          <DesktopGrid photos={photos} onPhotoClick={setLightbox} />
        )}
      </div>

      <footer style={{ padding: "2rem 1.5rem", borderTop: "0.5px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "#9a9189", margin: 0 }}>Sina <em>Sharifi</em></p>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#dedad4" }}>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
