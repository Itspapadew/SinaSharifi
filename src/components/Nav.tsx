"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openCart, count } = useCartStore();

  useEffect(() => setMounted(true), []);
  const cartCount = mounted ? count() : 0;

  return (
    <>
      <style>{`
        .nav-links { display: flex; align-items: center; gap: 2.5rem; }
        .nav-hamburger { display: none; }
        .nav-mobile-menu { display: none; }
        .nav-link {
          fontFamily: "'Inter', system-ui, sans-serif";
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          color: #0a0a0a; font-weight: 400; text-decoration: none;
          transition: opacity 0.2s;
        }
        .nav-link:hover { opacity: 0.5; }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-hamburger { display: flex; flex-direction: column; gap: 5px; cursor: pointer; padding: 8px; background: none; border: none; }
          .nav-hamburger span { display: block; width: 22px; height: 1px; background: #0a0a0a; transition: all 0.3s; }
          .nav-mobile-menu {
            display: flex; flex-direction: column;
            position: fixed; top: var(--nav-height); left: 0; right: 0;
            background: #fff; padding: 2rem 2.5rem; gap: 1.5rem;
            border-bottom: 0.5px solid rgba(0,0,0,0.1); z-index: 99;
          }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "var(--nav-height)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2.5rem",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "0.5px solid rgba(0,0,0,0.08)",
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 300, fontSize: "22px", letterSpacing: "0.06em",
          color: "#0a0a0a", textDecoration: "none", lineHeight: 1,
        }}>
          Sina <em style={{ fontStyle: "italic", color: "#a07850" }}>Sharifi</em>
        </Link>

        {/* Desktop nav */}
        <div className="nav-links">
          {[
            { label: "Portfolio", href: "/portfolio" },
            { label: "Prints", href: "/prints" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "mailto:hello@sharifisina.com" },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#0a0a0a", fontWeight: 400, textDecoration: "none", opacity: 1,
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.45")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {item.label}
            </Link>
          ))}

          {/* Cart icon */}
          <button onClick={openCart} style={{
            background: "none", border: "none", cursor: "pointer",
            position: "relative", padding: "4px", display: "flex", alignItems: "center",
            color: "#0a0a0a", transition: "opacity 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.45")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: "-2px", right: "-4px",
                background: "#0a0a0a", color: "#fff",
                borderRadius: "50%", width: "16px", height: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "9px", fontFamily: "'Inter', system-ui, sans-serif",
              }}>{cartCount}</span>
            )}
          </button>
        </div>

        {/* Mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={openCart} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "4px", color: "#0a0a0a" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "-2px", right: "-4px", background: "#0a0a0a", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px" }}>{cartCount}</span>
            )}
          </button>
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {[
            { label: "Portfolio", href: "/portfolio" },
            { label: "Prints", href: "/prints" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "mailto:hello@sharifisina.com" },
          ].map(item => (
            <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{
              fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#0a0a0a", textDecoration: "none",
            }}>{item.label}</Link>
          ))}
        </div>
      )}
    </>
  );
}
