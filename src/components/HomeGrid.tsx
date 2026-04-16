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
  const [lightbox, setLightbox] = useState<Photo | null>(null);

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

      {/* Tight uniform grid — Malika style */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "2px",
        padding: "2px",
      }}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setLightbox(photo)}
            onMouseEnter={() => setHovered(photo.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "relative",
              paddingBottom: "100%",
              overflow: "hidden",
              cursor: "zoom-in",
              background: "#e8e4de",
            }}
          >
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              style={{
                objectFit: "cover",
                transition: "transform 0.6s ease",
                transform: hovered === photo.id ? "scale(1.05)" : "scale(1)",
              }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Hover overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10,10,8,0.5)",
              opacity: hovered === photo.id ? 1 : 0,
              transition: "opacity 0.3s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "18px",
                fontWeight: 300,
                color: "#f0ece4",
                margin: 0,
                letterSpacing: "0.02em",
              }}>
                {photo.title}
              </p>
              {photo.location && (
                <p style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "13px",
                  color: "rgba(240,236,228,0.7)",
                  margin: "4px 0 0",
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
                  margin: "12px 0 0",
                }}>
                  Available as print
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Minimal footer */}
      <footer style={{
        padding: "2rem 2.5rem",
        borderTop: "0.5px solid var(--charcoal)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        marginTop: "2px",
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
          <Link href="/portfolio" style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#9a9189",
            textDecoration: "none",
          }}>Portfolio</Link>
          <Link href="/prints" style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#9a9189",
            textDecoration: "none",
          }}>Prints</Link>
          <Link href="/about" style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#9a9189",
            textDecoration: "none",
          }}>About</Link>
          <a href="mailto:hello@sinasharifi.com" style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#9a9189",
            textDecoration: "none",
          }}>Contact</a>
          <span style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#dedad4",
          }}>
            © {new Date().getFullYear()}
          </span>
        </div>
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
