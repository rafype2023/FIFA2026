"use client";
import { useState } from "react";

export default function PointsInfographic() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div
        onClick={() => setOpen(true)}
        style={{
          display: "inline-block",
          cursor: "pointer",
          borderRadius: "12px",
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,0.15)",
          transition: "all 0.2s ease",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
        title="Ver Sistema de Puntuación"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/points.png"
          alt="Sistema de Puntuación FIFA 2026"
          style={{ width: "220px", display: "block" }}
        />
        <div style={{
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          textAlign: "center",
          padding: "6px",
          fontSize: "0.78rem",
        }}>
          🔍 Ver Sistema de Puntuación
        </div>
      </div>

      {/* Lightbox overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            cursor: "zoom-out",
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: "-14px",
                right: "-14px",
                background: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                fontSize: "1.1rem",
                cursor: "pointer",
                zIndex: 10000,
                lineHeight: "32px",
                textAlign: "center",
              }}
            >✕</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/points.png"
              alt="Sistema de Puntuación FIFA 2026"
              style={{
                maxWidth: "90vw",
                maxHeight: "88vh",
                borderRadius: "12px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                display: "block",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
