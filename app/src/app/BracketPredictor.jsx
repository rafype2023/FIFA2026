
"use client";
import React, { useState } from "react";
import { M89_M96_MATCHUPS, M97_M100_MATCHUPS, M101_M102_MATCHUPS, M104_FINAL, M103_THIRD_PLACE } from "../lib/fifaRules";

export default function BracketPredictor({ teams32, onComplete }) {
  const roundsOrder = ["R32", "R16", "QF", "SF", "FINAL"];
  
  // Transform the definitions into state objects that hold winner/team1/team2 values
  const initRound = (matchups) => matchups.map(m => ({ ...m, team1: null, team2: null, winner: null }));
  
  const [bracket, setBracket] = useState({
    R32: teams32, // Already properly formatted out of generateR32
    R16: initRound(M89_M96_MATCHUPS),
    QF: initRound(M97_M100_MATCHUPS),
    SF: initRound(M101_M102_MATCHUPS),
    FINAL: initRound(M104_FINAL),
    THIRD: initRound(M103_THIRD_PLACE)
  });
  
  const [champion, setChampion] = useState(null);

  const advanceTeam = (round, matchIndex, team) => {
    if (!team) return;
    
    const newBracket = { ...bracket };
    const currentMatch = newBracket[round][matchIndex];
    currentMatch.winner = team;
    
    const propagateChange = (newBracket, roundName, mIdx) => {
      const match = newBracket[roundName][mIdx];
      const winner = match.winner;
      
      if (match.id === "M101") {
        // FINAL team1
        if (newBracket.FINAL[0].team1 !== winner) {
          newBracket.FINAL[0].team1 = winner;
          if (newBracket.FINAL[0].winner) {
            newBracket.FINAL[0].winner = null;
            propagateChange(newBracket, "FINAL", 0);
          }
        }
        // THIRD team1
        const loser = winner ? (match.team1 === winner ? match.team2 : match.team1) : null;
        if (newBracket.THIRD[0].team1 !== loser) {
          newBracket.THIRD[0].team1 = loser;
          if (newBracket.THIRD[0].winner) {
            newBracket.THIRD[0].winner = null;
            propagateChange(newBracket, "THIRD", 0);
          }
        }
      } else if (match.id === "M102") {
        // FINAL team2
        if (newBracket.FINAL[0].team2 !== winner) {
          newBracket.FINAL[0].team2 = winner;
          if (newBracket.FINAL[0].winner) {
            newBracket.FINAL[0].winner = null;
            propagateChange(newBracket, "FINAL", 0);
          }
        }
        // THIRD team2
        const loser = winner ? (match.team1 === winner ? match.team2 : match.team1) : null;
        if (newBracket.THIRD[0].team2 !== loser) {
          newBracket.THIRD[0].team2 = loser;
          if (newBracket.THIRD[0].winner) {
            newBracket.THIRD[0].winner = null;
            propagateChange(newBracket, "THIRD", 0);
          }
        }
      } else if (roundName === "FINAL") {
        if (!winner) {
          setChampion(null);
        } else {
          setChampion(winner);
        }
      } else if (roundName === "THIRD") {
        // Third place has no nextMatch, so do nothing.
      } else {
        // R32, R16, QF
        const nextMatchId = match.nextMatch;
        const currentRoundIdx = roundsOrder.indexOf(roundName);
        const nextRoundName = roundsOrder[currentRoundIdx + 1];
        
        const targetMatchIndex = newBracket[nextRoundName].findIndex(m => m.id === nextMatchId);
        if (targetMatchIndex > -1) {
          const targetMatch = newBracket[nextRoundName][targetMatchIndex];
          const isTeamA = match.isTeamA;
          
          if (isTeamA) {
            if (targetMatch.team1 !== winner) {
              targetMatch.team1 = winner;
              if (targetMatch.winner) {
                targetMatch.winner = null;
                propagateChange(newBracket, nextRoundName, targetMatchIndex);
              }
            }
          } else {
            if (targetMatch.team2 !== winner) {
              targetMatch.team2 = winner;
              if (targetMatch.winner) {
                targetMatch.winner = null;
                propagateChange(newBracket, nextRoundName, targetMatchIndex);
              }
            }
          }
        }
      }
    };

    propagateChange(newBracket, round, matchIndex);
    setBracket(newBracket);
  };

  const renderMatch = (match, round, index) => (
    <div key={match.id} className="matchup">
      <span style={{position: "absolute", top: "-15px", left: "5px", fontSize: "0.65rem", color: "var(--text-muted)", zIndex: 1, fontWeight: "bold"}}>
        {match.id}
      </span>
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
        {renderRound("THIRD", "Tercer Lugar")}
        
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
          disabled={!champion || !bracket.THIRD[0].winner}
          style={{fontSize: "1.2rem", padding: "16px 32px"}}
        >
          Someter Predicción
        </button>
      </div>
    </div>
  );
}
