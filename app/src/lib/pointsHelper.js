export function calculatePlayerPoints(player, masterKey) {
  const result = {
    totalPts: 0,
    ptsGrupos: 0,
    ptsR32: 0,
    ptsR16: 0,
    ptsQF: 0,
    ptsSF: 0,
    ptsThird: 0,
    ptsFinal: 0
  };

  if (!player || !masterKey) return result;

  // 1. Group Stage points (1 pt per correct position)
  const masterGroups = masterKey.groupPicks?.picks;
  const playerGroups = player.groupPicks?.picks;
  
  if (masterGroups && playerGroups && typeof masterGroups === "object") {
    Object.keys(masterGroups).forEach(groupLetter => {
      const masterArray = masterGroups[groupLetter];
      const playerArray = playerGroups[groupLetter];
      if (Array.isArray(masterArray) && Array.isArray(playerArray)) {
        masterArray.forEach((teamMaster, i) => {
          if (playerArray[i] === teamMaster) {
            result.ptsGrupos += 1;
          }
        });
      }
    });
  }

  // Helper for knockout rounds
  const scoreRound = (roundName, pointsPerMatch) => {
    let pts = 0;
    const masterRound = masterKey.bracket?.[roundName];
    const playerRound = player.bracket?.[roundName];
    
    if (Array.isArray(masterRound) && Array.isArray(playerRound)) {
      masterRound.forEach((masterMatch) => {
        if (!masterMatch.winner) return; 

        const playerMatch = playerRound.find(m => m.id === masterMatch.id);
        if (playerMatch && playerMatch.winner === masterMatch.winner) {
          pts += pointsPerMatch;
        }
      });
    }
    return pts;
  };

  result.ptsR32 = scoreRound("R32", 1);
  result.ptsR16 = scoreRound("R16", 1);
  result.ptsQF = scoreRound("QF", 1);
  result.ptsSF = scoreRound("SF", 2);
  result.ptsThird = scoreRound("THIRD", 2);

  // 3. Champion (3 pts if champion matches)
  if (masterKey.champion && player.champion === masterKey.champion) {
    result.ptsFinal = 3;
  }

  result.totalPts = 
    result.ptsGrupos + 
    result.ptsR32 + 
    result.ptsR16 + 
    result.ptsQF + 
    result.ptsSF + 
    result.ptsThird + 
    result.ptsFinal;

  return result;
}

export function getMatchPoints(round, match, masterKey, index) {
  if (!masterKey) return null;
  const masterRound = masterKey.bracket?.[round];
  if (!Array.isArray(masterRound)) return null;

  const matchId = match.id || `M${index + 73}`;
  const masterMatch = masterRound.find(x => (x.id || `M${masterRound.indexOf(x) + 73}`) === matchId);
  if (!masterMatch || !masterMatch.winner) return null; // No winner set in master key yet

  const isCorrect = match.winner === masterMatch.winner;
  const ptsPossible = (round === "SF" || round === "THIRD") ? 2 : (round === "FINAL" ? 3 : 1);
  
  return {
    earned: isCorrect ? ptsPossible : 0,
    possible: ptsPossible,
    isCorrect,
    hasResult: true
  };
}

export function getGroupPoints(groupLetter, playerTeams, masterGroups) {
  if (!masterGroups) return 0;
  const masterTeams = masterGroups[groupLetter];
  if (!Array.isArray(masterTeams) || !Array.isArray(playerTeams)) return 0;
  
  let pts = 0;
  masterTeams.forEach((teamMaster, i) => {
    if (playerTeams[i] === teamMaster) {
      pts += 1;
    }
  });
  return pts;
}
