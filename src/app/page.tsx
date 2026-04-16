import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const images = [
    { src: "/prints/hero.jpg", slug: "kotor-dawn", title: "Kotor Dawn", location: "Kotor, Montenegro", aspect: "landscape" },
    { src: "/prints/portrait.jpg", slug: "adriatic-fisherman", title: "Kotor Rooftops", location: "Kotor, Montenegro", aspect: "portrait" },
    { src: "/prints/wide.jpg", slug: "old-city-gate", title: "Atlantic Pool", location: "Azenhas do Mar, Portugal", aspect: "landscape" },
    { src: "/prints/medium-1.jpg", slug: "red-fox-snowfield", title: "City on the Hill", location: "Kotor, Montenegro", aspect: "landscape" },
    { src: "/prints/small-1.jpg", slug: "moth-wing", title: "The Visitor", location: "Montenegro", aspect: "portrait" },
    { src: "/prints/small-2.jpg", slug: "dew-on-spider", title: "Bay of Kotor", location: "Kotor, Montenegro", aspect: "landscape" },
  ];

  const [hero, portrait, wide, medium, small1, small2] = images;

  return (
    <>
      <div style={{ height: "var(--nav-height)" }} />

      <section style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>

        {/* Row 1: hero large + portrait */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3px", marginBottom: "3px" }}>

          <Link href={`/prints/${hero.slug}`} style={{ display: "block", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", paddingBottom: "66%" }}>
              <Image
                src={hero.src}
                alt={hero.title}
                fill
                style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "#f0ece4", margin: 0 }}>{hero.title}</p>
                <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "13px", color: "rgba(240,236,228,0.7)", margin: "2px 0 0" }}>{hero.location}</p>
              </div>
            </div>
          </Link>

          <Link href={`/prints/${portrait.slug}`} style={{ display: "block", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", paddingBottom: "132%" }}>
              <Image
                src={portrait.src}
                alt={portrait.title}
                fill
                style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "17px", color: "#f0ece4", margin: 0 }}>{portrait.title}</p>
                <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "12px", color: "rgba(240,236,228,0.7)", margin: "2px 0 0" }}>{portrait.location}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Row 2: medium + wide */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3px", marginBottom: "3px" }}>

          <Link href={`/prints/${medium.slug}`} style={{ display: "block", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", paddingBottom: "100%" }}>
              <Image
                src={medium.src}
                alt={medium.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "17px", color: "#f0ece4", margin: 0 }}>{medium.title}</p>
                <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "12px", color: "rgba(240,236,228,0.7)", margin: "2px 0 0" }}>{medium.location}</p>
              </div>
            </div>
          </Link>

          <Link href={`/prints/${wide.slug}`} style={{ display: "block", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", paddingBottom: "50%" }}>
              <Image
                src={wide.src}
                alt={wide.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "17px", color: "#f0ece4", margin: 0 }}>{wide.title}</p>
                <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "12px", color: "rgba(240,236,228,0.7)", margin: "2px 0 0" }}>{wide.location}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Row 3: two smalls */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px" }}>

          <Link href={`/prints/${small1.slug}`} style={{ display: "block", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", paddingBottom: "75%" }}>
              <Image
                src={small1.src}
                alt={small1.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "17px", color: "#f0ece4", margin: 0 }}>{small1.title}</p>
                <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "12px", color: "rgba(240,236,228,0.7)", margin: "2px 0 0" }}>{small1.location}</p>
              </div>
            </div>
          </Link>

          <Link href={`/prints/${small2.slug}`} style={{ display: "block", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", paddingBottom: "75%" }}>
              <Image
                src={small2.src}
                alt={small2.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "17px", color: "#f0ece4", margin: 0 }}>{small2.title}</p>
                <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "12px", color: "rgba(240,236,228,0.7)", margin: "2px 0 0" }}>{small2.location}</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Shop CTA */}
      <div style={{ textAlign: "center", padding: "4rem 2rem", borderTop: "0.5px solid var(--charcoal)", marginTop: "3rem" }}>
        <p className="label" style={{ marginBottom: "1rem", color: "var(--ash)" }}>Limited edition fine art prints</p>
        <Link href="/prints" style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--linen)", border: "0.5px solid var(--linen)", padding: "14px 40px", borderRadius: "2px", display: "inline-block" }}>
          Shop Prints
        </Link>
      </div>

      <footer style={{ padding: "2rem", borderTop: "0.5px solid var(--charcoal)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "15px", color: "var(--ash)" }}>Sina <em>Sharifi</em></p>
        <div style={{ display: "flex", gap: "2rem" }}>
          <Link href="/prints" className="label" style={{ color: "var(--ash)" }}>Prints</Link>
          <Link href="/about" className="label" style={{ color: "var(--ash)" }}>About</Link>
          <a href="mailto:hello@sinasharifi.com" className="label" style={{ color: "var(--ash)" }}>Contact</a>
          <span className="label" style={{ color: "var(--charcoal)" }}>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </>
  );
}
