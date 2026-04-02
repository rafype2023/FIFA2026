import Link from "next/link";

export default function Success() {
  return (
    <main className="container">
      <div className="glass-panel" style={{maxWidth: "600px", margin: "4rem auto", padding: "3rem", textAlign: "center"}}>
        <h1 style={{color: "var(--primary)", fontSize: "4rem", marginBottom: "1rem"}}>GOOOOL !!!</h1>
        <h2>Tu bracket ha sido confirmado.</h2>
        <p style={{color: "var(--text-muted)", margin: "2rem 0", lineHeight: "1.6"}}>
          Hemos guardado con éxito tus predicciones para la Copa Mundial 2026.<br/>
          Te enviamos una confirmación por correo electrónico.
        </p>
        
        <audio src="/Gol.mp3" autoPlay />

        <Link href="/">
           <button className="btn-primary">Someter Otro Bracket</button>
        </Link>
      </div>
    </main>
  );
}
