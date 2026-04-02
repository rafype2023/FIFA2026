"use client";
export default function PrintButton() {
  return (
    <div className="no-print" style={{ textAlign: "right", padding: "0.5rem 2rem 0" }}>
      <button
        className="toolbar-btn-primary"
        onClick={() => window.print()}
      >
        🖨️ Imprimir / Guardar PDF
      </button>
    </div>
  );
}
