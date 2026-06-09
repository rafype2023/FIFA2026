"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ChartsDashboard({ 
  top6R32Winners, 
  top6R32Qualified,
  top6Champions = [],
  top6RunnersUp = [],
  top6ThirdPlaces = []
}) {
  const [activeTab, setActiveTab] = useState("winners");
  const [animate, setAnimate] = useState(false);

  // Trigger animation after mounting
  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const currentData = (() => {
    switch (activeTab) {
      case "winners": return top6R32Winners;
      case "qualified": return top6R32Qualified;
      case "champions": return top6Champions;
      case "runners": return top6RunnersUp;
      case "third": return top6ThirdPlaces;
      default: return top6R32Winners;
    }
  })();

  const maxVal = currentData.length > 0 ? Math.max(...currentData.map(([_, count]) => count), 1) : 1;

  const getHeadingText = () => {
    switch (activeTab) {
      case "winners":
        return "Top 6 Equipos Más Seleccionados para Ganar en la Ronda de 32";
      case "qualified":
        return "Top 6 Equipos Más Seleccionados para Clasificar en la Fase de Grupos";
      case "champions":
        return "Top 6 Equipos Más Seleccionados para ser Campeón 🏆";
      case "runners":
        return "Top 6 Equipos Más Seleccionados para ser Subcampeón 🥈";
      case "third":
        return "Top 6 Equipos Más Seleccionados para quedar en Tercer Lugar 🥉";
      default:
        return "";
    }
  };

  return (
    <main className="container">
      <div className="admin-header">
        <div>
          <h1>📊 Gráficas 3D de Selección</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>
            Visualización tridimensional de las selecciones de los jugadores
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/admin">
            <button className="btn-primary" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>
              ⚙️ Volver al Panel
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="chart-tabs">
        <button
          className={`chart-tab-btn ${activeTab === "winners" ? "active" : ""}`}
          onClick={() => setActiveTab("winners")}
        >
          🗳️ R32 Ganadores
        </button>
        <button
          className={`chart-tab-btn ${activeTab === "qualified" ? "active" : ""}`}
          onClick={() => setActiveTab("qualified")}
        >
          ⚽ R32 Clasificados
        </button>
        <button
          className={`chart-tab-btn ${activeTab === "champions" ? "active" : ""}`}
          onClick={() => setActiveTab("champions")}
        >
          🏆 Campeón
        </button>
        <button
          className={`chart-tab-btn ${activeTab === "runners" ? "active" : ""}`}
          onClick={() => setActiveTab("runners")}
        >
          🥈 Subcampeón
        </button>
        <button
          className={`chart-tab-btn ${activeTab === "third" ? "active" : ""}`}
          onClick={() => setActiveTab("third")}
        >
          🥉 Tercer Lugar
        </button>
      </div>

      {/* 3D Chart Panel */}
      <div className="chart-3d-container">
        <h2 style={{ color: "var(--primary)", marginTop: 0, textAlign: "center" }}>
          {getHeadingText()}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0 0 1rem 0", textAlign: "center" }}>
          Muestra los 6 equipos que más votos recibieron de los participantes para esta ronda.
        </p>

        {currentData.length === 0 ? (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-muted)" }}>
            No hay predicciones registradas aún.
          </div>
        ) : (
          <div className="chart-3d-stage">
            {currentData.map(([team, count], index) => {
              const heightPercent = animate ? (count / maxVal) * 85 : 0; // max height 85% to fit value labels comfortably
              return (
                <div key={team} className="bar-3d-group">
                  <div className="bar-3d-wrapper">
                    {/* Top Face */}
                    <div
                      className="bar-3d-top"
                      style={{
                        bottom: `calc(${heightPercent}% - 4px)`,
                        transitionDelay: `${index * 0.1}s`,
                      }}
                    />
                    {/* Front Face */}
                    <div
                      className="bar-3d-front"
                      style={{
                        height: `${heightPercent}%`,
                        transitionDelay: `${index * 0.1}s`,
                      }}
                    >
                      {/* Floating value text above the bar */}
                      {animate && (
                        <span className="bar-3d-value">{count}</span>
                      )}
                    </div>
                    {/* Side Face */}
                    <div
                      className="bar-3d-side"
                      style={{
                        height: `${heightPercent}%`,
                        transitionDelay: `${index * 0.1}s`,
                      }}
                    />
                  </div>
                  <div className="bar-3d-label">{team}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick insights card */}
      <div className="glass-panel" style={{ padding: "1.5rem", marginTop: "2rem" }}>
        <h3 style={{ color: "var(--primary)", marginTop: 0 }}>💡 Análisis de Datos</h3>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem", lineHeight: "1.6" }}>
          Las gráficas tridimensionales demuestran qué selecciones son consideradas como favoritas indiscutibles por
          el conjunto de los participantes. El equipo que encabeza las barras representa la mayor tendencia de voto,
          mientras que el escalonamiento de las siguientes barras refleja el nivel de competencia y consenso entre
          los jugadores del pool.
        </p>
      </div>
    </main>
  );
}
