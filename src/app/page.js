
"use client";
import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import BracketPredictor from "./BracketPredictor";
import GroupPredictor from "./GroupPredictor";

export default function Home() {
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groupData, setGroupData] = useState(null);
  const [knockoutTeams, setKnockoutTeams] = useState(null);

  const handleStart = (e) => {
    e.preventDefault();
    if (userInfo.name && userInfo.email && userInfo.phone) {
      setStep(2);
    }
  };

  const handleGroupComplete = (groupPicks, teams32) => {
    setGroupData(groupPicks);
    setKnockoutTeams(teams32);
    setStep(3);
  };

  const handleCompleteBracket = async (bracket, champion) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userInfo,
          groupPicks: groupData,
          bracket,
          champion,
        })
      });
      if (!res.ok) throw new Error("Failed to save prediction");

      let summaryText = `=== YOUR FIFA 2026 BRACKET ===\n\n`;
      summaryText += `🏆 CHAMPION: ${champion}\n`;
      
      const runnerUp = bracket.FINAL[0].team1 === champion ? bracket.FINAL[0].team2 : bracket.FINAL[0].team1;
      summaryText += `🥈 RUNNER-UP: ${runnerUp || "TBD"}\n\n`;
      
      summaryText += `-- ROUND OF 32 WINNERS --\n`;
      bracket.R32.forEach(m => {
        if(m.winner) summaryText += ` • ${m.winner} (def. ${m.winner === m.team1 ? m.team2 : m.team1})\n`;
      });
      
      summaryText += `\n-- ROUND OF 16 WINNERS --\n`;
      bracket.R16.forEach(m => {
        if(m.winner) summaryText += ` • ${m.winner}\n`;
      });
      
      summaryText += `\n-- QUARTER-FINALISTS --\n`;
      bracket.QF.forEach(m => {
         if(m.winner) summaryText += ` • ${m.winner}\n`;
      });
      
      summaryText += `\n-- SEMI-FINALISTS --\n`;
      bracket.SF.forEach(m => {
         if(m.winner) summaryText += ` • ${m.winner}\n`;
      });
      
      summaryText += `\n=== GROUP STAGE WINNERS ===\n`;
      if(groupData) {
        Object.entries(groupData).forEach(([g, teams]) => {
           summaryText += `Group ${g}: 1. ${teams[0]} | 2. ${teams[1]}\n`;
        });
      }

      const templateParams = {
        to_name: userInfo.name,
        to_email: userInfo.email,
        champion: champion,
        message: "Thank you for submitting your FIFA 2026 Bracket! Your chosen champion is: " + champion,
        bracket_summary: summaryText
      };

      if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY && process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY_HERE") {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          templateParams,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        );
      } else {
        console.warn("EmailJS public key is missing or is a placeholder. Skipping email send.");
      }

      window.location.href = "/success";
    } catch (error) {
      console.error(error);
      alert("Hubo un error al someter tu predicción. Por favor, intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container">
      <div className="header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/placeholder-logo.png" alt="FIFA Logo" style={{height: "80px", marginBottom: "1rem", borderRadius: "8px"}} onError={(e) => e.target.style.display="none"} />
        <h1>Predicciones FIFA 2026</h1>
        <p style={{color: "var(--text-muted)", marginTop: "1rem"}}>¡Predice la Fase de Grupos y la llave de 32 equipos hasta la Final!</p>
      </div>

      {step === 1 ? (
        <div className="glass-panel" style={{maxWidth: "500px", margin: "0 auto", padding: "2rem"}}>
          <h2 style={{marginTop: 0, textAlign: "center"}}>Comenzar</h2>
          <form onSubmit={handleStart}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input 
                type="text" 
                required 
                value={userInfo.name}
                onChange={e => setUserInfo({...userInfo, name: e.target.value})}
                placeholder="Ej. Lionel Messi" 
              />
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                required 
                value={userInfo.email}
                onChange={e => setUserInfo({...userInfo, email: e.target.value})}
                placeholder="lionel@ejemplo.com" 
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input 
                type="tel" 
                required 
                value={userInfo.phone}
                onChange={e => setUserInfo({...userInfo, phone: e.target.value})}
                placeholder="Ej. +1 787 555 1234" 
              />
            </div>
            <button type="submit" className="btn-primary" style={{width: "100%", marginTop: "1rem"}}>¡Llenar Bracket!</button>
          </form>
        </div>
      ) : step === 2 ? (
        <div className="glass-panel" style={{padding: "1rem"}}>
           <GroupPredictor onComplete={handleGroupComplete} />
        </div>
      ) : (
        <div className="glass-panel" style={{padding: "1rem"}}>
           {isSubmitting ? (
             <div style={{textAlign: "center", padding: "6rem 2rem"}}>
                <h2 style={{color: "var(--primary)"}}>Sometiendo tus predicciones...</h2>
                <p style={{color: "var(--text-muted)"}}>Por favor, no refresques la página</p>
             </div>
           ) : (
             <BracketPredictor teams32={knockoutTeams} onComplete={handleCompleteBracket} />
           )}
        </div>
      )}
    </main>
  );
}
