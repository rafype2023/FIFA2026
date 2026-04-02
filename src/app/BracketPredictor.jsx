
"use client";
import React, { useState } from "react";
import { M89_M96_MATCHUPS, M97_M100_MATCHUPS, M101_M102_MATCHUPS, M104_FINAL } from "../lib/fifaRules";

export default function BracketPredictor({ teams32, onComplete }) {
  const roundsOrder = ["R32", "R16", "QF", "SF", "FINAL"];
  
  // Transform the definitions into state objects that hold winner/team1/team2 values
  const initRound = (matchups) => matchups.map(m => ({ ...m, team1: null, team2: null, winner: null }));
  
  const [bracket, setBracket] = useState({
    R32: teams32, // Already properly formatted out of generateR32
    R16: initRound(M89_M96_MATCHUPS),
    QF: initRound(M97_M100_MATCHUPS),
    SF: initRound(M101_M102_MATCHUPS),
    FINAL: initRound(M104_FINAL)
  });
  
  const [champion, setChampion] = useState(null);

  const advanceTeam = (round, matchIndex, team) => {
    if (!team) return;
    
    const newBracket = { ...bracket };
    const currentMatch = newBracket[round][matchIndex];
    currentMatch.winner = team;
    
    // Cascading updates recursively clears forwards path
    const clearForward = (startRound, matchId) => {
      // Find where this match propagates
      let rIdx = roundsOrder.indexOf(startRound);
      if (rIdx === roundsOrder.length - 1) return; // Final
      
      const nextRound = roundsOrder[rIdx + 1];
      const targetMatch = newBracket[nextRound].find(m => m.id === matchId);
      if (targetMatch) {
         if (targetMatch.winner) {
           targetMatch.winner = null;
           clearForward(nextRound, targetMatch.nextMatch);
         }
      }
    };
    
    const currentRoundIdx = roundsOrder.indexOf(round);
    
    if (currentRoundIdx < roundsOrder.length - 1) {
      const nextRound = roundsOrder[currentRoundIdx + 1];
      const nextMatchId = currentMatch.nextMatch;
      
      const targetMatchIndex = newBracket[nextRound].findIndex(m => m.id === nextMatchId);
      if (targetMatchIndex > -1) {
         if (currentMatch.isTeamA) {
            newBracket[nextRound][targetMatchIndex].team1 = team;
         } else {
            newBracket[nextRound][targetMatchIndex].team2 = team;
         }
         
         if (newBracket[nextRound][targetMatchIndex].winner) {
            newBracket[nextRound][targetMatchIndex].winner = null;
            clearForward(nextRound, newBracket[nextRound][targetMatchIndex].nextMatch);
         }
      }
      setChampion(null); 
    } else {
      setChampion(team);
    }
    
    setBracket(newBracket);
  };

  const renderMatch = (match, round, index) => (
    <div key={match.id} className="matchup">
      <div 
        className={"team-slot " + (match.winner === match.team1 ? "selected" : "")} 
        onClick={() => advanceTeam(round, index, match.team1)}
      >
        {match.team1 || "TBD"}
      </div>
      <div 
        className={"team-slot " + (match.winner === match.team2 ? "selected" : "")} 
        onClick={() => advanceTeam(round, index, match.team2)}
      >
        {match.team2 || "TBD"}
      </div>
    </div>
  );

  const renderRound = (roundName, title) => (
    <div className="bracket-column">
      <h3 style={{textAlign:"center", color:"var(--primary)"}}>{title}</h3>
      {bracket[roundName].map((match, i) => renderMatch(match, roundName, i))}
    </div>
  );

  return (
    <div style={{marginTop: "2rem"}}>
      <div className="bracket-container">
        {renderRound("R32", "Ronda de 32")}
        {renderRound("R16", "Octavos de Final")}
        {renderRound("QF", "Cuartos de Final")}
        {renderRound("SF", "Semifinales")}
        {renderRound("FINAL", "Final")}
        
        <div className="bracket-column" style={{justifyContent: "center"}}>
           <h3 style={{textAlign:"center", color:"gold"}}>Campeón</h3>
           <div className="champion-slot">
             {champion || "TBD"}
           </div>
        </div>
      </div>
      
      <div style={{textAlign: "center", marginTop: "3rem"}}>
        <button 
          className="btn-primary" 
          onClick={() => onComplete(bracket, champion)}
          disabled={!champion}
          style={{fontSize: "1.2rem", padding: "16px 32px"}}
        >
          Someter Predicción
        </button>
      </div>
    </div>
  );
}
