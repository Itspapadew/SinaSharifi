"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .nav-links { display: flex; align-items: center; gap: 2.5rem; }
        .nav-hamburger { display: none; }
        .nav-mobile-menu { display: none; }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-hamburger { display: flex; flex-direction: column; gap: 5px; cursor: pointer; padding: 8px; background: none; border: none; }
          .nav-hamburger span { display: block; width: 22px; height: 1px; background: #1a1814; transition: all 0.3s; }
          .nav-mobile-menu {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: var(--nav-height);
            left: 0; right: 0;
            background: rgba(247,245,241,0.98);
            backdrop-filter: blur(12px);
            padding: 2rem 2.5rem;
            gap: 1.5rem;
            border-bottom: 0.5px solid var(--charcoal);
            z-index: 99;
          }
        }
      `}</style>

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

        {/* Desktop links */}
        <div className="nav-links">
          {[
            { label: "Portfolio", href: "/portfolio" },
            { label: "Prints", href: "/prints" },
            { label: "About", href: "/about" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189", fontWeight: 300, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#a07850")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9a9189")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          {[
            { label: "Portfolio", href: "/portfolio" },
            { label: "Prints", href: "/prints" },
            { label: "About", href: "/about" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1814", textDecoration: "none" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
