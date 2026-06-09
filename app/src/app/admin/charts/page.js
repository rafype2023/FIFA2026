import dbConnect from "@/lib/mongodb";
import Prediction from "@/models/Prediction";
import ChartsDashboard from "./ChartsDashboard";

export const dynamic = 'force-dynamic';

function countOccurrences(arr) {
  return arr.reduce((acc, val) => {
    // Avoid counting placeholder values
    if (val && val !== "TBD" && val !== "—" && val.trim() !== "") {
      acc[val] = (acc[val] || 0) + 1;
    }
    return acc;
  }, {});
}

function getTop6(countsObj) {
  return Object.entries(countsObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

export default async function AdminChartsPage() {
  await dbConnect();
  const allDocs = await Prediction.find({}).lean();
  
  // Filter out any system seed players
  const players = allDocs.filter(p => p.name?.trim().toUpperCase() !== "CLAVE DE FIFA 2026");

  // 1. Ganadores de Ronda de 32 (Avance a Octavos)
  const r32Winners = players.flatMap(p => {
    const matches = p.bracket?.R32 || [];
    return matches.map(m => m.winner).filter(Boolean);
  });
  const r32WinnerCounts = countOccurrences(r32Winners);
  const top6R32Winners = getTop6(r32WinnerCounts);

  // 2. Clasificados a Ronda de 32 (Fase de Grupos)
  const r32Qualified = players.flatMap(p => {
    const matches = p.bracket?.R32 || [];
    return matches.flatMap(m => [m.team1, m.team2]).filter(Boolean);
  });
  const r32QualifiedCounts = countOccurrences(r32Qualified);
  const top6R32Qualified = getTop6(r32QualifiedCounts);

  // 3. Campeones
  const champions = players.map(p => p.champion).filter(Boolean);
  const championCounts = countOccurrences(champions);
  const top6Champions = getTop6(championCounts);

  // 4. Subcampeones
  const runnersUp = players.map(p => {
    const final = p.bracket?.FINAL?.[0];
    if (!final || !final.winner) return null;
    return final.winner === final.team1 ? final.team2 : final.team1;
  }).filter(Boolean);
  const runnerUpCounts = countOccurrences(runnersUp);
  const top6RunnersUp = getTop6(runnerUpCounts);

  // 5. Tercer Lugar
  const thirdPlaces = players.map(p => {
    const thirdMatch = p.bracket?.THIRD?.[0];
    return thirdMatch?.winner;
  }).filter(Boolean);
  const thirdPlaceCounts = countOccurrences(thirdPlaces);
  const top6ThirdPlaces = getTop6(thirdPlaceCounts);

  return (
    <ChartsDashboard 
      top6R32Winners={top6R32Winners} 
      top6R32Qualified={top6R32Qualified} 
      top6Champions={top6Champions}
      top6RunnersUp={top6RunnersUp}
      top6ThirdPlaces={top6ThirdPlaces}
    />
  );
}
