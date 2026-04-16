"use client";
import { useEffect } from "react";
import Image from "next/image";

type LightboxProps = {
  src: string;
  title: string;
  location: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  current?: number;
  total?: number;
};

export default function Lightbox({ src, title, location, onClose, onPrev, onNext, current, total }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(10,10,8,0.97)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        cursor: "zoom-out",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "2rem",
          background: "none",
          border: "none",
          color: "#f0ece4",
          fontSize: "28px",
          cursor: "pointer",
          opacity: 0.5,
          fontFamily: "system-ui",
          padding: "8px",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}
      >×</button>

      {/* Counter */}
      {total && current !== undefined && (
        <p style={{
          position: "absolute",
          top: "1.75rem",
          left: "2rem",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "11px",
          letterSpacing: "0.14em",
          color: "#6b6256",
          margin: 0,
        }}>
          {current + 1} / {total}
        </p>
      )}

      {/* Image */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "82vh",
          cursor: "default",
        }}
      >
        <Image
          src={src}
          alt={title}
          width={1800}
          height={1200}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "82vh",
            objectFit: "contain",
            display: "block",
          }}
          priority
        />
      </div>

      {/* Caption */}
      <div
        onClick={e => e.stopPropagation()}
        style={{ marginTop: "1.5rem", textAlign: "center" }}
      >
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "20px",
          fontWeight: 300,
          color: "#f0ece4",
          margin: 0,
          letterSpacing: "0.03em",
        }}>
          {title}
        </p>
        {location && (
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: "14px",
            color: "#9a8f7e",
            margin: "4px 0 0",
          }}>
            {location}
          </p>
        )}
      </div>

      {/* Prev arrow */}
      {onPrev && (
        <button
          onClick={e => { e.stopPropagation(); onPrev(); }}
          style={{
            position: "absolute",
            left: "1.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "0.5px solid rgba(240,236,228,0.15)",
            color: "#f0ece4",
            width: "48px",
            height: "48px",
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "2px",
            transition: "all 0.2s",
            opacity: 0.6,
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = "rgba(240,236,228,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.borderColor = "rgba(240,236,228,0.15)"; }}
        >←</button>
      )}

      {/* Next arrow */}
      {onNext && (
        <button
          onClick={e => { e.stopPropagation(); onNext(); }}
          style={{
            position: "absolute",
            right: "1.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "0.5px solid rgba(240,236,228,0.15)",
            color: "#f0ece4",
            width: "48px",
            height: "48px",
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "2px",
            transition: "all 0.2s",
            opacity: 0.6,
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = "rgba(240,236,228,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.borderColor = "rgba(240,236,228,0.15)"; }}
        >→</button>
      )}

      {/* Hint */}
      <p style={{
        position: "absolute",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "10px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#3a3530",
        margin: 0,
        whiteSpace: "nowrap",
      }}>
        ← → navigate · Esc to close
      </p>
    </div>
  );
}
