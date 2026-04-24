"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";

const PORTFOLIO_CATS = [
  { label: "All Work", href: "/portfolio" },
  { label: "Landscape", href: "/portfolio?category=landscape" },
  { label: "Wildlife", href: "/portfolio?category=wildlife" },
  { label: "Portrait", href: "/portfolio?category=portrait" },
  { label: "Macro", href: "/portfolio?category=macro" },
];

const PRINTS_CATS = [
  { label: "All Editions", href: "/prints" },
  { label: "Landscape", href: "/prints?category=landscape" },
  { label: "Wildlife", href: "/prints?category=wildlife" },
  { label: "Portrait", href: "/prints?category=portrait" },
  { label: "Macro", href: "/prints?category=macro" },
];

function Dropdown({ label, items, href }: { label: string; items: { label: string; href: string }[]; href: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "13px", letterSpacing: "0.10em", textTransform: "uppercase",
        color: "#0a0a0a", fontWeight: 400,
        display: "flex", alignItems: "center", gap: "5px", transition: "opacity 0.2s",
      }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.45")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M2 3.5L5 6.5L8 3.5"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)",
          background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          minWidth: "180px", zIndex: 200, padding: "8px 0",
        }}>
          {items.map((item, i) => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)} style={{
              display: "block", padding: "10px 20px",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "12px", letterSpacing: "0.10em", textTransform: "uppercase",
              color: i === 0 ? "#a07850" : "#0a0a0a",
              fontWeight: i === 0 ? 500 : 400,
              textDecoration: "none",
              borderBottom: i === 0 ? "0.5px solid #e0e0e0" : "none",
              background: "transparent", transition: "background 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f9f9f9")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >{item.label}</Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openCart, count } = useCartStore();

  useEffect(() => setMounted(true), []);
  const cartCount = mounted ? count() : 0;

  return (
    <>
      <style>{`
        .nav-hamburger span { display: block; width: 22px; height: 1px; background: #0a0a0a; transition: all 0.3s; }
        .nav-mobile-menu { display: none; }

        /* Desktop */
        .nav-desktop { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; width: 100%; }
        .nav-mobile { display: none; }

        @media (max-width: 768px) {
          .nav-desktop { display: none; }
          .nav-mobile {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            gap: 1.5rem;
          }
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
        display: "flex", alignItems: "center",
        padding: "0 2.5rem",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "0.5px solid rgba(0,0,0,0.08)",
      }}>

        {/* Desktop layout */}
        <div className="nav-desktop">
          <Link href="/" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300, fontSize: "clamp(18px, 5vw, 28px)", letterSpacing: "0.06em",
            color: "#0a0a0a", textDecoration: "none", lineHeight: 1,
          }}>
            Sina <em style={{ fontStyle: "italic", color: "#a07850" }}>Sharifi</em>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            <Dropdown label="Portfolio" href="/portfolio" items={PORTFOLIO_CATS} />
            <Dropdown label="Prints" href="/prints" items={PRINTS_CATS} />
            { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }].map(item => (
              <Link key={item.label} href={item.href} style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "13px", letterSpacing: "0.10em", textTransform: "uppercase",
                color: "#0a0a0a", fontWeight: 400, textDecoration: "none", transition: "opacity 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.45")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >{item.label}</Link>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
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
                  background: "#0a0a0a", color: "#fff", borderRadius: "50%",
                  width: "16px", height: "16px", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: "9px",
                }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile layout — all centered */}
        <div className="nav-mobile">
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "flex", flexDirection: "column", gap: "5px", cursor: "pointer", padding: "8px", background: "none", border: "none" }}>
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>

          <Link href="/" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300, fontSize: "22px", letterSpacing: "0.06em",
            color: "#0a0a0a", textDecoration: "none", lineHeight: 1,
          }}>
            Sina <em style={{ fontStyle: "italic", color: "#a07850" }}>Sharifi</em>
          </Link>

          <button onClick={openCart} style={{
            background: "none", border: "none", cursor: "pointer",
            position: "relative", padding: "4px", display: "flex", alignItems: "center",
            color: "#0a0a0a",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: "-2px", right: "-4px",
                background: "#0a0a0a", color: "#fff", borderRadius: "50%",
                width: "16px", height: "16px", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "9px",
              }}>{cartCount}</span>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {[
            { label: "Portfolio", href: "/portfolio" },
            { label: "Prints", href: "/prints" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
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
