"use client";
import { useState } from "react";

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

export default function ClientGallery({ gallery }: { gallery: Gallery }) {
  const [entered, setEntered] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const handleAuth = () => {
    if (entered === gallery.password) { setAuthed(true); setError(false); }
    else setError(true);
  };

  const handleDownload = async (key: string, filename: string) => {
    setDownloading(key);
    try {
      const res = await fetch("/api/client-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const { url } = await res.json();
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    try {
      const keys = photos.map(p => p.key);
      const res = await fetch("/api/client-download-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys, shootName: gallery.shootName }),
      });
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${gallery.shootName.replace(/\s+/g, "-")}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloadingAll(false);
    }
  };

  const photos = gallery.photos || [];
  const prev = () => setLightbox(i => i !== null ? (i - 1 + photos.length) % photos.length : 0);
  const next = () => setLightbox(i => i !== null ? (i + 1) % photos.length : 0);

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
    );
  }

  return (
    <div style={{ paddingTop: "var(--nav-height)", background: "#fff", minHeight: "100vh" }}>

      {/* Lightbox */}
      {lightbox !== null && photos[lightbox]?.previewUrl && (
        <div onClick={() => setLightbox(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <button onClick={e => { e.stopPropagation(); prev(); }} style={{
            position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", color: "#fff", fontSize: "40px", cursor: "pointer", opacity: 0.7,
          }}>‹</button>

          <img
            src={photos[lightbox].previewUrl}
            alt={photos[lightbox].filename || ""}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", display: "block" }}
          />

          <button onClick={e => { e.stopPropagation(); next(); }} style={{
            position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", color: "#fff", fontSize: "40px", cursor: "pointer", opacity: 0.7,
          }}>›</button>

          <button onClick={() => setLightbox(null)} style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
            width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", fontSize: "18px",
          }}>×</button>

          <p style={{
            position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px",
            letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)",
          }}>{lightbox + 1} / {photos.length}</p>

          {gallery.allowDownload && (
            <button
              onClick={e => { e.stopPropagation(); handleDownload(photos[lightbox].key, photos[lightbox].filename || `photo-${lightbox + 1}.jpg`) }}
              style={{
                position: "absolute", bottom: "1.5rem", right: "1.5rem",
                background: "#fff", color: "#111", border: "none", cursor: "pointer",
                padding: "10px 20px", fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: "2px",
              }}
            >{downloading === photos[lightbox].key ? "..." : "↓ Download"}</button>
          )}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "4rem 2.5rem 2rem", borderBottom: "0.5px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 0.75rem" }}>Private Gallery</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 300, color: "#111", margin: "0 0 0.25rem" }}>{gallery.shootName}</h1>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "18px", color: "#9a9189", margin: "0 0 0.5rem" }}>{gallery.clientName}</p>
          {gallery.message && <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", color: "#3a3530", maxWidth: "600px", lineHeight: 1.7, margin: "0 0 0.5rem" }}>{gallery.message}</p>}
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: 0 }}>{photos.length} photos — click any photo to view full size</p>
        </div>

        {gallery.allowDownload && photos.length > 0 && (
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

      {/* Grid */}
      <div style={{ padding: "2rem 2.5rem 4rem" }}>
        {!photos.length ? (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "20px", color: "#9a9189", textAlign: "center", padding: "4rem 0" }}>Photos coming soon.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 45vw), 1fr))", gap: "3px" }}>
            {photos.map((photo, i) => {
              const filename = photo.filename || `photo-${i + 1}.jpg`;
              return (
                <div key={photo.key || i}>
                  <div onClick={() => setLightbox(i)} style={{ position: "relative", paddingBottom: "100%", overflow: "hidden", background: "#f5f5f5", cursor: "zoom-in" }}>
                    {photo.previewUrl && (
                      <img src={photo.previewUrl} alt={filename} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                  {gallery.allowDownload && (
                    <button
                      onClick={() => handleDownload(photo.key, filename)}
                      disabled={downloading === photo.key}
                      style={{
                        width: "100%", padding: "10px", marginTop: "2px",
                        background: downloading === photo.key ? "#e0e0e0" : "#111",
                        color: downloading === photo.key ? "#9a9189" : "#fff",
                        border: "none", cursor: "pointer",
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase",
                      }}
                    >{downloading === photo.key ? "Downloading..." : "↓ Download"}</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer style={{ padding: "2rem 2.5rem", borderTop: "0.5px solid #e0e0e0", display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "#9a9189", margin: 0 }}>Sina <em>Sharifi</em></p>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#dedad4" }}>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
