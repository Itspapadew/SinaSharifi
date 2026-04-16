import PrintGrid from "@/components/PrintGrid";

export default function PrintsPage() {
  return (
    <>
      <header style={{ paddingTop: "calc(var(--nav-height) + 3rem)", paddingBottom: "2.5rem", paddingLeft: "2rem", paddingRight: "2rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", borderBottom: "0.5px solid var(--charcoal)" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(32px, 5vw, 56px)", color: "var(--linen)", lineHeight: 1, letterSpacing: "0.03em" }}>Prints</h1>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "16px", color: "var(--ash-light)", marginTop: "0.5rem" }}>Limited edition fine art prints — Balkans, Wildlife, Macro</p>
        </div>
      </header>
      <PrintGrid />
      <footer style={{ padding: "2rem", borderTop: "0.5px solid var(--charcoal)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "15px", color: "var(--ash)" }}>Sina <em>Sharifi</em></p>
        <span className="label" style={{ color: "var(--charcoal)" }}>© {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
