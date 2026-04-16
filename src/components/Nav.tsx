"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 100,
      height: "var(--nav-height)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2.5rem",
      background: scrolled ? "rgba(247,245,241,0.98)" : "rgba(247,245,241,0.96)",
      backdropFilter: "blur(12px)",
      borderBottom: "0.5px solid var(--charcoal)",
      transition: "background 0.4s ease",
    }}>
      <Link href="/" style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 300,
        fontSize: "22px",
        letterSpacing: "0.06em",
        color: "var(--linen)",
        textDecoration: "none",
        lineHeight: 1,
      }}>
        Sina <em style={{ fontStyle: "italic", color: "var(--driftwood)" }}>Sharifi</em>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
        {[
          { label: "Portfolio", href: "/portfolio" },
          { label: "Prints", href: "/prints" },
          { label: "About", href: "/about" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ash)",
              fontWeight: 300,
              textDecoration: "none",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--driftwood)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ash)")}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/prints"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--driftwood)",
            border: "0.5px solid var(--driftwood)",
            padding: "8px 18px",
            borderRadius: "2px",
            textDecoration: "none",
            fontWeight: 300,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "var(--driftwood)";
            e.currentTarget.style.color = "var(--obsidian)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--driftwood)";
          }}
        >
          Shop Prints
        </Link>
      </div>
    </nav>
  );
}
