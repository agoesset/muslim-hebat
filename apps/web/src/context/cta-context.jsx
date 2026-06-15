import React, { createContext, useContext, useState, useCallback } from "react";
import { api } from "../api.js";

const CtaContext = createContext(null);

export function CtaProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState({ title: "", source: "" });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [msg, setMsg] = useState("");

  const openInterest = useCallback((m) => {
    setMeta(m);
    setEmail("");
    setStatus("idle");
    setMsg("");
    setOpen(true);
  }, []);

  const close = () => setOpen(false);

  async function submit(e) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    setMsg("");
    try {
      await api("/public/subscribers", {
        method: "POST",
        body: JSON.stringify({ email, source: meta.source }),
      });
      setStatus("success");
      setMsg("Tercatat! Kami kabari lewat email.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Gagal mengirim. Coba lagi ya.");
    }
  }

  return (
    <CtaContext.Provider value={{ openInterest }}>
      {children}
      {open && (
        <div
          className="modal-backdrop"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cta-title"
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="cta-title" style={{ margin: 0, fontFamily: "var(--font-display)" }}>
              {meta.title}
            </h3>
            <p style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: 14 }}>
              Masukkan email, kami kabari info selanjutnya.
            </p>
            <form onSubmit={submit} style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kamu@email.com"
                disabled={status === "loading"}
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                className="btn btn--primary"
                disabled={status === "loading" || !email}
              >
                {status === "loading" ? "Mengirim..." : "Kirim"}
              </button>
            </form>
            {msg && (
              <div
                role="status"
                aria-live="polite"
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  color: status === "error" ? "var(--coral-deep)" : "var(--leaf)",
                }}
              >
                {msg}
              </div>
            )}
            <button
              onClick={close}
              className="btn btn--ghost"
              style={{ marginTop: 16, width: "100%" }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </CtaContext.Provider>
  );
}

export function useCta() {
  const ctx = useContext(CtaContext);
  if (!ctx) throw new Error("useCta must be used inside CtaProvider");
  return ctx;
}
