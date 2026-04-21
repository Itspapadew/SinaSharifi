"use client";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={closeCart}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(10,10,8,0.5)",
            backdropFilter: "blur(4px)",
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201,
        width: "min(480px, 100vw)",
        background: "#ffffff",
        borderLeft: "0.5px solid var(--charcoal)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        display: "flex", flexDirection: "column",
        overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{
          padding: "1.5rem 2rem",
          borderBottom: "0.5px solid var(--charcoal)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, background: "#ffffff", zIndex: 1,
        }}>
          <div>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189", margin: 0 }}>
              Your cart
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "22px", color: "#1a1814", margin: "2px 0 0" }}>
              {count()} {count() === 1 ? "item" : "items"}
            </p>
          </div>
          <button onClick={closeCart} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "24px", color: "#9a9189", padding: "8px" }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, padding: "1.5rem 2rem" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "22px", color: "#9a9189" }}>
                Your cart is empty
              </p>
              <button onClick={closeCart} style={{
                marginTop: "1rem", fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase",
                color: "#a07850", background: "none", border: "none", cursor: "pointer",
              }}>
                Continue browsing →
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} style={{
                display: "grid", gridTemplateColumns: "80px 1fr",
                gap: "1rem", marginBottom: "1.5rem",
                paddingBottom: "1.5rem", borderBottom: "0.5px solid var(--charcoal)",
              }}>
                <div style={{ position: "relative", height: "80px", background: "#e8e4de", overflow: "hidden" }}>
                  <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: "cover" }} sizes="80px" />
                </div>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", color: "#1a1814", margin: 0 }}>
                    {item.title}
                  </p>
                  <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: "4px 0 0", letterSpacing: "0.06em" }}>
                    {item.size} · {item.paper}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: "none", border: "0.5px solid var(--charcoal)", width: "28px", height: "28px", cursor: "pointer", fontSize: "16px", color: "#6b6256", borderRadius: "2px" }}>−</button>
                      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#1a1814" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: "none", border: "0.5px solid var(--charcoal)", width: "28px", height: "28px", cursor: "pointer", fontSize: "16px", color: "#6b6256", borderRadius: "2px" }}>+</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "20px", color: "#a07850", margin: 0 }}>
                        ${item.price * item.quantity}
                      </p>
                      <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9a9189", fontSize: "16px", padding: "4px" }}>×</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: "1.5rem 2rem",
            borderTop: "0.5px solid var(--charcoal)",
            position: "sticky", bottom: 0, background: "#ffffff",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189", margin: 0 }}>Total</p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "28px", color: "#1a1814", margin: 0 }}>${total()}</p>
            </div>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: "0 0 1rem", textAlign: "center" }}>
              Shipping calculated at checkout
            </p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: "100%", padding: "16px",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase",
                color: "#f7f5f1", background: loading ? "#9a9189" : "#1a1814",
                border: "none", borderRadius: "2px", cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
