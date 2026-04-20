"use client";
import { useEffect, useRef, useState } from "react";

type Country = {
  name: string;
  slug: string;
};

const VISITED: Record<string, Country> = {
  "300": { name: "Greece", slug: "greece" },
  "620": { name: "Portugal", slug: "portugal" },
  "724": { name: "Spain", slug: "spain" },
  "840": { name: "United States", slug: "usa" },
  "276": { name: "Germany", slug: "germany" },
  "826": { name: "United Kingdom", slug: "uk" },
  "380": { name: "Italy", slug: "italy" },
  "499": { name: "Montenegro", slug: "montenegro" },
};

export default function WorldMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<Country | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [d3, topojson, world] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/d3@7/+esm' as any),
        import('https://cdn.jsdelivr.net/npm/topojson-client@3/+esm' as any),
        fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json()),
      ]);

      const svg = d3.select(svgRef.current);
      const projection = d3.geoNaturalEarth1().scale(153).translate([480, 230]);
      const path = d3.geoPath().projection(projection);
      const countries = topojson.feature(world, world.objects.countries);

      svg.selectAll('path')
        .data(countries.features)
        .join('path')
        .attr('d', path)
        .attr('fill', (d: any) => {
          const id = String(d.id).padStart(3, '0');
          return VISITED[id] ? '#a07850' : '#2a2520';
        })
        .attr('stroke', '#1a1814')
        .attr('stroke-width', 0.5)
        .style('cursor', (d: any) => VISITED[String(d.id).padStart(3, '0')] ? 'pointer' : 'default')
        .on('mouseenter', function(this: any, _: any, d: any) {
          const id = String(d.id).padStart(3, '0');
          if (VISITED[id]) d3.select(this).attr('fill', '#c49560');
        })
        .on('mouseleave', function(this: any, _: any, d: any) {
          const id = String(d.id).padStart(3, '0');
          if (VISITED[id]) d3.select(this).attr('fill', '#a07850');
        })
        .on('click', (_: any, d: any) => {
          const id = String(d.id).padStart(3, '0');
          if (VISITED[id]) setSelected(VISITED[id]);
        });

      setLoaded(true);
    };

    load().catch(console.error);
  }, []);

  const linkStyle: React.CSSProperties = {
    background: "none",
    border: "0.5px solid #a07850",
    color: "#a07850",
    padding: "10px 24px",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    cursor: "pointer",
    borderRadius: "2px",
    textDecoration: "none",
    display: "inline-block",
  };

  const closeStyle: React.CSSProperties = {
    background: "none",
    border: "0.5px solid #2a2520",
    color: "#6b6256",
    padding: "10px 20px",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    cursor: "pointer",
    borderRadius: "2px",
  };

  return (
    <div style={{ background: "#1a1814", marginTop: "3px" }}>
      <div style={{ padding: "3rem 2.5rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b6256", margin: "0 0 8px" }}>
            The journey
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#f7f5f1", margin: 0, lineHeight: 1.1 }}>
            The world, <em style={{ color: "#a07850" }}>witnessed.</em>
          </h2>
        </div>
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#6b6256", letterSpacing: "0.08em" }}>
          {Object.keys(VISITED).length} countries · Click to explore
        </p>
      </div>

      <div style={{ padding: "0 1rem" }}>
        <svg
          ref={svgRef}
          viewBox="0 0 960 460"
          style={{ width: "100%", display: "block", opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}
        />
      </div>

      <div style={{ padding: "0.75rem 2.5rem", display: "flex", gap: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#a07850" }} />
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#6b6256" }}>Photographed</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#2a2520" }} />
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#6b6256" }}>Not yet</span>
        </div>
      </div>

      {selected && (
        <div style={{ borderTop: "0.5px solid #2a2520", padding: "1.5rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "28px", fontWeight: 300, color: "#f7f5f1", margin: 0 }}>
              {selected.name}
            </p>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a07850", margin: "4px 0 0" }}>
              View photographs from this country
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => setSelected(null)} style={closeStyle}>
              Close
            </button>
            <a href={"/portfolio?country=" + selected.slug} style={linkStyle}>
              View gallery
            </a>
          </div>
        </div>
      )}

      <div style={{ padding: "2rem 2.5rem", borderTop: "0.5px solid #2a2520" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", color: "#6b6256", margin: 0, fontStyle: "italic" }}>
          More countries coming as the journey continues.
        </p>
      </div>
    </div>
  );
}
