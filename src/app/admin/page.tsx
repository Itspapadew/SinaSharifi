"use client";
import { useState } from "react";

type PhotoResult = {
  file: File;
  preview: string;
  status: "pending" | "analysing" | "done" | "error";
  title?: string;
  category?: string;
  location?: string;
  error?: string;
  copied?: boolean;
};

const categories = ["landscape", "wildlife", "portrait", "macro", "family"];

async function resizeAndEncode(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const maxSize = 1200;
      let w = img.width, h = img.height;
      if (w > maxSize || h > maxSize) {
        if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
        else { w = Math.round(w * maxSize / h); h = maxSize; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85).split(",")[1]);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function AdminPage() {
  const [photos, setPhotos] = useState<PhotoResult[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newPhotos: PhotoResult[] = Array.from(files)
      .filter(f => f.type.startsWith("image/"))
      .map(file => ({ file, preview: URL.createObjectURL(file), status: "pending" }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const analyseOne = async (index: number) => {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, status: "analysing" } : p));
    try {
      const base64 = await resizeAndEncode(photos[index].file);
      const res = await fetch("/api/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64, mimeType: "image/jpeg" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPhotos(prev => prev.map((p, i) => i === index ? {
        ...p, status: "done",
        title: data.title, category: data.category, location: data.location || "",
      } : p));
    } catch (e: any) {
      setPhotos(prev => prev.map((p, i) => i === index ? { ...p, status: "error", error: e.message } : p));
    }
  };

  const analyseAll = async () => {
    const pending = photos.map((p, i) => ({ p, i })).filter(({ p }) => p.status === "pending" || p.status === "error");
    setPhotos(prev => prev.map(p => p.status === "pending" ? { ...p, status: "analysing" } : p));
    await Promise.all(pending.map(({ i }) => analyseOne(i)));
  };

  const updateField = (index: number, field: string, value: string) => {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const copyMetadata = (index: number) => {
    const photo = photos[index];
    const text = `Title: ${photo.title}\nCategory: ${photo.category}\nLocation: ${photo.location}`;
    navigator.clipboard.writeText(text);
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, copied: true } : p));
    setTimeout(() => setPhotos(prev => prev.map((p, i) => i === index ? { ...p, copied: false } : p)), 2000);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f1", paddingTop: "var(--nav-height)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "40px", fontWeight: 300, color: "#1a1814", margin: 0 }}>
              AI Metadata Generator
            </h1>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "13px", color: "#9a9189", marginTop: "0.5rem" }}>
              Drop photos → AI generates title, category, location → Upload in Studio
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {photos.some(p => p.status === "pending" || p.status === "error") && (
              <button onClick={analyseAll} style={btnStyle("#1a1814")}>✨ Analyse All</button>
            )}
            
              <a href="/studio"
              target="_blank"
              style={{
                ...btnStyle("#a07850"),
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Open Studio &rarr;
            </a>
          </div>
        </div>

        {/* Workflow steps */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px",
          background: "var(--charcoal)", border: "0.5px solid var(--charcoal)",
          borderRadius: "4px", overflow: "hidden", marginBottom: "2rem",
        }}>
          {[
            { step: "1", label: "Drop photos below", sub: "Any number at once" },
            { step: "2", label: "Click Analyse All", sub: "AI fills title, category, location" },
            { step: "3", label: "Open Studio", sub: "Upload photo + paste metadata" },
          ].map(item => (
            <div key={item.step} style={{ background: "#f7f5f1", padding: "1rem 1.25rem" }}>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a07850", margin: "0 0 4px" }}>
                Step {item.step}
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "18px", color: "#1a1814", margin: "0 0 2px" }}>
                {item.label}
              </p>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", color: "#9a9189", margin: 0 }}>
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
          onClick={() => document.getElementById("file-input")?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#a07850" : "#dedad4"}`,
            borderRadius: "4px", padding: "3rem", textAlign: "center", cursor: "pointer",
            marginBottom: "2rem", background: dragOver ? "rgba(160,120,80,0.04)" : "transparent",
            transition: "all 0.2s",
          }}
        >
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "24px", color: "#9a9189", margin: 0 }}>
            Drop photos here or click to select
          </p>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#dedad4", marginTop: "0.5rem" }}>
            Any size · AI analyses a resized preview only
          </p>
          <input id="file-input" type="file" multiple accept="image/*" style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
        </div>

        {/* Photo grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
          {photos.map((photo, index) => (
            <div key={index} style={{ background: "#fff", border: "0.5px solid #dedad4", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ position: "relative", paddingBottom: "65%", background: "#e8e4de" }}>
                <img src={photo.preview} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={() => removePhoto(index)} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "16px" }}>×</button>
                {photo.status === "analysing" && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(247,245,241,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9189" }}>Analysing...</p>
                  </div>
                )}
              </div>

              <div style={{ padding: "1rem" }}>
                <input type="text" placeholder="Title" value={photo.title || ""} onChange={e => updateField(index, "title", e.target.value)} style={inputStyle} />
                <select value={photo.category || ""} onChange={e => updateField(index, "category", e.target.value)} style={{ ...inputStyle, marginTop: "8px" }}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                <input type="text" placeholder="Location" value={photo.location || ""} onChange={e => updateField(index, "location", e.target.value)} style={{ ...inputStyle, marginTop: "8px" }} />

                {photo.error && <p style={{ color: "#c97a5a", fontSize: "12px", margin: "8px 0 0" }}>{photo.error}</p>}

                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  {(photo.status === "pending" || photo.status === "error") && (
                    <button onClick={() => analyseOne(index)} style={btnStyle("#1a1814", true)}>✨ AI Fill</button>
                  )}
                  {photo.status === "done" && (
                    <>
                      <button onClick={() => analyseOne(index)} style={btnStyle("#6b6256", true)}>Re-analyse</button>
                      <button onClick={() => copyMetadata(index)} style={btnStyle(photo.copied ? "#a07850" : "#1a1814", true)}>
                        {photo.copied ? "✓ Copied" : "Copy metadata"}
                      </button>
                    </>
                  )}
                </div>

                {photo.status === "done" && (
                  
<a href="/studio/structure/photo;__new__"
                    target="_blank"
                    style={{
                      display: "block", marginTop: "8px", textAlign: "center",
                      padding: "8px", border: "0.5px solid #a07850", borderRadius: "2px",
                      fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px",
                      letterSpacing: "0.14em", textTransform: "uppercase", color: "#a07850",
                      textDecoration: "none",
                    }}
                  >
                    Open Studio to upload →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "20px", color: "#dedad4" }}>
              No photos yet — drop some above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const btnStyle = (bg: string, small?: boolean): React.CSSProperties => ({
  fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.14em",
  textTransform: "uppercase", color: "#f7f5f1", background: bg, border: "none",
  padding: small ? "8px 16px" : "10px 20px", borderRadius: "2px", cursor: "pointer",
  flex: small ? 1 : undefined,
});

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 12px", fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: "13px", border: "0.5px solid #dedad4", borderRadius: "2px",
  background: "#f7f5f1", color: "#1a1814", outline: "none", boxSizing: "border-box",
};
