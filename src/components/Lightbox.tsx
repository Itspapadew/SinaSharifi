"use client";
import { useEffect } from "react";
import Image from "next/image";

type LightboxProps = {
  src: string;
  title: string;
  location: string;
  onClose: () => void;
};

export default function Lightbox({ src, title, location, onClose }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(10,10,8,0.96)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        cursor: "zoom-out",
      }}
    >
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
          fontWeight: 300,
          lineHeight: 1,
          padding: "8px",
          opacity: 0.6,
          transition: "opacity 0.2s",
          fontFamily: "system-ui",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
      >
        ×
      </button>

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
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontSize: "14px",
          color: "#9a8f7e",
          margin: "4px 0 0",
        }}>
          {location}
        </p>
      </div>

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
      }}>
        Press Esc or click to close
      </p>
    </div>
  );
}
