import dbConnect from "@/lib/mongodb";
import Prediction from "@/models/Prediction";
import Link from "next/link";
import "./admin.css";

export const dynamic = 'force-dynamic';

function countOccurrences(arr) {
  return arr.reduce((acc, val) => {
    if (val) acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

function sortedEntries(obj) {
  return Object.entries(obj).sort((a, b) => b[1] - a[1]);
}

export default async function AdminDashboard() {
  await dbConnect();
  const allPlayers = await Prediction.find({}).lean();

  const players = allPlayers.filter(p => p.name?.trim().toUpperCase() !== "CLAVE DE FIFA 2026");
  const total = players.length;

  // === STATS ===
  const champions = players.map(p => p.champion).filter(Boolean);
  const championCounts = sortedEntries(countOccurrences(champions));

  // Finalists
  const finalists = players.map(p => {
    const final = p.bracket?.FINAL?.[0];
    if (!final || !final.winner) return null;
    return final.winner === final.team1 ? final.team2 : final.team1;
  }).filter(Boolean);
  const finalistCounts = sortedEntries(countOccurrences(finalists));

  // Semi-finalists
  const semis = players.flatMap(p => (p.bracket?.SF || []).map(m => m.winner).filter(Boolean));
  const semiCounts = sortedEntries(countOccurrences(semis)).slice(0, 8);

  const maxChampion = championCounts[0]?.[1] || 1;
  const maxFinalist = finalistCounts[0]?.[1] || 1;
  const maxSemi = semiCounts[0]?.[1] || 1;

  return (
    <main className="container">
      <div className="admin-header">
        <div>
          <h1>⚙️ Panel de Administrador</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>FIFA 2026 World Cup Predictions</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/admin/report">
            <button style={{ background: "rgba(0,180,100,0.2)", color: "#4eff9e", border: "1px solid rgba(0,200,100,0.3)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>
              🖨️ Reporte PDF
            </button>
          </Link>
          <Link href="/">
            <button style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>
              🏠 Inicio
            </button>
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" style={{ background: "rgba(255,80,80,0.2)", color: "#ff6b6b", border: "1px solid rgba(255,80,80,0.3)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      {/* Summary stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-number">{total}</div>
          <div className="stat-label">Jugadores Registrados</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{championCounts.length}</div>
          <div className="stat-label">Campeones Distintos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ fontSize: "1.6rem" }}>{championCounts[0]?.[0] || "—"}</div>
          <div className="stat-label">🏆 Favorito ({championCounts[0]?.[1] || 0} votos)</div>
        </div>
      </div>

      {/* Champions Chart */}
      <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ color: "var(--primary)", marginTop: 0 }}>🏆 Campeón Más Seleccionado</h2>
        <div className="bar-chart">
          {championCounts.map(([team, count]) => (
            <div key={team} className="bar-row">
              <div className="bar-label">{team}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(count / maxChampion) * 100}%` }}>
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Finalists Chart */}
      {finalistCounts.length > 0 && (
        <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--primary)", marginTop: 0 }}>🥈 Finalista Más Seleccionado</h2>
          <div className="bar-chart">
            {finalistCounts.map(([team, count]) => (
              <div key={team} className="bar-row">
                <div className="bar-label">{team}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(count / maxFinalist) * 100}%`, background: "linear-gradient(90deg, #c0c0c0, #e8e8e8)" }}>
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Semi-finalists Chart */}
      {semiCounts.length > 0 && (
        <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--primary)", marginTop: 0 }}>🎖️ Semifinalistas Más Seleccionados</h2>
          <div className="bar-chart">
            {semiCounts.map(([team, count]) => (
              <div key={team} className="bar-row">
                <div className="bar-label">{team}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(count / maxSemi) * 100}%`, background: "linear-gradient(90deg, #cd7f32, #f4a460)" }}>
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Player List */}
      <h2 style={{ color: "var(--primary)", marginBottom: "1rem" }}>👥 Todos los Jugadores ({total})</h2>
      <div className="player-grid">
        {players.map(p => (
          <Link key={p._id.toString()} href={`/admin/players/${p._id}`} className="player-card">
            <div className="player-name">{p.name}</div>
            <div className="player-meta">{p.email}</div>
            <div className="player-meta">{p.createdAt ? new Date(p.createdAt).toLocaleDateString("es-PR") : ""}</div>
            {p.champion && (
              <div className="player-champion">🏆 {p.champion}</div>
            )}
          </Link>
        ))}
        {total === 0 && (
          <p style={{ color: "var(--text-muted)", gridColumn: "1/-1" }}>No hay jugadores registrados aún.</p>
        )}
      </div>
    </main>
  );
}
