
"use client";
import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import BracketPredictor from "./BracketPredictor";
import GroupPredictor from "./GroupPredictor";
import Link from "next/link";

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

    // MUST call audio.play() synchronously here — before any await.
    // Any await breaks the browser's user-gesture chain and silently blocks autoplay.
    const golAudio = new Audio("/Gol.mp3");
    golAudio.volume = 1.0;
    const audioPromise = golAudio.play().catch(err => console.warn("Audio blocked:", err));

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

      let summaryText = `========================================\n`;
      summaryText += `  PREDICCIONES FIFA 2026 - COPA MUNDIAL  \n`;
      summaryText += `========================================\n\n`;
      summaryText += `Jugador: ${userInfo.name}\n`;
      summaryText += `Email:   ${userInfo.email}\n`;
      summaryText += `========================================\n\n`;

      // === FULL GROUP STAGE ===
      summaryText += `=== FASE DE GRUPOS ===\n`;
      summaryText += `(Posiciones 1ro al 4to por grupo)\n\n`;
      if (groupData && groupData.picks) {
        Object.entries(groupData.picks).forEach(([g, teams]) => {
          summaryText += `Grupo ${g}:\n`;
          summaryText += `  🥇 1ro: ${teams[0] || "—"}\n`;
          summaryText += `  🥈 2do: ${teams[1] || "—"}\n`;
          summaryText += `  🥉 3ro: ${teams[2] || "—"}\n`;
          summaryText += `  4to: ${teams[3] || "—"}\n\n`;
        });
      }

      // === THIRD PLACE SELECTIONS ===
      if (groupData && groupData.thirdPlaces && groupData.thirdPlaces.length > 0) {
        summaryText += `Los 8 mejores terceros lugares seleccionados:\n`;
        groupData.thirdPlaces.forEach((team, i) => {
          summaryText += `  ${i + 1}. ${team}\n`;
        });
        summaryText += `\n`;
      }

      summaryText += `========================================\n\n`;

      // === KNOCKOUT BRACKET ===
      summaryText += `=== LLAVE ELIMINATORIA ===\n\n`;

      summaryText += `🏆 CAMPEÓN: ${champion}\n`;
      const runnerUp = bracket.FINAL[0].team1 === champion ? bracket.FINAL[0].team2 : bracket.FINAL[0].team1;
      summaryText += `🥈 FINALISTA: ${runnerUp || "TBD"}\n\n`;

      summaryText += `-- SEMIFINALISTAS --\n`;
      bracket.SF.forEach(m => {
         if(m.winner) summaryText += `  • ${m.winner}\n`;
      });

      summaryText += `\n-- CUARTOS DE FINAL (Ganadores) --\n`;
      bracket.QF.forEach(m => {
         if(m.winner) summaryText += `  • ${m.winner}\n`;
      });

      summaryText += `\n-- OCTAVOS DE FINAL (Ganadores) --\n`;
      bracket.R16.forEach(m => {
        if(m.winner) summaryText += `  • ${m.winner}\n`;
      });

      summaryText += `\n-- RONDA DE 32 (Ganadores) --\n`;
      bracket.R32.forEach(m => {
        if(m.winner) summaryText += `  • ${m.winner} (vs ${m.winner === m.team1 ? m.team2 : m.team1})\n`;
      });

      summaryText += `\n========================================\n`;
      summaryText += `Este correo es evidencia oficial de tus predicciones.\n`;
      summaryText += `========================================\n`;

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

      // Wait for audio to start before navigating
      await audioPromise;
      setTimeout(() => {
        window.location.href = "/success";
      }, 2000);
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
        <Link href="/standings" style={{display: "inline-block", marginTop: "1.5rem"}}>
          <button style={{background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer"}}>
            Ver Tabla de Posiciones
          </button>
        </Link>
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
