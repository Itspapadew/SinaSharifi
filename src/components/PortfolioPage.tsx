"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const [active, setActive] = useState("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const filtered = active === "all"
    ? photos
    : photos.filter(p => p.category === active);

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

      {/* Header */}
      <div style={{ padding: "3.5rem 2.5rem 2rem" }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 300,
          color: "#1a1814",
          lineHeight: 1.15,
          margin: "0 0 0.5rem",
        }}>
          Portfolio
        </h1>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontSize: "18px",
          color: "#9a9189",
          margin: 0,
        }}>
          {photos.length} photographs
        </p>
      </div>

      {/* Category filter */}
      <div style={{
        padding: "0 2.5rem 2rem",
        display: "flex",
        gap: "0.25rem",
        flexWrap: "wrap",
        borderBottom: "0.5px solid var(--charcoal)",
      }}>
        {categories.map(cat => (
          <button
            key={cat.slug}
            onClick={() => setActive(cat.slug)}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "8px 16px",
              border: "0.5px solid",
              borderColor: active === cat.slug ? "#a07850" : "var(--charcoal)",
              color: active === cat.slug ? "#a07850" : "#9a9189",
              background: active === cat.slug ? "rgba(160,120,80,0.06)" : "transparent",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "all 0.2s",
              fontWeight: 300,
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <section style={{ padding: "2rem 2.5rem 4rem", maxWidth: "1400px", margin: "0 auto" }}>
        {filtered.length === 0 ? (
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: "20px",
            color: "#9a9189",
            textAlign: "center",
            padding: "4rem 0",
          }}>
            No photos in this category yet.
          </p>
        ) : (
          <div style={{
            columns: "3 300px",
            gap: "4px",
          }}>
            {filtered.map(photo => (
              <div
                key={photo.id}
                onClick={() => setLightbox(photo)}
                onMouseEnter={() => setHovered(photo.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "relative",
                  breakInside: "avoid",
                  marginBottom: "4px",
                  overflow: "hidden",
                  cursor: "zoom-in",
                  background: "#e8e4de",
                  display: "block",
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.title}
                  width={800}
                  height={600}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    transition: "transform 0.6s ease",
                    transform: hovered === photo.id ? "scale(1.03)" : "scale(1)",
                  }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)",
                  opacity: hovered === photo.id ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }} />
                <div style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "1.25rem",
                  opacity: hovered === photo.id ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "16px",
                    color: "#f0ece4",
                    margin: 0,
                  }}>
                    {photo.title}
                  </p>
                  {photo.location && (
                    <p style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "12px",
                      color: "rgba(240,236,228,0.75)",
                      margin: "2px 0 0",
                    }}>
                      {photo.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        padding: "2rem 2.5rem",
        borderTop: "0.5px solid var(--charcoal)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "15px",
          color: "#9a9189",
          margin: 0,
        }}>
          Sina <em>Sharifi</em>
        </p>
        <span style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#dedad4",
        }}>
          © {new Date().getFullYear()}
        </span>
      </footer>

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          title={lightbox.title}
          location={lightbox.location}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
