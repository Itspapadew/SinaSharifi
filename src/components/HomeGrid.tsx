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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "28px", fontWeight: 300, color: "#9a9189", textAlign: "center" }}>
            The world, witnessed.
          </p>
          <a href="/studio" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#a07850", textDecoration: "none" }}>
            Add your first photo →
          </a>
        </div>
      </>
    );
  }

  // Group photos into blocks of 5 for the asymmetric pattern
  const blocks: Photo[][] = [];
  for (let i = 0; i < photos.length; i += 5) {
    blocks.push(photos.slice(i, i + 5));
  }

  const Cell = ({ photo, index, style }: { photo: Photo; index: number; style: React.CSSProperties }) => (
    <div
      onClick={() => setLightboxIndex(index)}
      onMouseEnter={() => setHovered(photo.id)}
      onMouseLeave={() => setHovered(null)}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "zoom-in",
        background: "#e8e4de",
        ...style,
      }}
    >
      <Image
        src={photo.src}
        alt={photo.title}
        fill
        style={{
          objectFit: "cover",
          transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transform: hovered === photo.id ? "scale(1.05)" : "scale(1)",
        }}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
        opacity: hovered === photo.id ? 1 : 0,
        transition: "opacity 0.35s ease",
      }} />
      <div style={{
        position: "absolute",
        bottom: "1.25rem",
        left: "1.25rem",
        opacity: hovered === photo.id ? 1 : 0,
        transition: "opacity 0.35s ease, transform 0.35s ease",
        transform: hovered === photo.id ? "translateY(0)" : "translateY(8px)",
      }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", fontWeight: 300, color: "#f0ece4", margin: 0 }}>
          {photo.title}
        </p>
        {photo.location && (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "12px", color: "rgba(240,236,228,0.7)", margin: "3px 0 0" }}>
            {photo.location}
          </p>
        )}
        {photo.availableAsPrint && (
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#a07850", margin: "8px 0 0" }}>
            Available as print
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div style={{ height: "var(--nav-height)" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "3px", padding: "3px" }}>
        {blocks.map((block, blockIndex) => {
          const isEven = blockIndex % 2 === 0;
          const filled = [...block];
          while (filled.length < 5) filled.push(filled[filled.length - 1]);

          const globalIndex = (i: number) => blockIndex * 5 + i;

          if (isEven) {
            // Layout A: big left, 2x2 right
            return (
              <div key={blockIndex} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gridTemplateRows: "340px 260px", gap: "3px" }}>
                <Cell photo={filled[0]} index={globalIndex(0)} style={{ gridRow: "span 2" }} />
                <Cell photo={filled[1]} index={globalIndex(1)} style={{}} />
                <Cell photo={filled[2]} index={globalIndex(2)} style={{}} />
                <Cell photo={filled[3]} index={globalIndex(3)} style={{}} />
                <Cell photo={filled[4]} index={globalIndex(4)} style={{}} />
              </div>
            );
          } else {
            // Layout B: 2x2 left, big right — mirrored
            return (
              <div key={blockIndex} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.6fr", gridTemplateRows: "260px 340px", gap: "3px" }}>
                <Cell photo={filled[0]} index={globalIndex(0)} style={{}} />
                <Cell photo={filled[1]} index={globalIndex(1)} style={{}} />
                <Cell photo={filled[2]} index={globalIndex(2)} style={{ gridRow: "span 2" }} />
                <Cell photo={filled[3]} index={globalIndex(3)} style={{}} />
                <Cell photo={filled[4]} index={globalIndex(4)} style={{}} />
              </div>
            );
          }
        })}
      </div>

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
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "#9a9189", margin: 0 }}>
          Sina <em>Sharifi</em>
        </p>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link href="/portfolio" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", textDecoration: "none" }}>Portfolio</Link>
          <Link href="/prints" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", textDecoration: "none" }}>Prints</Link>
          <Link href="/about" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", textDecoration: "none" }}>About</Link>
          <a href="mailto:hello@sharifisina.com" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", textDecoration: "none" }}>Contact</a>
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
