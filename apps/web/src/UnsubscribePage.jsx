import React from "react";
import { useSearchParams } from "react-router-dom";
import { Seo } from "./seo.jsx";

export function UnsubscribePage({ onNav }) {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) return;
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/public/subscribers/unsubscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token })
      });
      if (!res.ok) throw new Error("Gagal, coba lagi ya.");
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  return (
    <div className="page" style={{ paddingTop: 64, paddingBottom: 48 }}>
      <Seo title="Berhenti Berlangganan | Muslim Hebat" description="Berhenti menerima newsletter Muslim Hebat." noindex />
      {status === "done" ? (
        <>
          <h1 style={{ fontSize: "clamp(26px, 4.5vw, 34px)", letterSpacing: "-0.03em" }}>Kamu sudah berhenti berlangganan</h1>
          <p style={{ color: "var(--ink-soft)", margin: "12px 0 0", fontSize: 15, lineHeight: 1.6 }}>
            Email kamu sudah dihapus dari daftar newsletter.
          </p>
          <button type="button" className="link-text" style={{ marginTop: 18 }} onClick={() => onNav("home")}>
            Ke beranda →
          </button>
        </>
      ) : !token ? (
        <>
          <h1 style={{ fontSize: "clamp(26px, 4.5vw, 34px)", letterSpacing: "-0.03em" }}>Butuh tautan dari email</h1>
          <p style={{ color: "var(--ink-soft)", margin: "12px 0 0", fontSize: 15, lineHeight: 1.6 }}>
            Buka tautan berhenti berlangganan yang ada di email newsletter kamu.
          </p>
          <button type="button" className="link-text" style={{ marginTop: 18 }} onClick={() => onNav("home")}>
            Ke beranda →
          </button>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: "clamp(26px, 4.5vw, 34px)", letterSpacing: "-0.03em" }}>Berhenti berlangganan</h1>
          <p style={{ color: "var(--ink-soft)", margin: "12px 0 0", fontSize: 15, lineHeight: 1.6 }}>
            Konfirmasi kalau kamu ingin berhenti menerima newsletter dari Muslim Hebat.
          </p>
          {error && <p style={{ color: "var(--coral-deep)", fontSize: 13, marginTop: 12 }}>{error}</p>}
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 20, marginTop: 18, flexWrap: "wrap" }}>
            <button type="submit" className="link-text" disabled={status === "loading"}>
              {status === "loading" ? "Memproses…" : "Berhenti berlangganan →"}
            </button>
            <button type="button" className="link-text link-text--muted" onClick={() => onNav("home")}>
              Batal
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default UnsubscribePage;
