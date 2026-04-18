import Link from 'next/link'

export const metadata = {
  title: 'About — Sina Sharifi',
  description: 'The story behind the lens.',
}

export default function About() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>

      {/* Hero */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "70vh",
      }}>
        {/* Photo placeholder — swap with your portrait */}
        <div style={{
          background: "#e8e4de",
          position: "relative",
          minHeight: "500px",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <p style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#9a9189",
            }}>
              Your portrait here
            </p>
          </div>
        </div>

        {/* Text */}
        <div style={{
          padding: "5rem 4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderLeft: "0.5px solid var(--charcoal)",
        }}>
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9a9189",
            margin: "0 0 2rem",
          }}>
            About
          </p>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 300,
            color: "#1a1814",
            lineHeight: 1.1,
            margin: "0 0 2rem",
            letterSpacing: "0.02em",
          }}>
            Sina <em style={{ color: "#a07850" }}>Sharifi</em>
          </h1>

          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "19px",
            fontWeight: 300,
            color: "#3a3530",
            lineHeight: 1.8,
            maxWidth: "520px",
          }}>
            <p style={{ margin: "0 0 1.5rem" }}>
              I was born in Quetta, Pakistan, to an Afghan family with Hazara and Iranian Baloch roots. I have never had one home.
            </p>
            <p style={{ margin: "0 0 1.5rem" }}>
              At eight, my family left Pakistan for Iran, then Azerbaijan, where we waited nearly a decade before arriving in California. In 2018 we moved to Germany, where both my children were born. In 2019 my wife and I chose to take the road permanently. We have been moving ever since.
            </p>
            <p style={{ margin: "0 0 1.5rem" }}>
              A camera came into my life in 2012 as a graduation gift. It was never about money or an audience — it was a way of seeing. Each lens changes the view. A wide angle humbles you. A macro reveals what most people walk past. A portrait brings you face to face with a stranger.
            </p>
            <p style={{ margin: "0 0 1.5rem" }}>
              People move me the most. Photography gave me permission to approach them — and through them, to understand the world a little better.
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "20px",
              color: "#1a1814",
              margin: "2rem 0 0",
              lineHeight: 1.6,
            }}>
              I want the person who finds my work for the first time to feel three things.<br />
              Happy. Calm. Blessed.
            </p>
          </div>
        </div>
      </div>

      {/* Currently */}
      <div style={{
        padding: "4rem 2.5rem",
        borderTop: "0.5px solid var(--charcoal)",
        display: "flex",
        gap: "4rem",
        flexWrap: "wrap",
      }}>
        {[
          { label: "Currently based in", value: "Kotor, Montenegro" },
          { label: "Shooting since", value: "2012" },
          { label: "Camera", value: "Nikon Z8" },
          { label: "Favourite light", value: "Dusk" },
        ].map(item => (
          <div key={item.label}>
            <p style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#9a9189",
              margin: "0 0 6px",
            }}>
              {item.label}
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "20px",
              color: "#1a1814",
              margin: 0,
            }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        padding: "4rem 2.5rem",
        borderTop: "0.5px solid var(--charcoal)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1.5rem",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(20px, 3vw, 32px)",
          fontWeight: 300,
          color: "#1a1814",
          margin: 0,
          maxWidth: "500px",
          lineHeight: 1.3,
        }}>
          The work is available as limited edition fine art prints.
        </p>
        <Link href="/prints" style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#1a1814",
          border: "0.5px solid #1a1814",
          padding: "14px 32px",
          borderRadius: "2px",
          textDecoration: "none",
          fontWeight: 300,
        }}>
          Shop Prints
        </Link>
      </div>

      {/* Footer */}
      <footer style={{
        padding: "2rem 2.5rem",
        borderTop: "0.5px solid var(--charcoal)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "15px",
          color: "#9a9189",
          margin: 0,
        }}>
          Sina <em>Sharifi</em>
        </p>
        <span style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#dedad4",
        }}>
          © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}
