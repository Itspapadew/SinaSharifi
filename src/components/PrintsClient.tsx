"use client";
import { useState } from "react";
import Image from "next/image";

type Size = {
  label: string;
  price: number;
  priceId: string;
};

type Print = {
  id: string;
  title: string;
  location: string;
  category: string;
  story: string;
  image: string;
  sizes: Size[];
  edition: number;
  sold: number;
};

export default function PrintsClient({ prints }: { prints: Print[] }) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const getSize = (printId: string, sizes: Size[]) => {
    return sizes[selected[printId] ?? 0];
  };

  const handleBuy = async (print: Print) => {
    const size = getSize(print.id, print.sizes);
    setLoading(print.id);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: print.title,
          size: size.label,
          price: size.price,
          image: print.image,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {prints.map((print) => {
        const remaining = print.edition - print.sold;
        const currentSize = getSize(print.id, print.sizes);
        const isLoading = loading === print.id;

        return (
          <div
            key={print.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderBottom: "0.5px solid var(--charcoal)",
            }}
          >
            {/* Image */}
            <div style={{ position: "relative", minHeight: "500px", background: "#e8e4de", overflow: "hidden" }}>
              <Image
                src={print.image}
                alt={print.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="50vw"
              />
            </div>

            {/* Details */}
            <div style={{ padding: "4rem 3rem", borderLeft: "0.5px solid var(--charcoal)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 1rem" }}>
                {print.category} · {print.location}
              </p>

              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 300, color: "#1a1814", lineHeight: 1.1, margin: "0 0 1.5rem" }}>
                {print.title}
              </h2>

              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "18px", color: "#6b6256", lineHeight: 1.7, margin: "0 0 2rem", maxWidth: "440px" }}>
                "{print.story}"
              </p>

              <div style={{ width: "40px", height: "0.5px", background: "var(--charcoal)", margin: "0 0 2rem" }} />

              {/* Edition info */}
              <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
                <div>
                  <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 4px" }}>Edition</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", color: "#1a1814", margin: 0 }}>{print.edition} prints</p>
                </div>
                <div>
                  <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 4px" }}>Remaining</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", color: remaining <= 5 ? "#c97a5a" : "#1a1814", margin: 0 }}>
                    {remaining} of {print.edition}
                  </p>
                </div>
              </div>

              {/* Size selector */}
              <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 12px" }}>Select size</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {print.sizes.map((size, i) => (
                    <button
                      key={size.label}
                      onClick={() => setSelected(prev => ({ ...prev, [print.id]: i }))}
                      style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: "12px",
                        letterSpacing: "0.08em",
                        padding: "10px 20px",
                        border: "0.5px solid",
                        borderColor: (selected[print.id] ?? 0) === i ? "#a07850" : "var(--charcoal)",
                        color: (selected[print.id] ?? 0) === i ? "#a07850" : "#6b6256",
                        background: (selected[print.id] ?? 0) === i ? "rgba(160,120,80,0.06)" : "transparent",
                        borderRadius: "2px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price + Buy */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "36px", color: "#a07850", fontWeight: 300, margin: 0 }}>
                  ${currentSize.price}
                </p>
                <button
                  onClick={() => handleBuy(print)}
                  disabled={isLoading}
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#f7f5f1",
                    background: isLoading ? "#9a9189" : "#1a1814",
                    border: "none",
                    padding: "14px 32px",
                    borderRadius: "2px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    flex: 1,
                    maxWidth: "200px",
                  }}
                >
                  {isLoading ? "Loading..." : "Buy Print"}
                </button>
              </div>

              {/* Print details */}
              <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "0.5px solid var(--charcoal)" }}>
                {[
                  ["Paper", "Hahnemühle Photo Rag 308gsm"],
                  ["Inks", "Archival pigment, 200+ year fade resistance"],
                  ["Certificate", "Signed & numbered, included"],
                  ["Shipping", "5–10 business days worldwide"],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid var(--charcoal)" }}>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189" }}>{label}</span>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "12px", color: "#6b6256", textAlign: "right", maxWidth: "60%" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
