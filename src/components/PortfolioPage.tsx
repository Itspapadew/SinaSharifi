"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";

type Photo = {
  id: string;
  title: string;
  location: string;
  category: string;
  src: string;
  availableAsPrint: boolean;
  price?: number;
};

const categories = [
  { slug: "all", label: "All" },
  { slug: "landscape", label: "Landscape" },
  { slug: "wildlife", label: "Wildlife" },
  { slug: "portrait", label: "Portrait" },
  { slug: "macro", label: "Macro" },
  { slug: "family", label: "Family Portrait" },
];

export default function PortfolioPage({ photos }: { photos: Photo[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const active = searchParams.get("category") || "all";

  const setActive = (slug: string) => {
    if (slug === "all") router.push("/portfolio");
    else router.push(`/portfolio?category=${slug}`);
  };

  const filtered = active === "all"
    ? photos
    : photos.filter(p => p.category === active);

  const prev = () => setLightboxIndex(i => i !== null ? (i - 1 + filtered.length) % filtered.length : 0);
  const next = () => setLightboxIndex(i => i !== null ? (i + 1) % filtered.length : 0);

  if (!photos || photos.length === 0) {
    return (
      <div style={{ paddingTop: "calc(var(--nav-height) + 4rem)", textAlign: "center", padding: "8rem 2rem" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "24px", color: "#9a9189" }}>
          No photos yet. Add some in the <a href="/studio" style={{ color: "#a07850" }}>studio</a>.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{ height: "var(--nav-height)" }} />

      <div style={{ padding: "3.5rem 2.5rem 2rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#1a1814", lineHeight: 1.15, margin: "0 0 0.5rem" }}>
          Portfolio
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "18px", color: "#9a9189", margin: 0 }}>
          {filtered.length} {filtered.length === 1 ? "photograph" : "photographs"}
        </p>
      </div>

      <div style={{ padding: "0 2.5rem 2rem", display: "flex", gap: "0.25rem", flexWrap: "wrap", borderBottom: "0.5px solid var(--charcoal)" }}>
        {categories.map(cat => (
          <button key={cat.slug} onClick={() => setActive(cat.slug)} style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em",
            textTransform: "uppercase", padding: "8px 16px", border: "0.5px solid",
            borderColor: active === cat.slug ? "#a07850" : "var(--charcoal)",
            color: active === cat.slug ? "#a07850" : "#9a9189",
            background: active === cat.slug ? "rgba(160,120,80,0.06)" : "transparent",
            borderRadius: "2px", cursor: "pointer", transition: "all 0.2s", fontWeight: 300,
          }}>
            {cat.label}
          </button>
        ))}
      </div>

      <section style={{ padding: "2rem 2.5rem 4rem", maxWidth: "1400px", margin: "0 auto" }}>
        {filtered.length === 0 ? (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "20px", color: "#9a9189", textAlign: "center", padding: "4rem 0" }}>
            No photos in this category yet.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 45vw), 1fr))", gap: "3px" }}>
            {filtered.map((photo, index) => (
              <div key={photo.id} onClick={() => setLightboxIndex(index)}
                onMouseEnter={() => setHovered(photo.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ position: "relative", paddingBottom: "100%", overflow: "hidden", cursor: "zoom-in", background: "#e8e4de" }}>
                <Image src={photo.src} alt={photo.title} fill
                  style={{ objectFit: "cover", transition: "transform 0.6s ease", transform: hovered === photo.id ? "scale(1.04)" : "scale(1)" }}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)", opacity: hovered === photo.id ? 1 : 0, transition: "opacity 0.3s ease" }} />
                <div style={{ position: "absolute", bottom: "1rem", left: "1.25rem", opacity: hovered === photo.id ? 1 : 0, transition: "opacity 0.3s ease", transform: hovered === photo.id ? "translateY(0)" : "translateY(6px)" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px", color: "#f0ece4", margin: 0 }}>{photo.title}</p>
                  {photo.location && <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "12px", color: "rgba(240,236,228,0.75)", margin: "2px 0 0" }}>{photo.location}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer style={{ padding: "2rem 2.5rem", borderTop: "0.5px solid var(--charcoal)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "#9a9189", margin: 0 }}>Sina <em>Sharifi</em></p>
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#dedad4" }}>© {new Date().getFullYear()}</span>
      </footer>

      {lightboxIndex !== null && (
        <Lightbox src={filtered[lightboxIndex].src} title={filtered[lightboxIndex].title}
          location={filtered[lightboxIndex].location} onClose={() => setLightboxIndex(null)}
          onPrev={prev} onNext={next} current={lightboxIndex} total={filtered.length} />
      )}
    </>
  );
}
