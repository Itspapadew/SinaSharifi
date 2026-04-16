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
      background: "rgba(247,245,241,0.96)",
      backdropFilter: "blur(12px)",
      borderBottom: "0.5px solid var(--charcoal)",
      transition: "all 0.4s ease",
    }}>
      <Link href="/" style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 300,
        fontSize: "22px",
        letterSpacing: "0.06em",
        color: "#1a1814",
        textDecoration: "none",
        lineHeight: 1,
      }}>
        Sina <em style={{ fontStyle: "italic", color: "#a07850" }}>Sharifi</em>
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
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#9a9189",
              fontWeight: 300,
              textDecoration: "none",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#a07850")}
            onMouseLeave={e => (e.currentTarget.style.color = "#9a9189")}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
