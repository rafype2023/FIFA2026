
"use client";
import React, { useState } from "react";

const generateMatches = (count, prefix, teams32 = null) => {
  return Array.from({ length: count }, (_, i) => ({
    id: prefix + "-" + i,
    team1: prefix === "R32" && teams32 ? teams32[i].team1 : null,
    team2: prefix === "R32" && teams32 ? teams32[i].team2 : null,
    winner: null,
  }));
};

export default function BracketPredictor({ teams32, onComplete }) {
  const roundsOrder = ["R32", "R16", "QF", "SF", "FINAL"];
  
  const [bracket, setBracket] = useState({
    R32: generateMatches(16, "R32", teams32),
    R16: generateMatches(8, "R16"),
    QF: generateMatches(4, "QF"),
    SF: generateMatches(2, "SF"),
    FINAL: generateMatches(1, "FINAL"),
  });
  
  const [champion, setChampion] = useState(null);

  const advanceTeam = (round, matchIndex, team) => {
    if (!team) return;
    
    const newBracket = { ...bracket };
    newBracket[round][matchIndex].winner = team;
    
    const currentRoundIdx = roundsOrder.indexOf(round);
    
    if (currentRoundIdx < roundsOrder.length - 1) {
      const nextRound = roundsOrder[currentRoundIdx + 1];
      const nextMatchIndex = Math.floor(matchIndex / 2);
      const isTeam1 = matchIndex % 2 === 0;
      
      if (isTeam1) {
        newBracket[nextRound][nextMatchIndex].team1 = team;
      } else {
        newBracket[nextRound][nextMatchIndex].team2 = team;
      }
      newBracket[nextRound][nextMatchIndex].winner = null;
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
        {renderRound("R32", "Round of 32")}
        {renderRound("R16", "Round of 16")}
        {renderRound("QF", "Quarter-finals")}
        {renderRound("SF", "Semi-finals")}
        {renderRound("FINAL", "Final")}
        
        <div className="bracket-column" style={{justifyContent: "center"}}>
           <h3 style={{textAlign:"center", color:"gold"}}>Champion</h3>
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
          Submit Prediction
        </button>
      </div>
    </div>
  );
}
