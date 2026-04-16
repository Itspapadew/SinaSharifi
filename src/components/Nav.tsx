"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const LOCATION = "Kotor, Montenegro";

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
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: "var(--nav-height)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2rem",
      background: scrolled ? "rgba(247,245,241,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "0.5px solid var(--charcoal)" : "none",
      transition: "all 0.3s ease",
    }}>
      <Link href="/" style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 300,
        fontSize: "20px",
        letterSpacing: "0.06em",
        color: "var(--linen)",
      }}>
        Sina <em>Sharifi</em>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <span className="label" style={{ color: "var(--ash)" }}>
          Currently in {LOCATION}
        </span>
        {["About", "Contact"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="label"
            style={{ color: "var(--ash)", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--driftwood)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ash)")}
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
}
