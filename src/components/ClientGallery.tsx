"use client";
import { useState } from "react";
import Image from "next/image";

type Photo = { key: string; caption?: string }
type Gallery = {
  clientName: string;
  slug: string;
  password: string;
  shootDate?: string;
  message?: string;
  photos: Photo[];
}

export default function ClientGallery({ gallery }: { gallery: Gallery }) {
  const [entered, setEntered] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleAuth = () => {
    if (entered === gallery.password) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
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

  if (!authed) {
    return (
      <div style={{ paddingTop: "var(--nav-height)", minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem" }}>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 1rem" }}>
            Private Gallery
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "36px", fontWeight: 300, color: "#111", margin: "0 0 0.5rem" }}>
            {gallery.clientName}
          </h1>
          {gallery.shootDate && (
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "16px", color: "#9a9189", margin: "0 0 2.5rem" }}>
              {gallery.shootDate}
            </p>
          )}
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
          }}>
            View Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "var(--nav-height)", background: "#fff", minHeight: "100vh" }}>
      <div style={{ padding: "4rem 2.5rem 2rem", borderBottom: "0.5px solid #e0e0e0" }}>
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 0.75rem" }}>
          Private Gallery
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 300, color: "#111", margin: "0 0 0.5rem" }}>
          {gallery.clientName}
        </h1>
        {gallery.shootDate && (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "18px", color: "#9a9189", margin: "0 0 1rem" }}>
            {gallery.shootDate}
          </p>
        )}
        {gallery.message && (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", color: "#3a3530", maxWidth: "600px", lineHeight: 1.7, margin: 0 }}>
            {gallery.message}
          </p>
        )}
      </div>

      <div style={{ padding: "2rem 2.5rem 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 45vw), 1fr))", gap: "3px" }}>
          {gallery.photos.map((photo, i) => {
            const filename = `${gallery.clientName.replace(/\s+/g, "-")}-${i + 1}.jpg`;
            return (
              <div key={photo.key} style={{ position: "relative", group: true } as any}>
                <div style={{ position: "relative", paddingBottom: "100%", overflow: "hidden", background: "#f5f5f5" }}>
                  <Image src={photo.key} alt={photo.caption || `Photo ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 50vw, 33vw" />
                </div>
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
                >
                  {downloading === photo.key ? "Downloading..." : "Download"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <footer style={{ padding: "2rem 2.5rem", borderTop: "0.5px solid #e0e0e0", display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "#9a9189", margin: 0 }}>Sina <em>Sharifi</em></p>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#dedad4" }}>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
