import React, { createContext, useContext, useState, useCallback } from "react";
import { api } from "../api.js";

const CtaContext = createContext(null);
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

function buildWhatsAppUrl({ title, source, email, name }) {
  if (!WHATSAPP_NUMBER) return "";
  const message = [
    "Assalamu'alaikum, saya mau lanjut daftar/minat di Muslim Hebat.",
    "",
    `Minat: ${title || "-"}`,
    `Source: ${source || "-"}`,
    `Nama: ${name || "-"}`,
    `Email: ${email || "-"}`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function CtaProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState({ title: "", source: "" });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [msg, setMsg] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const openInterest = useCallback((m) => {
    setMeta(m);
    setEmail("");
    setName("");
    setStatus("idle");
    setMsg("");
    setWhatsappUrl("");
    setOpen(true);
  }, []);

  const close = () => setOpen(false);

  async function submit(e) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    setMsg("");
    setWhatsappUrl("");
    try {
      await api("/public/subscribers", {
        method: "POST",
        body: JSON.stringify({ email, name: name || undefined, source: meta.source }),
      });
      const wa = buildWhatsAppUrl({ ...meta, email, name });
      setStatus("success");
      setMsg(wa ? "Tercatat! Mau lanjut cepat? Klik WhatsApp di bawah." : "Tercatat! Kami kabari lewat email.");
      setWhatsappUrl(wa);
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
              Tinggal isi data singkat. Kami simpan sebagai lead, lalu bisa follow-up via email/WhatsApp.
            </p>
            <form onSubmit={submit} style={{ display: "grid", gap: 10, marginTop: 16 }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama (opsional)"
                disabled={status === "loading"}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kamu@email.com"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                className="btn btn--primary"
                disabled={status === "loading" || !email}
              >
                {status === "loading" ? "Mengirim..." : "Simpan minat"}
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
                  color: status === "error" ? "var(--coral-deep)" : "var(--sage-deep)",
                }}
              >
                {msg}
              </div>
            )}
            {whatsappUrl && (
              <a
                className="btn btn--sage"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                style={{ marginTop: 12, width: "100%" }}
              >
                Lanjut via WhatsApp
              </a>
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
