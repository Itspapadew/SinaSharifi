"use client";
import { useState } from "react";

export default function AutoFill() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch (e) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "6rem 2rem" }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "36px", fontWeight: 300, color: "#1a1814", marginBottom: "0.5rem" }}>
        AI Auto-fill
      </h1>
      <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#9a9189", marginBottom: "2rem" }}>
        Paste a Sanity image URL, get back title, category and location suggestions.
      </p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://cdn.sanity.io/images/..."
          style={{
            flex: 1,
            padding: "12px 16px",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "13px",
            border: "0.5px solid var(--charcoal)",
            borderRadius: "2px",
            background: "#f7f5f1",
            color: "#1a1814",
            outline: "none",
          }}
        />
        <button
          onClick={analyze}
          disabled={loading || !url}
          style={{
            padding: "12px 24px",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#f7f5f1",
            background: loading ? "#9a9189" : "#1a1814",
            border: "none",
            borderRadius: "2px",
            cursor: loading ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Analysing..." : "Analyse"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#c97a5a", fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px" }}>{error}</p>
      )}

      {result && (
        <div style={{ border: "0.5px solid var(--charcoal)", borderRadius: "2px", overflow: "hidden" }}>
          {[
            { label: "Title", value: result.title },
            { label: "Category", value: result.category },
            { label: "Location", value: result.location || "Unknown" },
          ].map(item => (
            <div key={item.label} style={{
              padding: "1rem 1.25rem",
              borderBottom: "0.5px solid var(--charcoal)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189" }}>
                {item.label}
              </span>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", color: "#1a1814" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
