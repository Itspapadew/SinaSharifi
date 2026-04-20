"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

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
    priceMultiplier: 1.4,
  },
];

const PORTRAIT_SIZES = [
  { label: 'Small', inches: '12×18"', sku: 'GLOBAL-FAP-12x18', price: 45 },
  { label: 'Medium', inches: '16×24"', sku: 'GLOBAL-FAP-16x24', price: 75 },
  { label: 'Large', inches: '24×36"', sku: 'GLOBAL-FAP-24x36', price: 120 },
  { label: 'XL', inches: '30×45"', sku: 'GLOBAL-FAP-30x45', price: 160 },
];

const LANDSCAPE_SIZES = [
  { label: 'Small', inches: '18×12"', sku: 'GLOBAL-FAP-18x12', price: 45 },
  { label: 'Medium', inches: '24×16"', sku: 'GLOBAL-FAP-24x16', price: 75 },
  { label: 'Large', inches: '36×24"', sku: 'GLOBAL-FAP-36x24', price: 120 },
  { label: 'XL', inches: '45×30"', sku: 'GLOBAL-FAP-45x30', price: 160 },
];

const SQUARE_SIZES = [
  { label: 'Small', inches: '12×12"', sku: 'GLOBAL-FAP-12x12', price: 45 },
  { label: 'Medium', inches: '20×20"', sku: 'GLOBAL-FAP-20x20', price: 75 },
  { label: 'Large', inches: '30×30"', sku: 'GLOBAL-FAP-30x30', price: 120 },
  { label: 'XL', inches: '40×40"', sku: 'GLOBAL-FAP-40x40', price: 160 },
];

function useImageOrientation(src: string) {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'square'>('landscape');

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      if (ratio > 1.05) setOrientation('landscape');
      else if (ratio < 0.95) setOrientation('portrait');
      else setOrientation('square');
    };
    img.src = src;
  }, [src]);

  return orientation;
}

function PrintItem({ print, index }: { print: Print; index: number }) {
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedPaper, setSelectedPaper] = useState('enhanced-matte');
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const orientation = useImageOrientation(print.image);

  const SIZES = orientation === 'portrait' ? PORTRAIT_SIZES
    : orientation === 'square' ? SQUARE_SIZES
    : LANDSCAPE_SIZES;

  const size = SIZES[selectedSize];
  const paper = PAPERS.find(p => p.id === selectedPaper) || PAPERS[0];
  const price = Math.round(size.price * paper.priceMultiplier);
  const sku = size.sku.replace('FAP', selectedPaper === 'hahnemuhle' ? 'HAHP' : 'FAP');

  const handleAddToCart = () => {
    addItem({
      id: `${print.id}-${sku}`,
      photoId: print.id,
      title: print.title,
      imageUrl: print.image,
      size: size.inches,
      paper: paper.label,
      sku,
      price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      borderBottom: "0.5px solid var(--charcoal)",
    }}>
      <div style={{
        position: "relative", minHeight: "600px", background: "#e8e4de",
        order: index % 2 === 0 ? 0 : 1,
      }}>
        <Image src={print.image} alt={print.title} fill style={{ objectFit: "cover" }} sizes="50vw" />
        <div style={{
          position: "absolute", bottom: "1rem", left: "1rem",
          background: "rgba(247,245,241,0.9)", padding: "4px 10px", borderRadius: "2px",
        }}>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", margin: 0 }}>
            {orientation} format
          </p>
        </div>
      </div>

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
            {SIZES.map((s, i) => (
              <button key={s.label} onClick={() => setSelectedSize(i)} style={{
                fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px",
                padding: "8px 16px", border: "0.5px solid",
                borderColor: selectedSize === i ? "#a07850" : "var(--charcoal)",
                color: selectedSize === i ? "#a07850" : "#6b6256",
                background: selectedSize === i ? "rgba(160,120,80,0.06)" : "transparent",
                borderRadius: "2px", cursor: "pointer", transition: "all 0.2s",
              }}>
                {s.inches}
              </button>
            ))}
          </div>
        </div>

        {/* Paper selector */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 12px" }}>Paper</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {PAPERS.map(p => (
              <button key={p.id} onClick={() => setSelectedPaper(p.id)} style={{
                padding: "12px 16px", border: "0.5px solid", textAlign: "left",
                borderColor: selectedPaper === p.id ? "#a07850" : "var(--charcoal)",
                background: selectedPaper === p.id ? "rgba(160,120,80,0.06)" : "transparent",
                borderRadius: "2px", cursor: "pointer", transition: "all 0.2s",
              }}>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: selectedPaper === p.id ? "#a07850" : "#1a1814", margin: "0 0 4px" }}>
                  {p.label}
                </p>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: 0, lineHeight: 1.5 }}>
                  {p.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Price + Add to cart */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "40px", color: "#a07850", fontWeight: 300, margin: 0 }}>
            ${price}
          </p>
          <button onClick={handleAddToCart} style={{
            flex: 1, maxWidth: "220px", padding: "14px 24px",
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px",
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#f7f5f1", background: added ? "#a07850" : "#1a1814",
            border: "none", borderRadius: "2px", cursor: "pointer", transition: "all 0.3s",
          }}>
            {added ? "✓ Added to cart" : "Add to cart"}
          </button>
        </div>

        {/* Print specs */}
        <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "0.5px solid var(--charcoal)" }}>
          {[
            ["Format", `${orientation.charAt(0).toUpperCase() + orientation.slice(1)} · auto-detected`],
            ["Printing", "Giclée — museum quality"],
            ["Inks", "Archival pigment, 100-200 year fade resistance"],
            ["Finishing", "Signed & numbered certificate of authenticity"],
            ["Shipping", "Fulfilled from nearest print lab worldwide"],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid var(--charcoal)" }}>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189" }}>{label}</span>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#6b6256", textAlign: "right", maxWidth: "55%" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PrintsClient({ prints }: { prints: Print[] }) {
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
        <PrintItem key={print.id} print={print} index={index} />
      ))}
    </div>
  );
}
