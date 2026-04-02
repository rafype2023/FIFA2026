import Link from "next/link";

export default function Success() {
  return (
    <main className="container">
      <div className="glass-panel" style={{maxWidth: "600px", margin: "4rem auto", padding: "3rem", textAlign: "center"}}>
        <h1 style={{color: "var(--primary)", fontSize: "3rem", marginBottom: "1rem"}}>Goal!</h1>
        <h2>Your bracket is confirmed.</h2>
        <p style={{color: "var(--text-muted)", margin: "2rem 0", lineHeight: "1.6"}}>
          We have successfully saved your predictions for the 2026 World Cup.<br/>
          An email confirmation has been sent to your inbox.
        </p>
        <Link href="/">
           <button className="btn-primary">Submit Another Bracket</button>
        </Link>
      </div>
    </main>
  );
}
