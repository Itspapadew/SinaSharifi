"use client";
import Image from "next/image";

type Props = {
  imageSrc: string;
  title: string;
  sizeLabel: string;
  roomStyle: "living" | "bedroom" | "office";
  onRoomChange: (room: "living" | "bedroom" | "office") => void;
};

const ROOMS = {
  living: {
    label: "Living room",
    wallColor: "#f0ece4",
    floorColor: "#c4a882",
    skirtingColor: "#dedad4",
    accent: "#e8e0d0",
  },
  bedroom: {
    label: "Bedroom",
    wallColor: "#e8e4dc",
    floorColor: "#b8a898",
    skirtingColor: "#d4d0c8",
    accent: "#dedad4",
  },
  office: {
    label: "Office",
    wallColor: "#e4e8e8",
    floorColor: "#9a9890",
    skirtingColor: "#cccec8",
    accent: "#d4d8d8",
  },
};

const SIZE_SCALE: Record<string, number> = {
  '12×18"': 0.22,
  '16×24"': 0.30,
  '24×36"': 0.42,
  '30×45"': 0.52,
  '18×12"': 0.30,
  '24×16"': 0.40,
  '36×24"': 0.55,
  '45×30"': 0.65,
  '12×12"': 0.22,
  '20×20"': 0.34,
  '30×30"': 0.46,
  '40×40"': 0.58,
};

export default function RoomVisualizer({ imageSrc, title, sizeLabel, roomStyle, onRoomChange }: Props) {
  const room = ROOMS[roomStyle];
  const scale = SIZE_SCALE[sizeLabel] || 0.35;

  return (
    <div>
      {/* Room selector */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
        {(Object.keys(ROOMS) as Array<keyof typeof ROOMS>).map(key => (
          <button
            key={key}
            onClick={() => onRoomChange(key)}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "6px 12px", border: "0.5px solid",
              borderColor: roomStyle === key ? "#a07850" : "var(--charcoal)",
              color: roomStyle === key ? "#a07850" : "#9a9189",
              background: roomStyle === key ? "rgba(160,120,80,0.06)" : "transparent",
              borderRadius: "2px", cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {ROOMS[key].label}
          </button>
        ))}
      </div>

      {/* Room scene */}
      <div style={{
        position: "relative",
        width: "100%",
        paddingBottom: "60%",
        background: room.wallColor,
        overflow: "hidden",
        borderRadius: "2px",
        border: "0.5px solid var(--charcoal)",
        transition: "background 0.4s ease",
      }}>

        {/* Wall texture — subtle vertical lines */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.012) 0px, transparent 1px, transparent 40px)`,
          pointerEvents: "none",
        }} />

        {/* Ceiling shadow */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "12%",
          background: `linear-gradient(to bottom, rgba(0,0,0,0.08), transparent)`,
          pointerEvents: "none",
        }} />

        {/* Floor */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "18%",
          background: room.floorColor,
          transition: "background 0.4s ease",
        }}>
          {/* Floor reflection */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "30%",
            background: `linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)`,
          }} />
          {/* Floor boards */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, transparent 1px, transparent 120px)`,
          }} />
        </div>

        {/* Baseboard */}
        <div style={{
          position: "absolute", bottom: "18%", left: 0, right: 0, height: "2%",
          background: room.skirtingColor,
          transition: "background 0.4s ease",
          borderTop: "0.5px solid rgba(0,0,0,0.08)",
        }} />

        {/* Ambient light from left */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 20% 40%, rgba(255,248,230,0.2) 0%, transparent 60%)`,
          pointerEvents: "none",
        }} />

        {/* Print on wall */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: `translate(-50%, -58%) scale(${scale})`,
          transformOrigin: "center center",
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}>
          {/* Frame */}
          <div style={{
            padding: "12px",
            background: "#f7f5f1",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)",
            border: "0.5px solid rgba(0,0,0,0.1)",
          }}>
            {/* Mat */}
            <div style={{ padding: "20px", background: "#f7f5f1" }}>
              <div style={{ position: "relative", width: "500px", height: "340px" }}>
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="500px"
                />
              </div>
            </div>
          </div>

          {/* Frame shadow on wall */}
          <div style={{
            position: "absolute",
            bottom: "-20px", left: "4%", right: "4%", height: "20px",
            background: "rgba(0,0,0,0.12)",
            filter: "blur(8px)",
            borderRadius: "50%",
          }} />
        </div>

        {/* Size label */}
        <div style={{
          position: "absolute",
          bottom: "22%",
          right: "1rem",
        }}>
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase",
            color: "rgba(0,0,0,0.3)", margin: 0,
          }}>
            {sizeLabel}
          </p>
        </div>
      </div>

      <p style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "10px", letterSpacing: "0.12em",
        color: "#9a9189", textAlign: "center",
        marginTop: "0.5rem",
      }}>
        Approximate scale for reference
      </p>
    </div>
  );
}
