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
  { slug: "all", label: "All editions" },
  { slug: "landscape", label: "Landscape" },
  { slug: "wildlife", label: "Wildlife" },
  { slug: "portrait", label: "Portrait" },
  { slug: "macro", label: "Macro" },
  { slug: "family", label: "Family" },
];

const PORTRAIT_SIZES = [
  { label: '12x18"', sku: 'GLOBAL-FAP-12x18', price: 45, frameW: 160, frameH: 240 },
  { label: '16x24"', sku: 'GLOBAL-FAP-16x24', price: 75, frameW: 200, frameH: 300 },
  { label: '24x36"', sku: 'GLOBAL-FAP-24x36', price: 120, frameW: 240, frameH: 360 },
  { label: '30x45"', sku: 'GLOBAL-FAP-30x45', price: 160, frameW: 270, frameH: 405 },
];

const LANDSCAPE_SIZES = [
  { label: '18x12"', sku: 'GLOBAL-FAP-18x12', price: 45, frameW: 240, frameH: 160 },
  { label: '24x16"', sku: 'GLOBAL-FAP-24x16', price: 75, frameW: 300, frameH: 200 },
  { label: '36x24"', sku: 'GLOBAL-FAP-36x24', price: 120, frameW: 360, frameH: 240 },
  { label: '45x30"', sku: 'GLOBAL-FAP-45x30', price: 160, frameW: 405, frameH: 270 },
];

const PAPERS = [
  { id: 'matte', label: 'Enhanced Matte', desc: '200gsm archival · sharp detail · no glare', multiplier: 1 },
  { id: 'hahnemuhle', label: 'Hahnemuhle Fine Art', desc: '310gsm cotton rag · museum grade · 100+ year archival', multiplier: 1.4 },
];

function FramedMockup({ imageSrc, title, frameW, frameH }: { imageSrc: string; title: string; frameW: number; frameH: number }) {
  return (
    <div style={{
      width: "100%", height: "100%", minHeight: "460px",
      background: "#e8e2d8",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to bottom, rgba(0,0,0,0.07), transparent)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "20%", background: "linear-gradient(to top, rgba(0,0,0,0.08), transparent)", pointerEvents: "none" }} />

      <div style={{
        position: "relative",
        width: `${frameW}px`,
        height: `${frameH}px`,
        maxWidth: "80%",
        maxHeight: "75%",
        boxShadow: "4px 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.14)",
        transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "#f0ece4", border: "1px solid rgba(0,0,0,0.08)" }} />
        <div style={{ position: "absolute", inset: "10px", background: "#ffffff" }} />
        <div style={{ position: "absolute", inset: "22px", overflow: "hidden" }}>
          <Image src={imageSrc} alt={title} fill style={{ objectFit: "cover" }} sizes="400px" />
        </div>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "rgba(255,255,255,0.5)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-14px", left: "10%", right: "10%", height: "14px", background: "rgba(0,0,0,0.1)", filter: "blur(6px)", borderRadius: "50%" }} />
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
    background: "rgba(247,245,241,0.92)", border: "none",
    color: "#1a1814", width: "36px", height: "36px",
    borderRadius: "50%", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", zIndex: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(10,10,8,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", overflowY: "auto",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#ffffff", width: "100%", maxWidth: "1100px",
        borderRadius: "4px", overflow: "hidden",
        display: "grid", gridTemplateColumns: "1fr 1fr",
      }}>
        <div style={{ position: "relative", minHeight: "460px", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0, background: "#1a1814",
            opacity: slide === 0 ? 1 : 0, transition: "opacity 0.4s ease",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Image src={print.image} alt={print.title} width={800} height={600}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onLoad={e => {
                const img = e.target as HTMLImageElement;
                setOrientation(img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait');
              }}
              sizes="450px" priority
            />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: slide === 1 ? 1 : 0, transition: "opacity 0.4s ease" }}>
            <FramedMockup imageSrc={print.image} title={print.title} frameW={size.frameW} frameH={size.frameH} />
          </div>
          {slide === 1 && <button onClick={e => { e.stopPropagation(); setSlide(0); }} style={{ ...arrowStyle, left: "12px" }}>←</button>}
          {slide === 0 && <button onClick={e => { e.stopPropagation(); setSlide(1); }} style={{ ...arrowStyle, right: "12px" }}>→</button>}
          <div style={{ position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 5 }}>
            {[0, 1].map(i => (
              <button key={i} onClick={e => { e.stopPropagation(); setSlide(i); }} style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: slide === i ? "#f7f5f1" : "rgba(247,245,241,0.35)",
                border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s",
              }} />
            ))}
          </div>
          <div style={{ position: "absolute", bottom: "1rem", right: "1rem", zIndex: 5 }}>
            <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(247,245,241,0.8)", background: "rgba(0,0,0,0.3)", padding: "3px 8px", borderRadius: "2px" }}>
              {slide === 0 ? "Photo" : "Framed"}
            </span>
          </div>
          <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "18px", zIndex: 10 }}>×</button>
        </div>

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
              }}>{s.label}</button>
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
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "36px", color: "#a07850", fontWeight: 300, margin: 0 }}>${price}</p>
            <button onClick={handleAdd} style={{
              flex: 1, padding: "13px", fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#f7f5f1", background: added ? "#a07850" : "#1a1814",
              border: "none", borderRadius: "2px", cursor: "pointer", transition: "all 0.3s",
            }}>{added ? "Added to cart" : "Add to cart"}</button>
          </div>

          <div style={{ paddingTop: "1.25rem", borderTop: "0.5px solid var(--charcoal)" }}>
            {[["Printing", "Giclee — museum quality"], ["Fulfillment", "Nearest print lab worldwide"], ["Certificate", "Signed and numbered, included"]].map(([label, value]) => (
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
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "24px", color: "#9a9189" }}>No prints available yet.</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: "1rem 2rem", display: "flex", gap: "2rem", borderBottom: "0.5px solid var(--charcoal)", alignItems: "center", overflowX: "auto" }}>
        {CATEGORIES.map(cat => (
          <button key={cat.slug} onClick={() => setActiveCategory(cat.slug)} style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: "12px",
            letterSpacing: "0.08em", padding: "0 0 4px",
            border: "none", borderBottom: activeCategory === cat.slug ? "1.5px solid #1a1814" : "1.5px solid transparent",
            color: activeCategory === cat.slug ? "#1a1814" : "#9a9189",
            background: "transparent", cursor: "pointer",
            transition: "all 0.2s", whiteSpace: "nowrap",
            fontWeight: activeCategory === cat.slug ? 400 : 300,
          }}>{cat.label}</button>
        ))}
      </div>

      <section>
        {filtered.length === 0 ? (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "20px", color: "#9a9189", textAlign: "center", padding: "4rem 0" }}>
            No prints in this category yet.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {filtered.map(print => (
              <div key={print.id} onClick={() => setSelected(print)}
                onMouseEnter={() => setHovered(print.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer", borderRight: "0.5px solid var(--charcoal)", borderBottom: "0.5px solid var(--charcoal)" }}
              >
                {/* Uniform square */}
                <div style={{ position: "relative", paddingBottom: "100%", overflow: "hidden", background: "#f0ece4" }}>
                  <Image src={print.image} alt={print.title} fill
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                      transform: hovered === print.id ? "scale(1.04)" : "scale(1)",
                    }}
                    sizes="25vw"
                  />
                  <button
                    onClick={e => { e.stopPropagation(); setSelected(print); }}
                    style={{
                      position: "absolute", bottom: "1rem", right: "1rem",
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: "#ffffff", border: "0.5px solid var(--charcoal)",
                      cursor: "pointer", fontSize: "18px", color: "#1a1814",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: hovered === print.id ? 1 : 0,
                      transition: "opacity 0.2s ease",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }}
                  >+</button>
                </div>
                <div style={{ padding: "0.75rem 1rem 1rem" }}>
                  <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#1a1814", margin: 0, fontWeight: 300 }}>
                    {print.title}
                  </p>
                  <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#9a9189", margin: "4px 0 0" }}>
                    From ${print.basePrice}
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
