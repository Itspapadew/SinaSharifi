"use client";
import { useState } from "react";
import Link from "next/link";
import { prints, collections } from "@/data/prints";

export default function PrintGrid() {
  const [active, setActive] = useState("all");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = active === "all"
    ? prints
    : prints.filter((p) => p.collection === active);

  return (
    <section style={{ padding: "2rem" }}>
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {collections.map((col) => (
          <button
            key={col.slug}
            onClick={() => setActive(col.slug)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "8px 16px",
              border: "0.5px solid",
              borderColor: active === col.slug ? "var(--driftwood)" : "var(--charcoal)",
              color: active === col.slug ? "var(--driftwood)" : "var(--ash)",
              background: active === col.slug ? "rgba(201,185,154,0.06)" : "transparent",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {col.label}
          </button>
        ))}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1px",
        background: "var(--charcoal)",
      }}>
        {filtered.map((print) => {
          const remaining = print.edition - print.sold;
          const isSoldOut = remaining <= 0;
          const isLow = remaining > 0 && remaining <= 5;

          return (
            <Link
              key={print.slug}
              href={`/prints/${print.slug}`}
              style={{ textDecoration: "none" }}
              onMouseEnter={() => setHovered(print.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ background: print.placeholderColor, position: "relative", cursor: "pointer", overflow: "hidden" }}>
                <div style={{
                  width: "100%",
                  paddingBottom: print.aspect === "portrait" ? "133%" : print.aspect === "square" ? "100%" : "66%",
                  background: print.placeholderColor,
                  position: "relative",
                  transition: "transform 0.6s ease",
                  transform: hovered === print.slug ? "scale(1.03)" : "scale(1)",
                }}>
                  {isSoldOut && (
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(10,10,8,0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <span className="label" style={{ color: "var(--ash)" }}>Edition sold out</span>
                    </div>
                  )}
                </div>

                <div style={{
                  padding: "1rem 1.25rem",
                  background: hovered === print.slug ? "var(--obsidian-2)" : "var(--obsidian)",
                  transition: "background 0.25s",
                  borderTop: "0.5px solid var(--charcoal)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-serif)", fontSize: "17px", color: "var(--linen)", lineHeight: 1.2, margin: 0 }}>
                        {print.title}
                      </p>
                      <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "13px", color: "var(--ash-light)", margin: "2px 0 0", lineHeight: 1 }}>
                        {print.location}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "1rem" }}>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--driftwood)", margin: 0, fontWeight: 300 }}>
                        from ${print.sizes[0].price}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.6rem" }}>
                    <span className="label" style={{ color: "var(--ash)" }}>{print.collectionLabel}</span>
                    {isLow && !isSoldOut && (
                      <span className="label" style={{ color: "#c97a5a" }}>{remaining} left</span>
                    )}
                    {!isLow && !isSoldOut && (
                      <span className="label" style={{ color: "var(--charcoal)" }}>Ed. {print.edition}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ marginTop: "4rem", padding: "3rem 2rem", borderTop: "0.5px solid var(--charcoal)", textAlign: "center" }}>
        <p className="label" style={{ marginBottom: "1rem" }}>New drops, first</p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(24px, 4vw, 40px)", color: "var(--linen)", marginBottom: "0.5rem" }}>
          Join the list.
        </h2>
        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "16px", color: "var(--ash-light)", marginBottom: "2rem" }}>
          New editions announced here first. 48hr head start before public release.
        </p>
        <div style={{ display: "flex", maxWidth: "400px", margin: "0 auto", border: "0.5px solid var(--charcoal)", borderRadius: "2px", overflow: "hidden" }}>
          <input
            type="email"
            placeholder="your@email.com"
            style={{ flex: 1, background: "var(--obsidian-2)", border: "none", outline: "none", padding: "12px 16px", fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--linen)", fontWeight: 300 }}
          />
          <button style={{ background: "transparent", border: "none", borderLeft: "0.5px solid var(--charcoal)", padding: "12px 20px", fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--driftwood)", cursor: "pointer", whiteSpace: "nowrap" }}>
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
