"use client";
import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

type Print = {
  id: string;
  title: string;
  location: string;
  category: string;
  image: string;
  basePrice: number;
  edition: number;
};

const CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "landscape", label: "Landscape" },
  { slug: "wildlife", label: "Wildlife" },
  { slug: "portrait", label: "Portrait" },
  { slug: "macro", label: "Macro" },
  { slug: "family", label: "Family" },
];

const PORTRAIT_SIZES = [
  { label: '12x18"', sku: 'GLOBAL-FAP-12x18', price: 45, scale: 0.30 },
  { label: '16x24"', sku: 'GLOBAL-FAP-16x24', price: 75, scale: 0.40 },
  { label: '24x36"', sku: 'GLOBAL-FAP-24x36', price: 120, scale: 0.55 },
  { label: '30x45"', sku: 'GLOBAL-FAP-30x45', price: 160, scale: 0.68 },
];

const LANDSCAPE_SIZES = [
  { label: '18x12"', sku: 'GLOBAL-FAP-18x12', price: 45, scale: 0.38 },
  { label: '24x16"', sku: 'GLOBAL-FAP-24x16', price: 75, scale: 0.50 },
  { label: '36x24"', sku: 'GLOBAL-FAP-36x24', price: 120, scale: 0.65 },
  { label: '45x30"', sku: 'GLOBAL-FAP-45x30', price: 160, scale: 0.78 },
];

const PAPERS = [
  { id: 'matte', label: 'Enhanced Matte', desc: '200gsm archival · sharp detail · no glare', multiplier: 1 },
  { id: 'hahnemuhle', label: 'Hahnemuhle Fine Art', desc: '310gsm cotton rag · museum grade · 100+ year archival', multiplier: 1.4 },
];

function FramedPreview({ imageSrc, title, orientation, scale }: { imageSrc: string; title: string; orientation: 'portrait' | 'landscape'; scale: number }) {
  const frameW = orientation === 'landscape' ? scale * 100 : scale * 60;
  const frameH = orientation === 'landscape' ? scale * 60 : scale * 100;

  return (
    <div style={{
      width: "100%", height: "100%", minHeight: "420px",
      background: "#dedad4",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", flexDirection: "column",
    }}>
      {/* Wall */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: "18%",
        background: "#e8e2d8",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "25%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.07), transparent)",
        }} />
      </div>

      {/* Floor */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "18%",
        background: "#c4b89a",
        borderTop: "2px solid #b8a888",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "40%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)",
        }} />
      </div>

      {/* Person silhouette for scale reference */}
      <div style={{
        position: "absolute", bottom: "18%", right: "12%",
        width: "28px", height: "90px",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "2px",
        opacity: 0.25,
      }}>
        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#5a4a3a" }} />
        <div style={{ width: "20px", flex: 1, background: "#5a4a3a", borderRadius: "2px" }} />
        <div style={{ display: "flex", gap: "4px" }}>
          <div style={{ width: "8px", height: "24px", background: "#5a4a3a", borderRadius: "2px" }} />
          <div style={{ width: "8px", height: "24px", background: "#5a4a3a", borderRadius: "2px" }} />
        </div>
      </div>

      {/* Framed print — scales with size */}
      <div style={{
        position: "relative",
        zIndex: 2,
        marginBottom: "18%",
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}>
        <div style={{
          width: `${frameW}px`,
          height: `${frameH}px`,
          background: "#f0ece4",
          border: "1px solid rgba(0,0,0,0.1)",
          boxShadow: "3px 6px 24px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.12)",
          padding: "8px",
          position: "relative",
        }}>
          {/* Mat */}
          <div style={{ position: "absolute", inset: "8px", background: "#f7f5f1" }} />
          {/* Image */}
          <div style={{ position: "absolute", inset: "18px", overflow: "hidden" }}>
            <Image src={imageSrc} alt={title} fill style={{ objectFit: "cover" }} sizes="300px" />
          </div>
          {/* Frame highlight */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "rgba(255,255,255,0.5)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.08)" }} />
        </div>
        {/* Wall shadow */}
        <div style={{
          position: "absolute", bottom: "-12px", left: "10%", right: "10%", height: "12px",
          background: "rgba(0,0,0,0.12)", filter: "blur(6px)", borderRadius: "50%",
        }} />
      </div>

      {/* Size label */}
      <div style={{
        position: "absolute", bottom: "22%", left: "50%",
        transform: "translateX(-50%)",
      }}>
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif", fontSize: "9px",
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: "rgba(0,0,0,0.3)", margin: 0, whiteSpace: "nowrap",
        }}>
          {Math.round(frameW)} × {Math.round(frameH)} px preview
        </p>
      </div>
    </div>
  );
}

function PrintModal({ print, onClose }: { print: Print; onClose: () => void }) {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [paperId, setPaperId] = useState('matte');
  const [added, setAdded] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [slide, setSlide] = useState(0);
  const { addItem } = useCartStore();

  const sizes = orientation === 'portrait' ? PORTRAIT_SIZES : LANDSCAPE_SIZES;
  const paper = PAPERS.find(p => p.id === paperId)!;
  const size = sizes[sizeIndex];
  const price = Math.round(size.price * paper.multiplier);
  const sku = size.sku.replace('FAP', paperId === 'hahnemuhle' ? 'HAHP' : 'FAP');

  const handleAdd = () => {
    addItem({
      id: `${print.id}-${sku}`,
      photoId: print.id,
      title: print.title,
      imageUrl: print.image,
      size: size.label,
      paper: paper.label,
      sku,
      price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const arrowStyle: React.CSSProperties = {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    background: "rgba(247,245,241,0.9)", border: "0.5px solid rgba(0,0,0,0.1)",
    color: "#1a1814", width: "36px", height: "36px",
    borderRadius: "50%", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", zIndex: 10, transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        background: "rgba(10,10,8,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem", overflowY: "auto",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#f7f5f1", width: "100%", maxWidth: "920px",
          borderRadius: "4px", overflow: "hidden",
          display: "grid", gridTemplateColumns: "1fr 1fr",
        }}
      >
        {/* Left — slides */}
        <div style={{ position: "relative", minHeight: "460px", overflow: "hidden" }}>

          {/* Slide 0 — full photo */}
          <div style={{
            position: "absolute", inset: 0,
            background: "#1a1814",
            opacity: slide === 0 ? 1 : 0,
            transition: "opacity 0.4s ease",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Image
              src={print.image} alt={print.title}
              width={800} height={600}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onLoad={e => {
                const img = e.target as HTMLImageElement;
                setOrientation(img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait');
              }}
              sizes="450px" priority
            />
          </div>

          {/* Slide 1 — framed */}
          <div style={{
            position: "absolute", inset: 0,
            opacity: slide === 1 ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}>
            <FramedPreview
              imageSrc={print.image}
              title={print.title}
              orientation={orientation}
              scale={size.scale}
            />
          </div>

          {/* Left arrow */}
          {slide === 1 && (
            <button
              onClick={e => { e.stopPropagation(); setSlide(0); }}
              style={{ ...arrowStyle, left: "12px" }}
            >
              ←
            </button>
          )}

          {/* Right arrow */}
          {slide === 0 && (
            <button
              onClick={e => { e.stopPropagation(); setSlide(1); }}
              style={{ ...arrowStyle, right: "12px" }}
            >
              →
            </button>
          )}

          {/* Dots */}
          <div style={{
            position: "absolute", bottom: "1rem", left: "50%",
            transform: "translateX(-50%)",
            display: "flex", gap: "6px", zIndex: 5,
          }}>
            {[0, 1].map(i => (
              <button key={i} onClick={e => { e.stopPropagation(); setSlide(i); }} style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: slide === i ? "#f7f5f1" : "rgba(247,245,241,0.35)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.2s",
              }} />
            ))}
          </div>

          {/* Slide label */}
          <div style={{ position: "absolute", bottom: "1rem", right: "1rem", zIndex: 5 }}>
            <span style={{
              fontFamily: "'Inter', system-ui, sans-serif", fontSize: "9px",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(247,245,241,0.8)",
              background: "rgba(0,0,0,0.3)", padding: "3px 8px", borderRadius: "2px",
            }}>
              {slide === 0 ? "Photo" : "Framed preview"}
            </span>
          </div>

          {/* Close */}
          <button onClick={onClose} style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "rgba(0,0,0,0.5)", border: "none", color: "#fff",
            width: "32px", height: "32px", borderRadius: "50%",
            cursor: "pointer", fontSize: "18px", zIndex: 10,
          }}>×</button>
        </div>

        {/* Right — details */}
        <div style={{ padding: "2rem 1.75rem", overflowY: "auto", maxHeight: "600px" }}>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 0.5rem" }}>
            {print.category}{print.location && ` · ${print.location}`}
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 300, color: "#1a1814", lineHeight: 1.1, margin: "0 0 0.4rem" }}>
            {print.title}
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "13px", color: "#9a9189", margin: "0 0 1.5rem" }}>
            Limited edition of {print.edition} · Signed and numbered
          </p>

          <div style={{ width: "32px", height: "0.5px", background: "var(--charcoal)", margin: "0 0 1.5rem" }} />

          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 10px" }}>Size</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {sizes.map((s, i) => (
              <button key={s.label} onClick={() => setSizeIndex(i)} style={{
                fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px",
                padding: "7px 14px", border: "0.5px solid",
                borderColor: sizeIndex === i ? "#a07850" : "var(--charcoal)",
                color: sizeIndex === i ? "#a07850" : "#6b6256",
                background: sizeIndex === i ? "rgba(160,120,80,0.06)" : "transparent",
                borderRadius: "2px", cursor: "pointer", transition: "all 0.2s",
              }}>
                {s.label}
              </button>
            ))}
          </div>

          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 10px" }}>Paper</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "1.25rem" }}>
            {PAPERS.map(p => (
              <button key={p.id} onClick={() => setPaperId(p.id)} style={{
                padding: "10px 14px", border: "0.5px solid", textAlign: "left",
                borderColor: paperId === p.id ? "#a07850" : "var(--charcoal)",
                background: paperId === p.id ? "rgba(160,120,80,0.06)" : "transparent",
                borderRadius: "2px", cursor: "pointer", transition: "all 0.2s",
              }}>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: paperId === p.id ? "#a07850" : "#1a1814", margin: "0 0 3px" }}>{p.label}</p>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: 0 }}>{p.desc}</p>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "36px", color: "#a07850", fontWeight: 300, margin: 0 }}>
              ${price}
            </p>
            <button onClick={handleAdd} style={{
              flex: 1, padding: "13px",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#f7f5f1", background: added ? "#a07850" : "#1a1814",
              border: "none", borderRadius: "2px", cursor: "pointer", transition: "all 0.3s",
            }}>
              {added ? "Added to cart" : "Add to cart"}
            </button>
          </div>

          <div style={{ paddingTop: "1.25rem", borderTop: "0.5px solid var(--charcoal)" }}>
            {[
              ["Printing", "Giclee — museum quality"],
              ["Fulfillment", "Nearest print lab worldwide"],
              ["Certificate", "Signed and numbered, included"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "0.5px solid var(--charcoal)" }}>
                <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a9189" }}>{label}</span>
                <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#6b6256", textAlign: "right", maxWidth: "55%" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrintsClient({ prints }: { prints: Print[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<Print | null>(null);

  const filtered = activeCategory === "all" ? prints : prints.filter(p => p.category === activeCategory);

  if (!prints || prints.length === 0) {
    return (
      <div style={{ padding: "6rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "24px", color: "#9a9189" }}>
          No prints available yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: "1.5rem 2.5rem", display: "flex", gap: "0.25rem", flexWrap: "wrap", borderBottom: "0.5px solid var(--charcoal)", alignItems: "center" }}>
        {CATEGORIES.map(cat => (
          <button key={cat.slug} onClick={() => setActiveCategory(cat.slug)} style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px",
            letterSpacing: "0.16em", textTransform: "uppercase",
            padding: "7px 16px", border: "0.5px solid",
            borderColor: activeCategory === cat.slug ? "#a07850" : "var(--charcoal)",
            color: activeCategory === cat.slug ? "#a07850" : "#9a9189",
            background: activeCategory === cat.slug ? "rgba(160,120,80,0.06)" : "transparent",
            borderRadius: "2px", cursor: "pointer", transition: "all 0.2s", fontWeight: 300,
          }}>
            {cat.label}
          </button>
        ))}
        <p style={{ marginLeft: "auto", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "16px", color: "#9a9189" }}>
          {filtered.length} {filtered.length === 1 ? "print" : "prints"}
        </p>
      </div>

      <section style={{ padding: "2rem 2.5rem 4rem", maxWidth: "1400px", margin: "0 auto" }}>
        {filtered.length === 0 ? (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "20px", color: "#9a9189", textAlign: "center", padding: "4rem 0" }}>
            No prints in this category yet.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "3px" }}>
            {filtered.map(print => (
              <div
                key={print.id}
                onClick={() => setSelected(print)}
                onMouseEnter={() => setHovered(print.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer", background: "#e8e4de" }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <Image
                    src={print.image} alt={print.title}
                    width={600} height={400}
                    style={{
                      width: "100%", height: "auto", display: "block",
                      transition: "transform 0.6s ease",
                      transform: hovered === print.id ? "scale(1.04)" : "scale(1)",
                    }}
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(10,10,8,0.4)",
                    opacity: hovered === print.id ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{
                      fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px",
                      letterSpacing: "0.16em", textTransform: "uppercase",
                      color: "#f7f5f1", border: "0.5px solid rgba(247,245,241,0.6)",
                      padding: "8px 20px", borderRadius: "2px",
                    }}>
                      View print
                    </span>
                  </div>
                </div>
                <div style={{ padding: "0.75rem 1rem 1rem", background: "#f7f5f1" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "17px", fontWeight: 300, color: "#1a1814", margin: 0 }}>
                    {print.title}
                  </p>
                  {print.location && (
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "13px", color: "#9a9189", margin: "2px 0 0" }}>
                      {print.location}
                    </p>
                  )}
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "20px", color: "#a07850", margin: "8px 0 0" }}>
                    from ${print.basePrice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selected && <PrintModal print={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
