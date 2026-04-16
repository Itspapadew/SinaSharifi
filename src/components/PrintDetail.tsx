"use client";
import { useState } from "react";
import Link from "next/link";
import { Print } from "@/data/prints";

export default function PrintDetail({ print }: { print: Print }) {
  const [selectedSize, setSelectedSize] = useState(0);
  const remaining = print.edition - print.sold;
  const isSoldOut = remaining <= 0;

  return (
    <div style={{ paddingTop: "var(--nav-height)", minHeight: "100vh" }}>
      <div style={{ padding: "1.5rem 2rem", borderBottom: "0.5px solid var(--charcoal)" }}>
        <Link href="/" className="label" style={{ color: "var(--ash)", display: "inline-flex", alignItems: "center", gap: "8px" }}>
          ← All prints
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - var(--nav-height) - 52px)" }}>

        <div style={{
          background: print.placeholderColor,
          position: "sticky",
          top: "var(--nav-height)",
          height: "calc(100vh - var(--nav-height))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRight: "0.5px solid var(--charcoal)",
          overflow: "hidden",
        }}>
          <div style={{
            width: "70%",
            maxWidth: "480px",
            paddingBottom: print.aspect === "portrait" ? "93%" : print.aspect === "square" ? "70%" : "47%",
            background: `color-mix(in srgb, ${print.placeholderColor} 80%, #3a3530)`,
            border: "0.5px solid rgba(255,255,255,0.06)",
            position: "relative",
          }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="label" style={{ color: "rgba(255,255,255,0.15)" }}>{print.title}</span>
            </div>
          </div>
        </div>

        <div style={{ padding: "3rem 3rem 4rem", overflowY: "auto" }}>
          <p className="label" style={{ color: "var(--ash)", marginBottom: "1rem" }}>
            {print.collectionLabel} · {print.location} · {print.year}
          </p>

          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: "clamp(32px, 4vw, 52px)",
            color: "var(--linen)",
            lineHeight: 1.05,
            marginBottom: "1.5rem",
            letterSpacing: "0.02em",
          }}>
            {print.title}
          </h1>

          <p style={{
            fontFamily: "var(--font-serif)",
            fontSize: "17px",
            fontStyle: "italic",
            color: "var(--ash-light)",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            maxWidth: "480px",
          }}>
            "{print.story}"
          </p>

          <div style={{ width: "40px", height: "0.5px", background: "var(--charcoal)", marginBottom: "2.5rem" }} />

          <div style={{ display: "flex", gap: "2.5rem", marginBottom: "2.5rem" }}>
            <div>
              <p className="label" style={{ color: "var(--ash)", marginBottom: "4px" }}>Edition</p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "var(--linen)" }}>{print.edition} prints</p>
            </div>
            <div>
              <p className="label" style={{ color: "var(--ash)", marginBottom: "4px" }}>Remaining</p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: remaining <= 5 ? "#c97a5a" : "var(--linen)" }}>
                {isSoldOut ? "Sold out" : `${remaining} of ${print.edition}`}
              </p>
            </div>
            <div>
              <p className="label" style={{ color: "var(--ash)", marginBottom: "4px" }}>Camera</p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "16px", color: "var(--ash-light)" }}>{print.camera}</p>
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <p className="label" style={{ color: "var(--ash)", marginBottom: "12px" }}>Select size</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {print.sizes.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSize(i)}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    padding: "10px 20px",
                    border: "0.5px solid",
                    borderColor: selectedSize === i ? "var(--driftwood)" : "var(--charcoal)",
                    color: selectedSize === i ? "var(--driftwood)" : "var(--ash-light)",
                    background: selectedSize === i ? "rgba(201,185,154,0.06)" : "transparent",
                    borderRadius: "2px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--driftwood)", fontWeight: 300 }}>
              ${print.sizes[selectedSize].price}
            </p>
            <button
              disabled={isSoldOut}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: isSoldOut ? "var(--ash)" : "var(--obsidian)",
                background: isSoldOut ? "transparent" : "var(--driftwood)",
                border: "0.5px solid",
                borderColor: isSoldOut ? "var(--charcoal)" : "var(--driftwood)",
                padding: "14px 32px",
                borderRadius: "2px",
                cursor: isSoldOut ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                flex: 1,
                maxWidth: "240px",
              }}
            >
              {isSoldOut ? "Edition Sold Out" : "Add to Cart"}
            </button>
          </div>

          <div style={{ borderTop: "0.5px solid var(--charcoal)", paddingTop: "2rem", marginTop: "1rem" }}>
            <p className="label" style={{ color: "var(--ash)", marginBottom: "1rem" }}>Print details</p>
            {[
              ["Paper", "Hahnemühle Photo Rag 308gsm"],
              ["Inks", "Archival pigment, 200+ year fade resistance"],
              ["Finish", "Fine art matte"],
              ["Certificate", "Included — signed & numbered"],
              ["Shipping", "Rolled in protective tube · 5–10 business days"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid var(--charcoal)" }}>
                <span className="label" style={{ color: "var(--ash)" }}>{label}</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--ash-light)", textAlign: "right", maxWidth: "60%" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
