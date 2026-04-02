import dbConnect from "@/lib/mongodb";
import Prediction from "@/models/Prediction";
import Link from "next/link";
import "./standings.css";

// Force dynamic rendering so it always fetches latest standings
export const dynamic = 'force-dynamic';

export default async function Standings() {
  await dbConnect();

  // Fetch all predictions from DB
  // Because we changed the collection internally in the model, finding by Prediction works securely
  const rawPredictions = await Prediction.find({}).lean();
  
  // Format dates so Next.js doesn't complain about passing raw objects to client components if we were to do so (we're processing server side though)
  
  // Locate Master key
  const masterKey = rawPredictions.find(p => p.name.trim().toUpperCase() === "CLAVE DE FIFA 2026");
  
  if (!masterKey) {
    return (
      <main className="container">
        <div className="glass-panel" style={{padding: "3rem", textAlign: "center", marginTop: "2rem"}}>
          <h2 style={{color: "var(--primary)"}}>Resultados no disponibles</h2>
          <p style={{color: "var(--text-muted)"}}>
            Aún no se ha sometido la llave maestra ("CLAVE DE FIFA 2026").
            Los resultados se publicarán cuando esté disponible.
          </p>
          <Link href="/">
             <button className="btn-primary" style={{marginTop: "2rem"}}>Regresar al Inicio</button>
          </Link>
        </div>
      </main>
    );
  }

  // Calculate scores
  const players = rawPredictions.filter(p => p._id.toString() !== masterKey._id.toString());
  
  const standings = players.map(player => {
    let ptsGrupos = 0;
    let ptsR32 = 0;
    let ptsR16 = 0;
    let ptsQF = 0;
    let ptsSF = 0;
    let ptsFinal = 0;

    // 1. Grupos (Max 48 pts: 1 pt per correct team placement)
    if (masterKey.groupPicks && player.groupPicks) {
      Object.keys(masterKey.groupPicks).forEach(groupLetter => {
         const masterArray = masterKey.groupPicks[groupLetter];
         const playerArray = player.groupPicks[groupLetter];
         if (masterArray && playerArray) {
            masterArray.forEach((teamMaster, i) => {
               if (playerArray[i] === teamMaster) {
                 ptsGrupos += 1;
               }
            });
         }
      });
    }

    // 2. Bracket Scoring logic - 1 pt R32/R16/QF, 2 pts SF, 3 pts Final
    const scoreRound = (roundName, pointsPerMatch) => {
        let pts = 0;
        const masterRound = masterKey.bracket[roundName];
        const playerRound = player.bracket[roundName];
        
        if (masterRound && playerRound) {
            masterRound.forEach((masterMatch) => {
                if (!masterMatch.winner) return; // Master hasn't resolved this match yet

                // Depending on how users picked, bracket outcomes might have different match alignments 
                // However, since it's perfectly deterministic from group stages, our matches have fixed IDs!
                const playerMatch = playerRound.find(m => m.id === masterMatch.id);
                if (playerMatch && playerMatch.winner === masterMatch.winner) {
                   pts += pointsPerMatch;
                }
            });
        }
        return pts;
    };

    ptsR32 = scoreRound("R32", 1);
    ptsR16 = scoreRound("R16", 1);
    ptsQF = scoreRound("QF", 1);
    ptsSF = scoreRound("SF", 2);

    // 3. Final / Champion (3 pts)
    if (masterKey.champion && player.champion === masterKey.champion) {
       ptsFinal = 3;
    }

    const totalPts = ptsGrupos + ptsR32 + ptsR16 + ptsQF + ptsSF + ptsFinal;

    return {
      name: player.name,
      ptsGrupos,
      ptsR32,
      ptsR16,
      ptsQF,
      ptsSF,
      ptsFinal,
      totalPts
    };
  });

  // Sort descending by total score
  standings.sort((a, b) => b.totalPts - a.totalPts);

  return (
    <main className="container">
      <div className="standings-header" style={{textAlign: "center", marginBottom: "2rem"}}>
        <h1 style={{color: "var(--primary)", fontSize: "3rem"}}>Tabla de Posiciones</h1>
        <p style={{color: "var(--text-muted)"}}>Puntuaciones actualizadas basadas en la "CLAVE DE FIFA 2026"</p>
        <Link href="/">
           <button className="btn-secondary" style={{marginTop: "1rem"}}>Volver</button>
        </Link>
      </div>

      <div className="glass-panel overflow-x" style={{padding: "1rem"}}>
        <table className="standings-table">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-left">Jugador</th>
              <th className="text-center">Grupos</th>
              <th className="text-center">R32</th>
              <th className="text-center">Octavos</th>
              <th className="text-center">Cuartos</th>
              <th className="text-center">Semis</th>
              <th className="text-center">Campeón</th>
              <th className="text-center text-accent">Total</th>
            </tr>
          </thead>
          <tbody>
            {standings.length === 0 ? (
              <tr>
                <td colSpan="9" style={{textAlign: "center", padding: "2rem", color: "var(--text-muted)"}}>No hay jugadores registrados todavía.</td>
              </tr>
            ) : (
              standings.map((p, index) => (
                <tr key={index} className={index === 0 ? "first-place" : ""}>
                  <td className="text-center font-bold">{index + 1}</td>
                  <td className="text-left font-bold">{p.name}</td>
                  <td className="text-center">{p.ptsGrupos}</td>
                  <td className="text-center">{p.ptsR32}</td>
                  <td className="text-center">{p.ptsR16}</td>
                  <td className="text-center">{p.ptsQF}</td>
                  <td className="text-center">{p.ptsSF}</td>
                  <td className="text-center">{p.ptsFinal}</td>
                  <td className="text-center text-accent font-bold">{p.totalPts}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
