"use client";
import { useState } from "react";
import Image from "next/image";

type GalleryImage = {
  src: string;
  caption?: string;
};

export default function StoryGallery({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const prev = () => setLightboxIndex(i => (i !== null ? (i - 1 + images.length) % images.length : 0));
  const next = () => setLightboxIndex(i => (i !== null ? (i + 1) % images.length : 0));

  return (
    <>
      {/* Desktop grid */}
      <div className="desktop-gallery" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "4px",
      }}>
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setLightboxIndex(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "relative",
              paddingBottom: "75%",
              overflow: "hidden",
              cursor: "zoom-in",
              background: "#e8e4de",
            }}
          >
            <Image
              src={img.src}
              alt={img.caption || `Photo ${i + 1}`}
              fill
              style={{
                objectFit: "cover",
                transition: "transform 0.6s ease",
                transform: hovered === i ? "scale(1.04)" : "scale(1)",
              }}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {img.caption && (
              <div style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                padding: "1rem 1.25rem",
                background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                opacity: hovered === i ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "14px",
                  color: "rgba(240,236,228,0.9)",
                  margin: 0,
                }}>
                  {img.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="mobile-gallery" style={{ display: "none" }}>
        <div style={{
          display: "flex",
          overflowX: "auto",
          gap: "4px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}>
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setLightboxIndex(i)}
              style={{
                flexShrink: 0,
                width: "85vw",
                height: "65vw",
                position: "relative",
                scrollSnapAlign: "start",
                cursor: "zoom-in",
                background: "#e8e4de",
              }}
            >
              <Image
                src={img.src}
                alt={img.caption || `Photo ${i + 1}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="85vw"
              />
            </div>
          ))}
        </div>
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#9a9189",
          textAlign: "center",
          marginTop: "0.75rem",
        }}>
          Swipe to browse · {images.length} photos
        </p>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(10,10,8,0.97)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "2rem",
              background: "none",
              border: "none",
              color: "#f0ece4",
              fontSize: "28px",
              cursor: "pointer",
              opacity: 0.6,
              fontFamily: "system-ui",
              padding: "8px",
            }}
          >×</button>

          {/* Counter */}
          <p style={{
            position: "absolute",
            top: "1.75rem",
            left: "2rem",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.14em",
            color: "#6b6256",
            margin: 0,
          }}>
            {lightboxIndex + 1} / {images.length}
          </p>

          {/* Image */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "1100px",
              maxHeight: "80vh",
            }}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].caption || ""}
              width={1800}
              height={1200}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
                display: "block",
              }}
              priority
            />
          </div>

          {/* Caption */}
          {images[lightboxIndex].caption && (
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "15px",
              color: "#9a8f7e",
              marginTop: "1rem",
              textAlign: "center",
            }}>
              {images[lightboxIndex].caption}
            </p>
          )}

          {/* Prev / Next */}
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            style={{
              position: "absolute",
              left: "1.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "0.5px solid rgba(240,236,228,0.2)",
              color: "#f0ece4",
              width: "44px",
              height: "44px",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "2px",
            }}
          >←</button>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            style={{
              position: "absolute",
              right: "1.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "0.5px solid rgba(240,236,228,0.2)",
              color: "#f0ece4",
              width: "44px",
              height: "44px",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "2px",
            }}
          >→</button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-gallery { display: none !important; }
          .mobile-gallery { display: block !important; }
        }
      `}</style>
    </>
  );
}
