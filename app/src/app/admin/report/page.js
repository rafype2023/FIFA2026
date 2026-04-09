import dbConnect from "@/lib/mongodb";
import Prediction from "@/models/Prediction";
import Link from "next/link";
import PrintButton from "./PrintButton";
import "./report.css";

export const dynamic = 'force-dynamic';

const POS_LABELS = ["1ro", "2do", "3ro", "4to"];
const ROUNDS = {
  R32: "Ronda de 32",
  R16: "Octavos de Final",
  QF: "Cuartos de Final",
  SF: "Semifinales",
  FINAL: "Final",
};

export default async function AdminReport() {
  await dbConnect();
  const allDocs = await Prediction.find({}).lean();
  const players = allDocs.filter(p => p.name?.trim().toUpperCase() !== "CLAVE DE FIFA 2026");
  players.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <>
      {/* Screen toolbar */}
      <div className="print-toolbar no-print">
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/admin">
            <button className="toolbar-btn">← Volver al Panel</button>
          </Link>
          <h2 style={{ margin: 0, color: "var(--primary)" }}>
            Reporte Completo — {players.length} jugadores
          </h2>
        </div>
        <PrintButton />
      </div>

      <div className="report-container">
        {/* Cover page */}
        <div className="report-cover page-break-after">
          <div className="cover-logo">⚽</div>
          <h1 className="cover-title">FIFA 2026</h1>
          <h2 className="cover-subtitle">Copa Mundial — Predicciones del Pool</h2>
          <div className="cover-meta">
            <p>Total de Participantes: <strong>{players.length}</strong></p>
            <p>Fecha de Impresión: <strong>{new Date().toLocaleDateString("es-PR", { year: "numeric", month: "long", day: "numeric" })}</strong></p>
          </div>
          <p className="cover-notice">
            Este reporte contiene las predicciones oficiales de todos los participantes
            del pool. Sirve como evidencia de las predicciones sometidas antes
            del cierre de la competencia.
          </p>
        </div>

        {/* One page per player */}
        {players.map((player, playerIndex) => {
          const groups = player.groupPicks?.picks || {};
          const thirdPlaces = player.groupPicks?.thirdPlaces || [];
          const bracket = player.bracket || {};

          return (
            <div key={player._id.toString()} className={`player-report-page ${playerIndex < players.length - 1 ? "page-break-after" : ""}`}>
              {/* Player header */}
              <div className="report-player-header">
                <div className="report-player-left">
                  <div className="report-player-number">#{playerIndex + 1}</div>
                  <div>
                    <h2 className="report-player-name">{player.name}</h2>
                    <div className="report-player-meta">{player.email} &nbsp;|&nbsp; {player.phone}</div>
                    <div className="report-player-meta">
                      Sometido: {player.createdAt ? new Date(player.createdAt).toLocaleString("es-PR") : "—"}
                    </div>
                  </div>
                </div>
                <div className="report-champion-badge">
                  🏆 {player.champion || "—"}
                </div>
              </div>

              {/* Group Stage */}
              <div className="report-section-title">📋 Fase de Grupos</div>
              <div className="report-groups-grid">
                {Object.entries(groups).map(([groupLetter, teams]) => (
                  <div key={groupLetter} className="report-group-card">
                    <div className="report-group-label">Grupo {groupLetter}</div>
                    {(Array.isArray(teams) ? teams : []).map((team, i) => (
                      <div key={i} className="report-group-row">
                        <span className={`report-pos report-pos-${i + 1}`}>{POS_LABELS[i]}</span>
                        <span className="report-team-name">{team || "—"}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Third places */}
              {thirdPlaces.length > 0 && (
                <div className="report-thirds">
                  <span className="report-thirds-label">🥉 Terceros que avanzan:</span>
                  {thirdPlaces.map((t, i) => <span key={i} className="report-third-chip">{t}</span>)}
                </div>
              )}

              {/* Knockout bracket */}
              <div className="report-section-title">🏟️ Llave Eliminatoria</div>
              <div className="report-bracket-grid">
                {Object.entries(ROUNDS).map(([roundKey, roundLabel]) => {
                  const matches = bracket[roundKey];
                  if (!Array.isArray(matches)) return null;
                  const winners = matches.filter(m => m.winner);
                  if (winners.length === 0) return null;
                  return (
                    <div key={roundKey} className="report-bracket-col">
                      <div className="report-bracket-round-label">{roundLabel}</div>
                      {winners.map((m, i) => (
                        <div key={i} className="report-bracket-winner">
                          ✓ {m.winner}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
