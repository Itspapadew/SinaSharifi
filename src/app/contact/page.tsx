"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
    } catch {
      // fallback: open mailto
      window.location.href = `mailto:itssinasharifi@gmail.com?subject=Message from ${form.name}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${form.email}`;
    } finally {
      setSending(false);
    }
  };

  const input: React.CSSProperties = {
    width: "100%", padding: "14px 0",
    fontFamily: "'Inter', system-ui, sans-serif", fontSize: "15px",
    border: "none", borderBottom: "0.5px solid #e0e0e0",
    background: "transparent", color: "#111", outline: "none",
    borderRadius: 0,
  };

  return (
    <div style={{ paddingTop: "var(--nav-height)", minHeight: "100vh", background: "#fff" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "6rem 2.5rem" }}>

        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9189", marginBottom: "1.5rem" }}>Get in touch</p>

        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 600, color: "#111", lineHeight: 1.05, marginBottom: "1rem" }}>
          Let's talk.
        </h1>

        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "20px", color: "#9a9189", marginBottom: "4rem", lineHeight: 1.6 }}>
          For print enquiries, licensing, or commercial projects — I'd love to hear from you.
        </p>

        {sent ? (
          <div style={{ padding: "3rem 0" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "26px", fontWeight: 300, color: "#111" }}>
              Message sent. I'll be in touch soon.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <label style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189" }}>Name</label>
              <input
                style={input}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div>
              <label style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189" }}>Email</label>
              <input
                style={input}
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9a9189" }}>Message</label>
              <textarea
                style={{ ...input, minHeight: "140px", resize: "vertical" }}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Tell me about your project..."
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={sending}
              style={{
                alignSelf: "flex-start",
                padding: "14px 36px",
                background: "#111", color: "#fff",
                border: "none", cursor: sending ? "wait" : "pointer",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase",
                borderRadius: "2px", transition: "opacity 0.2s",
                opacity: sending ? 0.6 : 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = sending ? "0.6" : "1")}
            >
              {sending ? "Sending..." : "Send message"}
            </button>

            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#9a9189" }}>
              Or email directly: <a href="mailto:itssinasharifi@gmail.com" style={{ color: "#a07850" }}>itssinasharifi@gmail.com</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
