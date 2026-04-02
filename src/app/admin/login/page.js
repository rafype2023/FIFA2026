"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    if (data.success) {
      router.push("/admin");
    } else {
      setError(data.message || "Código incorrecto. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
      <div className="glass-panel" style={{ maxWidth: "420px", width: "100%", padding: "3rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
        <h1 style={{ color: "var(--primary)", marginBottom: "0.5rem", fontSize: "1.8rem" }}>Área de Administrador</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>FIFA 2026 — Acceso Restringido</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: "left" }}>
            <label>Código de Acceso</label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingresa el código..."
              required
              autoFocus
            />
          </div>

          {error && (
            <p style={{ color: "#ff6b6b", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
