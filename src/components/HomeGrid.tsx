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

export default function HomeGrid({ photos }: { photos: Photo[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const prev = () => setLightboxIndex(i => i !== null ? (i - 1 + photos.length) % photos.length : 0);
  const next = () => setLightboxIndex(i => i !== null ? (i + 1) % photos.length : 0);

  if (!photos || photos.length === 0) {
    return (
      <>
        <div style={{ height: "var(--nav-height)" }} />
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: "1rem",
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "28px",
            fontWeight: 300,
            color: "#9a9189",
            textAlign: "center",
          }}>
            The world, witnessed.
          </p>
          <a href="/studio" style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#a07850",
            textDecoration: "none",
          }}>
            Add your first photo →
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ height: "var(--nav-height)" }} />

      {/* Masonry waterfall */}
      <div style={{
        columns: "2 300px",
        gap: "3px",
        padding: "3px",
      }}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => setLightboxIndex(index)}
            onMouseEnter={() => setHovered(photo.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "relative",
              breakInside: "avoid",
              marginBottom: "3px",
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
                transform: hovered === photo.id ? "scale(1.04)" : "scale(1)",
              }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
              opacity: hovered === photo.id ? 1 : 0,
              transition: "opacity 0.3s ease",
            }} />
            <div style={{
              position: "absolute",
              bottom: "1rem",
              left: "1.25rem",
              opacity: hovered === photo.id ? 1 : 0,
              transition: "opacity 0.3s ease",
              transform: hovered === photo.id ? "translateY(0)" : "translateY(6px)",
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "17px",
                fontWeight: 300,
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
              {photo.availableAsPrint && (
                <p style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#a07850",
                  margin: "8px 0 0",
                }}>
                  Available as print
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{
        padding: "2rem 2.5rem",
        borderTop: "0.5px solid var(--charcoal)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        marginTop: "3px",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "15px",
          color: "#9a9189",
          margin: 0,
        }}>
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

      {lightboxIndex !== null && (
        <Lightbox
          src={photos[lightboxIndex].src}
          title={photos[lightboxIndex].title}
          location={photos[lightboxIndex].location}
          onClose={() => setLightboxIndex(null)}
          onPrev={prev}
          onNext={next}
          current={lightboxIndex}
          total={photos.length}
        />
      )}
    </>
  );
}
