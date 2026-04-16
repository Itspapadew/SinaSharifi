"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Photo = {
  id: string;
  title: string;
  location: string;
  category: string;
  slug: string;
  src: string;
  availableAsPrint: boolean;
  price?: number;
};

export default function PortfolioGrid({ photos }: { photos: Photo[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div style={{ paddingTop: "calc(var(--nav-height) + 4rem)", textAlign: "center", padding: "8rem 2rem" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "24px", color: "#9a9189" }}>
          No stories yet. Add some in the <Link href="/studio" style={{ color: "#a07850" }}>studio</Link>.
        </p>
      </div>
    );
  }

  const layouts = [
    "66%", "100%", "75%",
    "66%", "50%", "80%",
    "75%", "66%", "66%",
    "100%", "66%", "75%",
  ];

  const rows: { pattern: number[]; items: Photo[] }[] = [];
  let i = 0;
  while (i < photos.length) {
    const patternIndex = rows.length % 3;
    const pattern = patternIndex === 0 ? [2, 1] : patternIndex === 1 ? [1, 2] : [1, 1];
    const slice = photos.slice(i, i + pattern.length);
    if (slice.length > 0) rows.push({ pattern, items: slice });
    i += pattern.length;
  }

  let globalIndex = 0;

  return (
    <>
      <div style={{ height: "var(--nav-height)" }} />

      <div style={{ padding: "3.5rem 2.5rem 2rem", maxWidth: "640px" }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 300,
          color: "#1a1814",
          lineHeight: 1.15,
          margin: 0,
          letterSpacing: "0.01em",
        }}>
          Photographs from the edges<br />
          <em style={{ color: "#a07850" }}>of the known world.</em>
        </h1>
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "13px",
          color: "#9a9189",
          fontWeight: 300,
          marginTop: "1rem",
          lineHeight: 1.8,
          letterSpacing: "0.02em",
          maxWidth: "420px",
        }}>
          Wildlife, landscape, and macro photography by a nomadic eye.
        </p>
      </div>

      <section style={{ padding: "0.5rem 2.5rem 4rem", maxWidth: "1400px", margin: "0 auto" }}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "grid",
              gridTemplateColumns: row.pattern.map(p => `${p}fr`).join(" "),
              gap: "4px",
              marginBottom: "4px",
            }}
          >
            {row.items.map((photo) => {
              const pb = layouts[globalIndex % layouts.length];
              globalIndex++;
              return (
                <Link
                  key={photo.id}
                  href={`/stories/${photo.slug}`}
                  style={{ textDecoration: "none", display: "block" }}
                  onMouseEnter={() => setHovered(photo.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div style={{
                    position: "relative",
                    paddingBottom: pb,
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "#e8e4de",
                  }}>
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      style={{
                        objectFit: "cover",
                        transition: "transform 0.7s ease",
                        transform: hovered === photo.id ? "scale(1.04)" : "scale(1)",
                      }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)",
                      opacity: hovered === photo.id ? 1 : 0,
                      transition: "opacity 0.35s ease",
                    }} />
                    <div style={{
                      position: "absolute", bottom: "1.25rem", left: "1.5rem",
                      opacity: hovered === photo.id ? 1 : 0,
                      transition: "opacity 0.35s ease",
                      transform: hovered === photo.id ? "translateY(0)" : "translateY(6px)",
                    }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", color: "#f0ece4", margin: 0 }}>{photo.title}</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "12px", color: "rgba(240,236,228,0.75)", margin: "2px 0 0" }}>{photo.location}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}

        <div style={{
          marginTop: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
          borderTop: "0.5px solid var(--charcoal)",
          paddingTop: "2.5rem",
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(18px, 2.5vw, 26px)",
            fontWeight: 300,
            color: "#1a1814",
            margin: 0,
            maxWidth: "520px",
            lineHeight: 1.3,
          }}>
            These photographs are available as limited edition fine art prints.
          </p>
          <Link href="/prints" style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#1a1814",
            border: "0.5px solid #1a1814",
            padding: "14px 32px",
            borderRadius: "2px",
            textDecoration: "none",
            whiteSpace: "nowrap",
            fontWeight: 300,
          }}>
            Shop Prints
          </Link>
        </div>
      </section>

      <footer style={{
        padding: "2rem 2.5rem",
        borderTop: "0.5px solid var(--charcoal)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "#9a9189", margin: 0 }}>
          Sina <em>Sharifi</em>
        </p>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link href="/portfolio" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", textDecoration: "none" }}>Portfolio</Link>
          <Link href="/prints" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", textDecoration: "none" }}>Prints</Link>
          <Link href="/about" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", textDecoration: "none" }}>About</Link>
          <a href="mailto:hello@sinasharifi.com" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", textDecoration: "none" }}>Contact</a>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#dedad4" }}>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </>
  );
}
