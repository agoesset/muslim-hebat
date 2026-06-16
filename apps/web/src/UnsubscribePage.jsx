import React from "react";
import { Icon } from "./icons.jsx";
import { SunDecor, Blob } from "./shell.jsx";

export function UnsubscribePage({ onNav }) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/public/subscribers/unsubscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error("Gagal, coba lagi ya.");
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  return (
    <div className="shell" style={{ paddingTop: 60, paddingBottom: 60, minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <SunDecor size={120} style={{ position: "absolute", top: 40, right: 40, opacity: 0.3 }} className="illus-only"/>
      <Blob color="var(--peach)" size={250} top={-80} left={-60} opacity={0.2}/>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
        {status === "done" ? (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>😢</div>
            <h1 style={{ fontSize: 36 }}>Kamu sudah berhenti berlangganan</h1>
            <p style={{ color: "var(--ink-soft)", marginTop: 16, fontSize: 16, lineHeight: 1.6 }}>
              Kami sedih lihat kamu pergi, tapi kami hormati keputusanmu. <br/>
              Email <strong>{email}</strong> sudah dihapus dari daftar newsletter.
            </p>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 12 }}>
              Kamu bisa selalu berlangganan lagi kapan pun lewat halaman utama.
            </p>
            <button className="btn btn--primary" style={{ marginTop: 24 }} onClick={() => onNav("home")}>
              Kembali ke Beranda
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✉️</div>
            <h1 style={{ fontSize: 36 }}>Berhenti Berlangganan</h1>
            <p style={{ color: "var(--ink-soft)", marginTop: 12, fontSize: 15, lineHeight: 1.6 }}>
              Masukkan email kamu untuk berhenti menerima newsletter dari Muslim Hebat.
            </p>
            <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
              <input
                type="email"
                required
                placeholder="email@kamu.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: "100%", padding: "14px 18px", fontSize: 16, borderRadius: 14,
                  border: "1.5px solid var(--ink)", background: "var(--paper)",
                  color: "var(--ink)", outline: "none", boxSizing: "border-box"
                }}
              />
              {error && <p style={{ color: "var(--coral-deep)", fontSize: 13, marginTop: 8 }}>{error}</p>}
              <button type="submit" className="btn" style={{ marginTop: 16, width: "100%", padding: "14px", fontSize: 16 }} disabled={status === "loading"}>
                {status === "loading" ? "Memproses…" : "Berhenti Berlangganan"}
              </button>
            </form>
            <button className="btn btn--ghost" style={{ marginTop: 16 }} onClick={() => onNav("home")}>
              Batal
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default UnsubscribePage;
