"use client";
import React, { useState } from "react";

export default function CopyEmailsButton({ emails }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!emails) return;
    try {
      await navigator.clipboard.writeText(emails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <h2 style={{ color: "var(--primary)", margin: 0, fontSize: "1.3rem" }}>
          📧 Lista de Correos de Participantes
        </h2>
        <button
          onClick={handleCopy}
          className="btn-primary"
          style={{ padding: "8px 16px", fontSize: "0.9rem" }}
          disabled={!emails}
        >
          {copied ? "¡Copiado! ✓" : "Copiar todos los correos"}
        </button>
      </div>
      <textarea
        readOnly
        value={emails || "No hay correos registrados."}
        rows={3}
        onClick={(e) => e.target.select()}
        style={{
          width: "100%",
          background: "rgba(0,0,0,0.3)",
          border: "1px solid var(--border-color)",
          color: "var(--text-main)",
          padding: "12px",
          borderRadius: "8px",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          resize: "none",
          cursor: "text"
        }}
      />
      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.5rem 0 0 0" }}>
        Los correos están separados por comas y listos para copiar y pegar en tu cliente de correo (Gmail, Outlook, etc.).
      </p>
    </div>
  );
}
