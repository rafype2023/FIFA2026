"use client";
import React, { useState, useEffect } from "react";
import { generateR32 } from "../lib/fifaRules";

const INITIAL_GROUPS = {
  A: ["Mexico", "South Africa", "South Korea", "Czech Republic"],
  B: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["United States", "Paraguay", "Australia", "Turkey"],
  E: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "IC Path 2 winners", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"]
};

export default function GroupPredictor({ onComplete }) {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [selectedThirds, setSelectedThirds] = useState([]);

  const moveTeam = (group, index, direction) => {
    if ((index === 0 && direction === -1) || (index === 3 && direction === 1)) return;
    const newGroups = { ...groups };
    const arr = [...newGroups[group]];
    const temp = arr[index];
    arr[index] = arr[index + direction];
    arr[index + direction] = temp;
    newGroups[group] = arr;
    setGroups(newGroups);
    
    // Ensure selectedThirds only contains current third-place teams
    const currentThirds = Object.values(newGroups).map(teams => teams[2]);
    setSelectedThirds(prev => prev.filter(t => currentThirds.includes(t)));
  };

  const toggleThirdPlace = (team) => {
    if (selectedThirds.includes(team)) {
      setSelectedThirds(selectedThirds.filter(t => t !== team));
    } else {
      if (selectedThirds.length < 8) {
        setSelectedThirds([...selectedThirds, team]);
      } else {
        alert("You can only select exactly 8 third-place teams.");
      }
    }
  };

  const currentThirds = Object.entries(groups).map(([groupName, teams]) => ({
    groupName,
    team: teams[2]
  }));

  const handleComplete = () => {
    if (selectedThirds.length !== 8) {
      alert("Por favor, selecciona exactamente 8 equipos en tercer lugar para avanzar.");
      return;
    }
    
    try {
      const teams32 = generateR32(groups, selectedThirds);
      onComplete({ picks: groups, thirdPlaces: selectedThirds }, teams32);
    } catch (err) {
      alert("Error generando el bracket: " + err.message);
    }
  };

  const getSlotClass = (index) => {
    if(index === 0) return "rank-first";
    if(index === 1) return "rank-second";
    if(index === 2) return "rank-third";
    return "rank-fourth";
  };

  return (
    <div className="group-stage-container">
      <h2 style={{textAlign:"center", marginBottom:"0.5rem", color:"var(--primary)"}}>Fase de Grupos</h2>
      <p style={{textAlign:"center", color:"var(--text-muted)", marginBottom:"2rem"}}>Usa las flechas para ordenar los equipos del 1ro al 4to. ¡Los mejores 2 de cada grupo avanzan automáticamente!</p>
      
      <div className="groups-grid">
        {Object.entries(groups).map(([groupName, teams]) => (
          <div key={groupName} className="group-card">
            <h3 style={{margin: "0 0 1rem 0", color: "var(--primary)"}}>Grupo {groupName}</h3>
            <div className="team-list">
              {teams.map((team, idx) => (
                <div key={team} className={"group-team-row " + getSlotClass(idx)}>
                  <div className="rank-num">{idx + 1}</div>
                  <div className="team-name">{team}</div>
                  <div className="move-controls">
                    <button onClick={() => moveTeam(groupName, idx, -1)} disabled={idx === 0}>▲</button>
                    <button onClick={() => moveTeam(groupName, idx, 1)} disabled={idx === 3}>▼</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="thirds-selection glass-panel" style={{marginTop: "3rem", padding: "2rem"}}>
        <h2 style={{textAlign:"center", color:"var(--primary)", marginTop: 0}}>Selecciona los Mejores 8 Terceros Lugares</h2>
        <p style={{textAlign:"center", color:"var(--text-muted)"}}>Haz clic para seleccionar EXACTAMENTE 8 equipos ({selectedThirds.length}/8 seleccionados)</p>
        
        <div className="thirds-grid">
          {currentThirds.map(({groupName, team}) => {
            const isSelected = selectedThirds.includes(team);
            return (
              <div 
                key={groupName} 
                className={"third-team-card " + (isSelected ? "selected" : "")}
                onClick={() => toggleThirdPlace(team)}
              >
                <span>{team} <small style={{color:"var(--text-muted)"}}>(Grupo {groupName})</small></span>
                {isSelected && <span className="checkmark">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{textAlign: "center", marginTop: "2rem", paddingBottom: "2rem"}}>
        <button 
          className="btn-primary" 
          onClick={handleComplete}
          disabled={selectedThirds.length !== 8}
          style={{fontSize: "1.2rem", padding: "16px 32px"}}
        >
          Proceder a la Llave Eliminatoria ({selectedThirds.length === 8 ? "Listo" : `Faltan ${8 - selectedThirds.length}`})
        </button>
      </div>
    </div>
  );
}
