import dbConnect from "@/lib/mongodb";
import Prediction from "@/models/Prediction";
import Link from "next/link";
import "../../admin.css";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

const ROUND_LABELS = {
  R32: "Ronda de 32",
  R16: "Octavos de Final",
  QF: "Cuartos de Final",
  SF: "Semifinales",
  FINAL: "Final",
};

const POS_LABELS = ["🥇 1ro", "🥈 2do", "🥉 3ro", "4to"];
const POS_CLASSES = ["pos-1", "pos-2", "pos-3", "pos-4"];

export default async function PlayerDetail({ params }) {
  await dbConnect();

  let player;
  try {
    const id = new mongoose.Types.ObjectId(params.id);
    player = await Prediction.findById(id).lean();
  } catch {
    return (
      <main className="container">
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center" }}>
          <h2 style={{ color: "red" }}>Jugador no encontrado.</h2>
          <Link href="/admin"><button className="btn-primary" style={{ marginTop: "1rem" }}>Volver</button></Link>
        </div>
      </main>
    );
  }

  if (!player) {
    return (
      <main className="container">
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center" }}>
          <h2 style={{ color: "var(--text-muted)" }}>Jugador no encontrado.</h2>
          <Link href="/admin"><button className="btn-primary" style={{ marginTop: "1rem" }}>Volver</button></Link>
        </div>
      </main>
    );
  }

  const groups = player.groupPicks?.picks || {};
  const thirdPlaces = player.groupPicks?.thirdPlaces || [];
  const bracket = player.bracket || {};
  const rounds = ["R32", "R16", "QF", "SF", "FINAL"];

  return (
    <main className="container">
      {/* Header */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <Link href="/admin">
          <button style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>
            ← Volver
          </button>
        </Link>
        <h1 style={{ color: "var(--primary)", margin: 0 }}>Predicciones de {player.name}</h1>
      </div>

      {/* Player info */}
      <div className="player-detail-header glass-panel">
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ color: "var(--text-muted)", padding: "4px 1rem 4px 0", width: "140px" }}>Jugador</td>
              <td style={{ fontWeight: 700 }}>{player.name}</td>
            </tr>
            <tr>
              <td style={{ color: "var(--text-muted)", padding: "4px 1rem 4px 0" }}>Email</td>
              <td>{player.email}</td>
            </tr>
            <tr>
              <td style={{ color: "var(--text-muted)", padding: "4px 1rem 4px 0" }}>Teléfono</td>
              <td>{player.phone}</td>
            </tr>
            <tr>
              <td style={{ color: "var(--text-muted)", padding: "4px 1rem 4px 0" }}>Fecha</td>
              <td>{player.createdAt ? new Date(player.createdAt).toLocaleString("es-PR") : "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Champion */}
      {player.champion && (
        <div className="champion-display">
          <div className="trophy">🏆</div>
          <div className="champion-name">{player.champion}</div>
          <div className="champion-sub">Campeón seleccionado</div>
        </div>
      )}

      {/* Group Stage */}
      <div className="section-title">📋 Fase de Grupos — Posiciones</div>
      <div className="groups-display">
        {Object.entries(groups).map(([groupLetter, teams]) => (
          <div key={groupLetter} className="group-display-card">
            <h4>Grupo {groupLetter}</h4>
            {(Array.isArray(teams) ? teams : []).map((team, i) => (
              <div key={i} className="group-team-row-display">
                <span className={`pos-badge ${POS_CLASSES[i]}`}>{i + 1}</span>
                <span>{team || "—"}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Third Places */}
      {thirdPlaces.length > 0 && (
        <>
          <div className="section-title">🥉 Terceros Lugares Seleccionados</div>
          <div className="third-places-grid">
            {thirdPlaces.map((team, i) => (
              <span key={i} className="third-badge">{team}</span>
            ))}
          </div>
        </>
      )}

      {/* Knockout Bracket */}
      <div className="section-title">🏟️ Llave Eliminatoria</div>
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        {rounds.map(round => {
          const matches = bracket[round];
          if (!Array.isArray(matches) || matches.length === 0) return null;
          const hasWinners = matches.some(m => m.winner);
          if (!hasWinners) return null;

          return (
            <div key={round} className="bracket-round">
              <h4>{ROUND_LABELS[round]}</h4>
              {matches.map((m, i) => (
                m.winner ? (
                  <div key={i} className="bracket-match-row">
                    <span>{m.id || `M${i + 73}`}</span>
                    <span>—</span>
                    <span className="match-winner">{m.winner}</span>
                    {m.team1 && m.team2 && (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        ({m.team1} vs {m.team2})
                      </span>
                    )}
                  </div>
                ) : null
              ))}
            </div>
          );
        })}
      </div>
    </main>
  );
}
