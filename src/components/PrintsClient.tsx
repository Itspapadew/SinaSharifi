"use client";
import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import RoomVisualizer from "@/components/RoomVisualizer";

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
  { label: '12×18"', sku: 'GLOBAL-FAP-12x18', price: 45 },
  { label: '16×24"', sku: 'GLOBAL-FAP-16x24', price: 75 },
  { label: '24×36"', sku: 'GLOBAL-FAP-24x36', price: 120 },
  { label: '30×45"', sku: 'GLOBAL-FAP-30x45', price: 160 },
];

const LANDSCAPE_SIZES = [
  { label: '18×12"', sku: 'GLOBAL-FAP-18x12', price: 45 },
  { label: '24×16"', sku: 'GLOBAL-FAP-24x16', price: 75 },
  { label: '36×24"', sku: 'GLOBAL-FAP-36x24', price: 120 },
  { label: '45×30"', sku: 'GLOBAL-FAP-45x30', price: 160 },
];

const PAPERS = [
  { id: 'matte', label: 'Enhanced Matte', desc: '200gsm archival · sharp detail · no glare', multiplier: 1 },
  { id: 'hahnemuhle', label: 'Hahnemühle Fine Art', desc: '310gsm cotton rag · museum grade · 100+ year archival', multiplier: 1.4 },
];

function PrintModal({ print, onClose }: { print: Print; onClose: () => void }) {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [paperId, setPaperId] = useState('matte');
  const [added, setAdded] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [roomStyle, setRoomStyle] = useState<'living' | 'bedroom' | 'office'>('living');
  const [showRoom, setShowRoom] = useState(false);
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

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        background: "rgba(10,10,8,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#f7f5f1",
          width: "100%", maxWidth: "960px",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {/* Top section — image + details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {/* Image */}
          <div style={{ position: "relative", minHeight: "420px", background: "#e8e4de" }}>
            <Image
              src={print.image}
              alt={print.title}
              fill
              style={{ objectFit: "cover" }}
              onLoad={e => {
                const img = e.target as HTMLImageElement;
                setOrientation(img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait');
              }}
              sizes="480px"
              priority
            />
            <button onClick={onClose} style={{
              position: "absolute", top: "1rem", right: "1rem",
              background: "rgba(0,0,0,0.5)", border: "none", color: "#fff",
              width: "32px", height: "32px", borderRadius: "50%",
              cursor: "pointer", fontSize: "18px",
            }}>×</button>
          </div>

          {/* Details */}
          <div style={{ padding: "2rem 1.75rem", overflowY: "auto", maxHeight: "600px" }}>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 0.5rem" }}>
              {print.category}{print.location && ` · ${print.location}`}
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 300, color: "#1a1814", lineHeight: 1.1, margin: "0 0 0.4rem" }}>
              {print.title}
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "13px", color: "#9a9189", margin: "0 0 1.5rem" }}>
              Limited edition of {print.edition} · Signed & numbered
            </p>

            <div style={{ width: "32px", height: "0.5px", background: "var(--charcoal)", margin: "0 0 1.5rem" }} />

            {/* Size */}
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

            {/* Paper */}
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

            {/* Price + CTA */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
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
                {added ? "✓ Added to cart" : "Add to cart"}
              </button>
            </div>

            {/* Preview in room button */}
            <button onClick={() => setShowRoom(!showRoom)} style={{
              width: "100%", padding: "10px",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#9a9189", background: "transparent",
              border: "0.5px solid var(--charcoal)", borderRadius: "2px",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              {showRoom ? "Hide room preview" : "Preview in a room"}
            </button>

            {/* Specs */}
            <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "0.5px solid var(--charcoal)" }}>
              {[
                ["Printing", "Giclée — museum quality"],
                ["Fulfillment", "Nearest print lab worldwide"],
                ["Certificate", "Signed & numbered, included"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "0.5px solid var(--charcoal)" }}>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a9189" }}>{label}</span>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#6b6256", textAlign: "right", maxWidth: "55%" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room visualizer — expands below */}
        {showRoom && (
          <div style={{ padding: "2rem", borderTop: "0.5px solid var(--charcoal)" }}>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 1rem" }}>
              Preview in your space
            </p>
            <RoomVisualizer
              imageSrc={print.image}
              title={print.title}
              sizeLabel={size.label}
              roomStyle={roomStyle}
              onRoomChange={setRoomStyle}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function PrintsClient({ prints }: { prints: Print[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<Print | null>(null);

  const filtered = activeCategory === "all"
    ? prints
    : prints.filter(p => p.category === activeCategory);

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
      {/* Category filter */}
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

      {/* Grid */}
      <section style={{ padding: "2rem 2.5rem 4rem", maxWidth: "1400px", margin: "0 auto" }}>
        {filtered.length === 0 ? (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "20px", color: "#9a9189", textAlign: "center", padding: "4rem 0" }}>
            No prints in this category yet.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "3px" }}>
            {filtered.map(print => (
              <div
                key={print.id}
                onClick={() => setSelected(print)}
                onMouseEnter={() => setHovered(print.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer", background: "#e8e4de" }}
              >
                <div style={{ position: "relative", paddingBottom: "100%", overflow: "hidden" }}>
                  <Image
                    src={print.image}
                    alt={print.title}
                    fill
                    style={{
                      objectFit: "cover",
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
