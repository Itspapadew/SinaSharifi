"use client";
import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

type PrintSize = {
  label: string;
  inches: string;
  sku: string;
  price: number;
};

type PaperOption = {
  id: string;
  label: string;
  description: string;
  priceMultiplier: number;
};

type Print = {
  id: string;
  title: string;
  location: string;
  category: string;
  image: string;
  basePrice: number;
  edition: number;
};

const SIZES: PrintSize[] = [
  { label: 'Small', inches: '12×16"', sku: 'GLOBAL-FAP-12x16', price: 120 },
  { label: 'Medium', inches: '16×24"', sku: 'GLOBAL-FAP-16x24', price: 200 },
  { label: 'Large', inches: '24×36"', sku: 'GLOBAL-FAP-24x36', price: 320 },
  { label: 'XL', inches: '30×40"', sku: 'GLOBAL-FAP-30x40', price: 480 },
];

const PAPERS: PaperOption[] = [
  {
    id: 'enhanced-matte',
    label: 'Enhanced Matte',
    description: '200gsm archival matte paper. Sharp detail, no glare. Ships flat or rolled.',
    priceMultiplier: 1,
  },
  {
    id: 'hahnemuhle',
    label: 'Hahnemühle Fine Art',
    description: 'Museum-grade 310gsm cotton rag. Used by galleries worldwide. 100+ year archival.',
    priceMultiplier: 1.6,
  },
];

export default function PrintsClient({ prints }: { prints: Print[] }) {
  const [selectedSize, setSelectedSize] = useState<Record<string, number>>({});
  const [selectedPaper, setSelectedPaper] = useState<Record<string, string>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const { addItem, openCart } = useCartStore();

  const getSize = (printId: string) => SIZES[selectedSize[printId] ?? 0];
  const getPaper = (printId: string) => PAPERS.find(p => p.id === (selectedPaper[printId] ?? 'enhanced-matte')) || PAPERS[0];
  const getPrice = (printId: string) => Math.round(getSize(printId).price * getPaper(printId).priceMultiplier);

  const handleAddToCart = (print: Print) => {
    const size = getSize(print.id);
    const paper = getPaper(print.id);
    const price = getPrice(print.id);
    const sku = size.sku.replace('FAP', paper.id === 'hahnemuhle' ? 'HFAP' : 'FAP');

    addItem({
      id: `${print.id}-${size.sku}-${paper.id}`,
      photoId: print.id,
      title: print.title,
      imageUrl: print.image,
      size: size.inches,
      paper: paper.label,
      sku,
      price,
    });

    setAdded(prev => ({ ...prev, [print.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [print.id]: false })), 2000);
  };

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
    <div>
      {prints.map((print, index) => (
        <div key={print.id} style={{
          display: "grid",
          gridTemplateColumns: index % 2 === 0 ? "1fr 1fr" : "1fr 1fr",
          borderBottom: "0.5px solid var(--charcoal)",
        }}>
          {/* Image — alternates left/right */}
          <div style={{
            position: "relative", minHeight: "600px", background: "#e8e4de",
            order: index % 2 === 0 ? 0 : 1,
          }}>
            <Image src={print.image} alt={print.title} fill style={{ objectFit: "cover" }} sizes="50vw" />
          </div>

          {/* Details */}
          <div style={{
            padding: "4rem 3.5rem",
            borderLeft: index % 2 === 0 ? "0.5px solid var(--charcoal)" : "none",
            borderRight: index % 2 !== 0 ? "0.5px solid var(--charcoal)" : "none",
            display: "flex", flexDirection: "column", justifyContent: "center",
            order: index % 2 === 0 ? 1 : 0,
          }}>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 1rem" }}>
              {print.category}{print.location && ` · ${print.location}`}
            </p>

            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 3vw, 48px)", fontWeight: 300, color: "#1a1814", lineHeight: 1.1, margin: "0 0 2rem" }}>
              {print.title}
            </h2>

            <div style={{ width: "40px", height: "0.5px", background: "var(--charcoal)", margin: "0 0 2rem" }} />

            {/* Edition */}
            <div style={{ marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 4px" }}>Edition</p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", color: "#1a1814", margin: 0 }}>
                Limited to {print.edition} prints · Signed & numbered
              </p>
            </div>

            {/* Size selector */}
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 12px" }}>Size</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {SIZES.map((size, i) => (
                  <button key={size.label} onClick={() => setSelectedSize(prev => ({ ...prev, [print.id]: i }))}
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px",
                      padding: "8px 16px", border: "0.5px solid",
                      borderColor: (selectedSize[print.id] ?? 0) === i ? "#a07850" : "var(--charcoal)",
                      color: (selectedSize[print.id] ?? 0) === i ? "#a07850" : "#6b6256",
                      background: (selectedSize[print.id] ?? 0) === i ? "rgba(160,120,80,0.06)" : "transparent",
                      borderRadius: "2px", cursor: "pointer", transition: "all 0.2s",
                    }}>
                    {size.inches}
                  </button>
                ))}
              </div>
            </div>

            {/* Paper selector */}
            <div style={{ marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 12px" }}>Paper</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {PAPERS.map(paper => (
                  <button key={paper.id} onClick={() => setSelectedPaper(prev => ({ ...prev, [print.id]: paper.id }))}
                    style={{
                      padding: "12px 16px", border: "0.5px solid", textAlign: "left",
                      borderColor: (selectedPaper[print.id] ?? 'enhanced-matte') === paper.id ? "#a07850" : "var(--charcoal)",
                      background: (selectedPaper[print.id] ?? 'enhanced-matte') === paper.id ? "rgba(160,120,80,0.06)" : "transparent",
                      borderRadius: "2px", cursor: "pointer", transition: "all 0.2s",
                    }}>
                    <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: (selectedPaper[print.id] ?? 'enhanced-matte') === paper.id ? "#a07850" : "#1a1814", margin: "0 0 4px" }}>
                      {paper.label}
                    </p>
                    <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: 0, lineHeight: 1.5 }}>
                      {paper.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Price + Add to cart */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "40px", color: "#a07850", fontWeight: 300, margin: 0 }}>
                ${getPrice(print.id)}
              </p>
              <button onClick={() => handleAddToCart(print)}
                style={{
                  flex: 1, maxWidth: "220px", padding: "14px 24px",
                  fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px",
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "#f7f5f1", background: added[print.id] ? "#a07850" : "#1a1814",
                  border: "none", borderRadius: "2px", cursor: "pointer", transition: "all 0.3s",
                }}>
                {added[print.id] ? "✓ Added to cart" : "Add to cart"}
              </button>
            </div>

            {/* Print specs */}
            <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "0.5px solid var(--charcoal)" }}>
              {[
                ["Printing", "Giclée — museum quality"],
                ["Inks", "Archival pigment, 100-200 year fade resistance"],
                ["Finishing", "Signed & numbered certificate of authenticity"],
                ["Shipping", "Shipped worldwide from nearest print lab"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid var(--charcoal)" }}>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189" }}>{label}</span>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#6b6256", textAlign: "right", maxWidth: "55%" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
