"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Success() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 1.0;
      audioRef.current.play().catch(err => {
        console.warn("Audio autoplay blocked:", err);
      });
    }
  }, []);

  return (
    <main className="container">
      <div className="glass-panel" style={{maxWidth: "600px", margin: "4rem auto", padding: "3rem", textAlign: "center"}}>
        <h1 style={{color: "var(--primary)", fontSize: "4rem", marginBottom: "1rem"}}>GOOOOL !!!</h1>
        <h2>Tu bracket ha sido confirmado.</h2>
        <p style={{color: "var(--text-muted)", margin: "2rem 0", lineHeight: "1.6"}}>
          Hemos guardado con éxito tus predicciones para la Copa Mundial 2026.<br/>
          Te enviamos una confirmación por correo electrónico.
        </p>

        <audio ref={audioRef} src="/Gol.mp3" preload="auto" />

        <Link href="/">
           <button className="btn-primary">Someter Otro Bracket</button>
        </Link>
      </div>
    </main>
  );
}
