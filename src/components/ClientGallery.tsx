"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import ClientPrintModal from "@/components/ClientPrintModal";

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

// Justified grid layout calculator
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

function JustifiedGrid({ photos, onPhotoClick, onDownload, allowDownload, isMobile }: {
  photos: Photo[]
  onPhotoClick: (index: number) => void
  onDownload: (photo: Photo) => void
  allowDownload: boolean
  isMobile: boolean
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

  const targetHeight = isMobile ? 180 : 280
  const gap = 3
  const rows = buildRows(photos, containerWidth, targetHeight)

  let globalIndex = 0

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {rows.map((row, ri) => {
        // Calculate actual row height to fill width
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
                  style={{ position: "relative", width: `${photoWidth}px`, height: `${rowHeight}px`, flexShrink: 0, overflow: "hidden", cursor: "zoom-in", background: "#f0f0f0" }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => onPhotoClick(idx)}
                >
                  {photo.previewUrl && (
                    <img
                      src={photo.previewUrl}
                      alt={photo.filename || ""}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease", transform: isHovered ? "scale(1.03)" : "scale(1)" }}
                    />
                  )}

                  {/* Hover overlay */}
                  {!isMobile && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)",
                      opacity: isHovered ? 1 : 0, transition: "opacity 0.3s ease",
                      pointerEvents: "none",
                    }} />
                  )}

                  {/* Download icon */}
                  {allowDownload && (
                    <button
                      onClick={e => { e.stopPropagation(); onDownload(photo) }}
                      style={{
                        position: "absolute", bottom: "8px", right: "8px",
                        background: "rgba(255,255,255,0.9)", border: "none",
                        width: "32px", height: "32px", borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", opacity: isMobile ? 0.85 : (isHovered ? 1 : 0),
                        transition: "opacity 0.2s", fontSize: "14px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                      title="Download"
                    >
                      ↓
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default function ClientGallery({ gallery }: { gallery: Gallery }) {
  const [entered, setEntered] = useState("")
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadingAll, setDownloadingAll] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handler = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null)
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox])

  const photos = gallery.photos || []
  const prev = useCallback(() => setLightbox(i => i !== null ? (i - 1 + photos.length) % photos.length : 0), [photos.length])
  const next = useCallback(() => setLightbox(i => i !== null ? (i + 1) % photos.length : 0), [photos.length])

  const handleAuth = () => {
    if (entered === gallery.password) { setAuthed(true); setError(false) }
    else setError(true)
  }

  const handleDownload = async (photo: Photo) => {
    const key = photo.key
    const filename = photo.filename || `photo.jpg`

    if (isMobile && photo.previewUrl) {
      // On mobile — open image directly so user can long-press to save to Photos
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

  // Touch swipe handlers for lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) next()
      else prev()
    }
    touchStartX.current = null
  }

  if (!authed) {
    return (
      <div style={{ paddingTop: "var(--nav-height)", minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem" }}>
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
    <div style={{ paddingTop: "var(--nav-height)", background: "#fff", minHeight: "100vh" }}>

      {/* Lightbox */}
      {lightbox !== null && photos[lightbox]?.previewUrl && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setLightbox(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Prev */}
          {!isMobile && (
            <button onClick={e => { e.stopPropagation(); prev() }} style={{
              position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
              width: "48px", height: "48px", borderRadius: "50%", fontSize: "24px",
              cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center",
            }}>‹</button>
          )}

          <img
            src={photos[lightbox].previewUrl}
            alt={photos[lightbox].filename || ""}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "92vw", maxHeight: "88vh", objectFit: "contain", display: "block", userSelect: "none" }}
          />

          {/* Next */}
          {!isMobile && (
            <button onClick={e => { e.stopPropagation(); next() }} style={{
              position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
              width: "48px", height: "48px", borderRadius: "50%", fontSize: "24px",
              cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center",
            }}>›</button>
          )}

          {/* Close */}
          <button onClick={() => setLightbox(null)} style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
            width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", fontSize: "20px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>

          {/* Counter */}
          <p style={{
            position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px",
            letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)", margin: 0,
          }}>{lightbox + 1} / {photos.length}</p>

          {/* Download from lightbox */}
          {gallery.allowDownload && (
            <button
              onClick={e => { e.stopPropagation(); handleDownload(photos[lightbox]) }}
              style={{
                position: "absolute", bottom: "1.2rem", right: "1.5rem",
                background: "rgba(255,255,255,0.15)", color: "#fff", border: "0.5px solid rgba(255,255,255,0.3)",
                cursor: "pointer", padding: "10px 18px",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: "2px",
              }}
            >
              {isMobile ? "Save to Photos" : (downloading === photos[lightbox].key ? "..." : "↓ Download")}
            </button>
          )}

          {/* Mobile swipe hint */}
          {isMobile && (
            <p style={{
              position: "absolute", bottom: "1.5rem", left: "1.5rem",
              fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px",
              color: "rgba(255,255,255,0.3)", margin: 0, letterSpacing: "0.1em",
            }}>← swipe →</p>
          )}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "4rem 2.5rem 2rem", borderBottom: "0.5px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 0.75rem" }}>Private Gallery</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 300, color: "#111", margin: "0 0 0.25rem" }}>{gallery.shootName}</h1>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "18px", color: "#9a9189", margin: "0 0 0.5rem" }}>{gallery.clientName}</p>
          {gallery.message && <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "17px", color: "#3a3530", maxWidth: "600px", lineHeight: 1.7, margin: "0 0 0.5rem" }}>{gallery.message}</p>}
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: 0 }}>
            {photos.length} photos{isMobile ? " — tap to view · long-press to save" : " — hover to download · click to view"}
          </p>
        </div>

        {gallery.allowDownload && photos.length > 0 && !isMobile && (
          <button
            onClick={handleDownloadAll}
            disabled={downloadingAll}
            style={{
              padding: "14px 28px",
              background: downloadingAll ? "#e0e0e0" : "#a07850",
              color: downloadingAll ? "#9a9189" : "#fff",
              border: "none", cursor: downloadingAll ? "wait" : "pointer",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase",
              borderRadius: "2px", whiteSpace: "nowrap",
            }}
          >
            {downloadingAll ? "Preparing ZIP..." : `↓ Download All (${photos.length} photos)`}
          </button>
        )}
      </div>

      {/* Gallery */}
      <div style={{ padding: "2rem 2.5rem 4rem" }}>
        {!photos.length ? (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "20px", color: "#9a9189", textAlign: "center", padding: "4rem 0" }}>Photos coming soon.</p>
        ) : (
          <JustifiedGrid
            photos={photos}
            onPhotoClick={setLightbox}
            onDownload={handleDownload}
            allowDownload={gallery.allowDownload}
            isMobile={isMobile}
          />
        )}
      </div>

      {printPhoto && <ClientPrintModal photo={printPhoto} shootName={gallery.shootName} onClose={() => setPrintPhoto(null)} />}

      <footer style={{ padding: "2rem 2.5rem", borderTop: "0.5px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "#9a9189", margin: 0 }}>Sina <em>Sharifi</em></p>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#dedad4" }}>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
