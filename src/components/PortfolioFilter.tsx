"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Photo = {
  id: string;
  title: string;
  category: string;
  slug: string;
  src: string;
  availableAsPrint: boolean;
  price?: number;
};

type Category = { value: string; label: string };

export default function PortfolioFilter({
  photos,
  categories,
}: {
  photos: Photo[];
  categories: Category[];
}) {
  const [active, setActive] = useState("all");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered =
    active === "all" ? photos : photos.filter((p) => p.category === active);

  return (
    <section style={{ padding: "0 2.5rem 4rem" }}>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActive(cat.value)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "8px 16px",
              border: "0.5px solid",
              borderColor: active === cat.value ? "var(--driftwood)" : "var(--charcoal)",
              color: active === cat.value ? "var(--driftwood)" : "var(--ash)",
              background: active === cat.value ? "rgba(160,120,80,0.06)" : "transparent",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: "4rem 0", textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "20px",
            color: "var(--ash)",
          }}>
            No photographs in this category yet.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "4px",
        }}>
          {filtered.map((photo) => (
            <Link
              key={photo.id}
              href={`/stories/${photo.slug}`}
              style={{ textDecoration: "none", display: "block" }}
              onMouseEnter={() => setHovered(photo.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{
                position: "relative",
                paddingBottom: "75%",
                overflow: "hidden",
                background: "var(--obsidian-3)",
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
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)",
                  opacity: hovered === photo.id ? 1 : 0,
                  transition: "opacity 0.35s ease",
                }} />
                <div style={{
                  position: "absolute",
                  bottom: "1.25rem",
                  left: "1.5rem",
                  opacity: hovered === photo.id ? 1 : 0,
                  transition: "opacity 0.35s ease, transform 0.35s ease",
                  transform: hovered === photo.id ? "translateY(0)" : "translateY(6px)",
                }}>
                  <p style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "18px",
                    color: "#f0ece4",
                    margin: 0,
                  }}>
                    {photo.title}
                  </p>
                  {photo.availableAsPrint && (
                    <p style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "9px",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--driftwood-light)",
                      margin: "4px 0 0",
                    }}>
                      Available as print
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
