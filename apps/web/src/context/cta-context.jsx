import React, { createContext, useContext, useState, useCallback } from "react";
import { api } from "../api.js";
import { trackEvent } from "../analytics.js";

const CtaContext = createContext(null);
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const intentCopy = {
  buy: {
    submit: "Simpan minat & lanjut beli",
    intro: "Isi data singkat dulu. Setelah tersimpan, kamu bisa lanjut checkout via WhatsApp.",
    success: "Tercatat! Lanjutkan checkout via WhatsApp di bawah.",
    wa: "Assalamu'alaikum, saya mau beli produk Muslim Hebat.",
  },
  download: {
    submit: "Simpan minat & unduh",
    intro: "Isi data singkat dulu. Link/akses akan kami follow-up lewat email atau WhatsApp.",
    success: "Tercatat! Lanjut via WhatsApp kalau mau dibantu cepat.",
    wa: "Assalamu'alaikum, saya mau unduh produk Muslim Hebat.",
  },
  class: {
    submit: "Simpan minat & daftar batch",
    intro: "Isi data singkat dulu. Kami bantu proses pendaftaran batch dan info jadwalnya.",
    success: "Tercatat! Lanjut daftar batch via WhatsApp di bawah.",
    wa: "Assalamu'alaikum, saya mau daftar kelas Muslim Hebat.",
  },
  event: {
    submit: "Simpan minat & daftar kajian",
    intro: "Isi data singkat dulu. Kami kirim detail kajian dan link/reminder berikutnya.",
    success: "Tercatat! Lanjut tanya detail kajian via WhatsApp di bawah.",
    wa: "Assalamu'alaikum, saya mau daftar kajian Muslim Hebat.",
  },
  reminder: {
    submit: "Simpan minat & minta reminder",
    intro: "Isi data singkat dulu. Kami simpan supaya bisa kirim reminder kajian.",
    success: "Tercatat! Reminder akan kami follow-up.",
    wa: "Assalamu'alaikum, saya mau minta reminder kajian Muslim Hebat.",
  },
  subscribe: {
    submit: "Simpan email",
    intro: "Isi data singkat dulu. Kami kabari update bacaan, kelas, dan kajian terbaru.",
    success: "Tercatat! Kami kabari lewat email.",
    wa: "Assalamu'alaikum, saya mau ikut update Muslim Hebat.",
  },
};

function copyFor(intent) {
  return intentCopy[intent] || intentCopy.subscribe;
}

function buildWhatsAppUrl({ title, source, email, name, phone, intent, price }) {
  if (!WHATSAPP_NUMBER) return "";
  const c = copyFor(intent);
  const message = [
    c.wa,
    "",
    `Minat: ${title || "-"}`,
    price ? `Harga: ${price}` : "",
    `Source: ${source || "-"}`,
    `Nama: ${name || "-"}`,
    `Email: ${email || "-"}`,
    phone ? `No. WA: ${phone}` : "",
  ].filter(Boolean).join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function CtaProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState({ title: "", source: "", intent: "subscribe" });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [msg, setMsg] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const openInterest = useCallback((m) => {
    const nextMeta = { intent: "subscribe", ...m };
    setMeta(nextMeta);
    setEmail("");
    setName("");
    setPhone("");
    setStatus("idle");
    setMsg("");
    setWhatsappUrl("");
    setOpen(true);
    trackEvent("cta_open", { source: nextMeta.source, intent: nextMeta.intent, title: nextMeta.title });
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
      const wa = buildWhatsAppUrl({ ...meta, email, name, phone });
      const c = copyFor(meta.intent);
      setStatus("success");
      setMsg(wa ? c.success : "Tercatat! Kami kabari lewat email.");
      setWhatsappUrl(wa);
      trackEvent("lead_submit", { source: meta.source, intent: meta.intent });
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Gagal mengirim. Coba lagi ya.");
      trackEvent("lead_submit_error", { source: meta.source, intent: meta.intent });
    }
  }

  const c = copyFor(meta.intent);

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
              {c.intro}
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
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="No. WhatsApp (opsional)"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                className="btn btn--primary"
                disabled={status === "loading" || !email}
              >
                {status === "loading" ? "Mengirim..." : c.submit}
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
                onClick={() => trackEvent("whatsapp_click", { source: meta.source, intent: meta.intent })}
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
