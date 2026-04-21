"use client";
import Image from "next/image";
import { useState } from "react";

type Room = "living" | "bedroom" | "office";

type Props = {
  imageSrc: string;
  title: string;
  sizeLabel: string;
  roomStyle: Room;
  onRoomChange: (room: Room) => void;
};

const ROOMS: Record<Room, {
  label: string;
  photo: string;
  printTop: string;
  printLeft: string;
  printWidth: string;
}> = {
  living: {
    label: "Living room",
    photo: "/rooms/room-living.jpg",
    printTop: "8%",
    printLeft: "12%",
    printWidth: "38%",
  },
  bedroom: {
    label: "Bedroom",
    photo: "/rooms/room-bedroom.jpg",
    printTop: "6%",
    printLeft: "22%",
    printWidth: "55%",
  },
  office: {
    label: "Office",
    photo: "/rooms/room-office.jpg",
    printTop: "8%",
    printLeft: "52%",
    printWidth: "34%",
  },
};

const SIZE_MULTIPLIER: Record<string, number> = {
  '12×18"': 0.7,
  '16×24"': 0.85,
  '24×36"': 1.0,
  '30×45"': 1.15,
  '18×12"': 0.7,
  '24×16"': 0.85,
  '36×24"': 1.0,
  '45×30"': 1.15,
  '12×12"': 0.7,
  '20×20"': 0.85,
  '30×30"': 1.0,
  '40×40"': 1.15,
};

const isLandscape = (label: string) =>
  label.startsWith('18×') || label.startsWith('24×1') || label.startsWith('36×') || label.startsWith('45×');

export default function RoomVisualizer({ imageSrc, title, sizeLabel, roomStyle, onRoomChange }: Props) {
  const room = ROOMS[roomStyle];
  const multiplier = SIZE_MULTIPLIER[sizeLabel] ?? 1.0;
  const landscape = isLandscape(sizeLabel);

  const baseWidth = parseFloat(room.printWidth) * multiplier;
  const printWidth = `${Math.min(baseWidth, 55)}%`;
  const aspectRatio = landscape ? "3 / 2" : "2 / 3";

  return (
    <div>
      {/* Room tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
        {(Object.keys(ROOMS) as Room[]).map(key => (
          <button
            key={key}
            onClick={() => onRoomChange(key)}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "6px 14px", border: "0.5px solid",
              borderColor: roomStyle === key ? "#a07850" : "#dedad4",
              color: roomStyle === key ? "#a07850" : "#9a9189",
              background: roomStyle === key ? "rgba(160,120,80,0.06)" : "transparent",
              borderRadius: "2px", cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {ROOMS[key].label}
          </button>
        ))}
      </div>

      {/* Room photo with print overlay */}
      <div style={{
        position: "relative",
        width: "100%",
        borderRadius: "2px",
        overflow: "hidden",
        border: "0.5px solid var(--charcoal)",
      }}>
        {/* Room photo */}
        <Image
          src={room.photo}
          alt={room.label}
          width={1200}
          height={800}
          style={{ width: "100%", height: "auto", display: "block" }}
        />

        {/* Print overlay */}
        <div style={{
          position: "absolute",
          top: room.printTop,
          left: room.printLeft,
          width: printWidth,
          transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}>
          {/* Frame */}
          <div style={{
            position: "relative",
            width: "100%",
            aspectRatio,
            boxShadow: "2px 4px 20px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2)",
            border: "6px solid #f0ece4",
            outline: "1px solid rgba(0,0,0,0.1)",
          }}>
            {/* Mat */}
            <div style={{
              position: "absolute", inset: "6px",
              background: "#f7f5f1",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* Print image */}
              <div style={{ position: "absolute", inset: "10px", overflow: "hidden" }}>
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="300px"
                />
              </div>
            </div>

            {/* Frame glare */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px",
              background: "rgba(255,255,255,0.5)",
              pointerEvents: "none",
            }} />
          </div>

          {/* Shadow on wall */}
          <div style={{
            position: "absolute",
            bottom: "-8px", left: "5%", right: "5%", height: "12px",
            background: "rgba(0,0,0,0.15)",
            filter: "blur(6px)",
            borderRadius: "50%",
          }} />
        </div>
      </div>

      {/* Caption */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a9189", margin: 0 }}>
          {sizeLabel}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "13px", color: "#9a9189", margin: 0 }}>
          Approximate scale for reference
        </p>
      </div>
    </div>
  );
}
