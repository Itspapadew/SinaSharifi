"use client";
import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async () => {
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName }),
      });
      if (res.ok) setStatus("done");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const input: React.CSSProperties = {
    flex: 1, padding: "14px 0", background: "transparent",
    border: "none", borderBottom: "0.5px solid #e0e0e0",
    fontFamily: "'Inter', system-ui, sans-serif", fontSize: "14px",
    color: "#111", outline: "none", minWidth: 0,
  };

  return (
    <div style={{ padding: "5rem 2.5rem", borderTop: "0.5px solid #e0e0e0", background: "#fff" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9189", margin: "0 0 1rem" }}>
          New work, first
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "#111", margin: "0 0 0.75rem", lineHeight: 1.1 }}>
          Join the list.
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "18px", color: "#9a9189", margin: "0 0 2.5rem" }}>
          Be the first to see new prints — and get early access before they go public.
        </p>

        {status === "done" ? (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "22px", color: "#a07850" }}>
            You're on the list. Thank you.
          </p>
        ) : (
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <input
              style={input}
              placeholder="First name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <input
              style={{ ...input, flex: 2 }}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              style={{
                padding: "14px 28px", background: "#111", color: "#fff",
                border: "none", cursor: "pointer",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase",
                borderRadius: "2px", whiteSpace: "nowrap",
                opacity: status === "loading" ? 0.6 : 1,
              }}
            >
              {status === "loading" ? "..." : "Notify me"}
            </button>
          </div>
        )}
        {status === "error" && (
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#c0392b", marginTop: "1rem" }}>
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </div>
  );
}
