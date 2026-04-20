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
    wall: "#f0ece4",
    floor: "#c8b090",
    floorGrain: "rgba(0,0,0,0.04)",
    skirting: "#e4ddd4",
    light: "rgba(255,240,200,0.15)",
    shadow: "rgba(60,40,20,0.18)",
    furniture: true,
  },
  bedroom: {
    label: "Bedroom",
    wall: "#eae6e0",
    floor: "#b0a090",
    floorGrain: "rgba(0,0,0,0.03)",
    skirting: "#d8d4cc",
    light: "rgba(255,245,220,0.12)",
    shadow: "rgba(40,30,20,0.15)",
    furniture: false,
  },
  office: {
    label: "Office",
    wall: "#e8eae8",
    floor: "#909888",
    floorGrain: "rgba(0,0,0,0.04)",
    skirting: "#d0d4d0",
    light: "rgba(220,240,255,0.1)",
    shadow: "rgba(20,30,20,0.15)",
    furniture: false,
  },
};

const SIZE_CONFIG: Record<string, { scale: number; aspect: number }> = {
  '12×18"': { scale: 0.18, aspect: 0.667 },
  '16×24"': { scale: 0.24, aspect: 0.667 },
  '24×36"': { scale: 0.34, aspect: 0.667 },
  '30×45"': { scale: 0.42, aspect: 0.667 },
  '18×12"': { scale: 0.28, aspect: 1.5 },
  '24×16"': { scale: 0.36, aspect: 1.5 },
  '36×24"': { scale: 0.50, aspect: 1.5 },
  '45×30"': { scale: 0.62, aspect: 1.5 },
  '12×12"': { scale: 0.20, aspect: 1 },
  '20×20"': { scale: 0.30, aspect: 1 },
  '30×30"': { scale: 0.42, aspect: 1 },
  '40×40"': { scale: 0.54, aspect: 1 },
};

export default function RoomVisualizer({ imageSrc, title, sizeLabel, roomStyle, onRoomChange }: Props) {
  const room = ROOMS[roomStyle];
  const config = SIZE_CONFIG[sizeLabel] || { scale: 0.32, aspect: 1.5 };
  const W = 700;
  const H = 420;
  const printW = Math.round(W * config.scale);
  const printH = Math.round(printW / config.aspect);
  const printX = Math.round((W - printW) / 2);
  const printY = Math.round(H * 0.18);
  const floorY = Math.round(H * 0.78);

  return (
    <div>
      {/* Room selector */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
        {(Object.keys(ROOMS) as Array<keyof typeof ROOMS>).map(key => (
          <button key={key} onClick={() => onRoomChange(key)} style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "6px 14px", border: "0.5px solid",
            borderColor: roomStyle === key ? "#a07850" : "#dedad4",
            color: roomStyle === key ? "#a07850" : "#9a9189",
            background: roomStyle === key ? "rgba(160,120,80,0.06)" : "transparent",
            borderRadius: "2px", cursor: "pointer", transition: "all 0.2s",
          }}>
            {ROOMS[key].label}
          </button>
        ))}
      </div>

      {/* SVG Room Scene */}
      <div style={{ border: "0.5px solid var(--charcoal)", borderRadius: "2px", overflow: "hidden" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", display: "block" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.06)" />
              <stop offset="30%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.04)" />
            </linearGradient>
            <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
            </linearGradient>
            <linearGradient id="lightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={room.light} />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
            <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
            </linearGradient>
            <radialGradient id="printShadow" cx="50%" cy="100%" r="50%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <filter id="blur">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="softBlur">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
            <clipPath id="printClip">
              <rect x={printX + 10} y={printY + 10} width={printW - 20} height={printH - 20} />
            </clipPath>
          </defs>

          {/* Wall */}
          <rect x="0" y="0" width={W} height={floorY} fill={room.wall} />
          <rect x="0" y="0" width={W} height={floorY} fill="url(#wallGrad)" />
          <rect x="0" y="0" width={W} height={floorY} fill="url(#lightGrad)" />

          {/* Floor */}
          <rect x="0" y={floorY} width={W} height={H - floorY} fill={room.floor} />
          <rect x="0" y={floorY} width={W} height={H - floorY} fill="url(#floorGrad)" />

          {/* Floor boards */}
          {[0, 90, 180, 270, 360, 450, 540, 630].map(x => (
            <line key={x} x1={x} y1={floorY} x2={x + 60} y2={H} stroke={room.floorGrain} strokeWidth="1" />
          ))}
          <line x1="0" y1={floorY + 8} x2={W} y2={floorY + 8} stroke={room.floorGrain} strokeWidth="0.5" />
          <line x1="0" y1={floorY + 22} x2={W} y2={floorY + 22} stroke={room.floorGrain} strokeWidth="0.5" />

          {/* Baseboard */}
          <rect x="0" y={floorY - 6} width={W} height={8} fill={room.skirting} />
          <rect x="0" y={floorY - 6} width={W} height={1} fill="rgba(0,0,0,0.08)" />

          {/* Living room furniture silhouettes */}
          {roomStyle === 'living' && (
            <>
              {/* Sofa left side hint */}
              <rect x="0" y={floorY - 28} width="80" height="28" rx="2" fill="rgba(180,160,140,0.35)" />
              <rect x="0" y={floorY - 48} width="80" height="22" rx="2" fill="rgba(180,160,140,0.25)" />
              {/* Sofa right side hint */}
              <rect x={W - 80} y={floorY - 28} width="80" height="28" rx="2" fill="rgba(180,160,140,0.35)" />
              <rect x={W - 80} y={floorY - 48} width="80" height="22" rx="2" fill="rgba(180,160,140,0.25)" />
              {/* Small plant left */}
              <ellipse cx="55" cy={floorY - 55} rx="18" ry="22" fill="rgba(100,120,80,0.2)" />
              <rect x="50" y={floorY - 33} width="10" height="5" rx="1" fill="rgba(140,110,80,0.3)" />
              {/* Floor reflection */}
              <rect x={printX - 10} y={floorY + 2} width={printW + 20} height="30" fill="rgba(255,255,255,0.04)" />
            </>
          )}

          {roomStyle === 'bedroom' && (
            <>
              {/* Bedside tables */}
              <rect x="0" y={floorY - 20} width="50" height="20" rx="1" fill="rgba(160,140,120,0.3)" />
              <rect x={W - 50} y={floorY - 20} width="50" height="20" rx="1" fill="rgba(160,140,120,0.3)" />
              {/* Small lamp circles */}
              <circle cx="25" cy={floorY - 24} r="8" fill="rgba(255,220,150,0.2)" />
              <circle cx={W - 25} cy={floorY - 24} r="8" fill="rgba(255,220,150,0.2)" />
            </>
          )}

          {roomStyle === 'office' && (
            <>
              {/* Desk edge hint */}
              <rect x="0" y={floorY - 18} width="120" height="18" rx="1" fill="rgba(120,130,120,0.3)" />
              {/* Small plant */}
              <ellipse cx="90" cy={floorY - 32} rx="14" ry="16" fill="rgba(80,110,70,0.2)" />
            </>
          )}

          {/* Window light from top right */}
          <rect x={W - 120} y="0" width="120" height={floorY} fill="rgba(255,245,210,0.08)" />
          <line x1={W - 120} y1="0" x2={W - 120} y2={floorY} stroke="rgba(255,245,210,0.15)" strokeWidth="1" />

          {/* Print shadow on wall (cast shadow) */}
          <ellipse
            cx={printX + printW / 2 + 4}
            cy={printY + printH / 2}
            rx={printW / 2 + 8}
            ry={printH / 2 + 8}
            fill="rgba(0,0,0,0.08)"
            filter="url(#blur)"
          />

          {/* Frame outer (shadow side) */}
          <rect
            x={printX + 3}
            y={printY + 3}
            width={printW}
            height={printH}
            fill="rgba(0,0,0,0.12)"
            filter="url(#softBlur)"
          />

          {/* Frame */}
          <rect x={printX} y={printY} width={printW} height={printH} fill="#f0ece4" />

          {/* Mat border */}
          <rect x={printX + 8} y={printY + 8} width={printW - 16} height={printH - 16} fill="#f7f5f1" />

          {/* Print image */}
          <image
            href={imageSrc}
            x={printX + 16}
            y={printY + 16}
            width={printW - 32}
            height={printH - 32}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#printClip)"
          />

          {/* Frame highlight (light catches top-left edge) */}
          <rect x={printX} y={printY} width={printW} height="2" fill="rgba(255,255,255,0.6)" />
          <rect x={printX} y={printY} width="2" height={printH} fill="rgba(255,255,255,0.4)" />

          {/* Frame inner shadow */}
          <rect x={printX + 8} y={printY + 8} width={printW - 16} height="2" fill="rgba(0,0,0,0.06)" />
          <rect x={printX + 8} y={printY + 8} width="2" height={printH - 16} fill="rgba(0,0,0,0.04)" />

          {/* Floor shadow below print */}
          <ellipse
            cx={printX + printW / 2}
            cy={floorY + 4}
            rx={printW * 0.35}
            ry="6"
            fill="rgba(0,0,0,0.12)"
            filter="url(#blur)"
          />

          {/* Overall room vignette */}
          <rect x="0" y="0" width={W} height={H} fill="url(#shadowGrad)" opacity="0.3" />
        </svg>
      </div>

      {/* Size indicator */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", alignItems: "center" }}>
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a9189", margin: 0 }}>
          {sizeLabel} · approximate scale
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "13px", color: "#9a9189", margin: 0 }}>
          {roomStyle === 'living' ? 'Living room' : roomStyle === 'bedroom' ? 'Bedroom' : 'Office'}
        </p>
      </div>
    </div>
  );
}
