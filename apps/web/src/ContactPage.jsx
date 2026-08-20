// ContactPage — form minimal dengan validasi.

import React from "react";
import { Seo } from "./seo.jsx";
import { toast } from "./Toast.jsx";
import { submitContact } from "./api/public.js";

export function ContactPage() {
  const [form, setForm] = React.useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid";
    if (!form.subject.trim()) e.subject = "Subjek wajib diisi";
    if (!form.message.trim()) e.message = "Pesan wajib diisi";
    else if (form.message.trim().length < 10) e.message = "Pesan minimal 10 karakter";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      await submitContact(form);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast("Pesan berhasil dikirim! Kami akan membalas secepatnya.", "success");
    } catch {
      toast("Gagal mengirim pesan. Coba lagi ya.", "error");
    } finally {
      setLoading(false);
    }
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div data-screen-label="Contact">
      <Seo title="Hubungi Kami" description="Ada pertanyaan, saran, atau mau kolaborasi? Hubungi Muslim Hebat — kami bales secepatnya." keywords="kontak, hubungi, kolaborasi, pertanyaan" />

      <section className="page blog-section">
        <div className="home-hero">
          <h1 className="home-hero__title">Kontak</h1>
          <p className="home-hero__sub">
            Pertanyaan, saran, kolaborasi, atau sekadar say hi — tulis di sini.
          </p>
        </div>

        {submitted ? (
          <div style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 24 }}>
            <h2 style={{ fontSize: 20 }}>Pesan sudah terkirim.</h2>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: "6px 0 0" }}>
              Terima kasih sudah menghubungi kami — kami balas secepatnya.
            </p>
            <button type="button" className="link-text" style={{ marginTop: 14 }} onClick={() => setSubmitted(false)}>
              Kirim pesan lagi →
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 22, borderTop: "1px solid var(--line-soft)", paddingTop: 24 }}
          >
            <FormField label="Nama" error={errors.name} id="contact-name">
              <input
                id="contact-name"
                className={`field-line${errors.name ? " field-line--error" : ""}`}
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={set("name")}
                placeholder="Nama kamu"
              />
            </FormField>

            <FormField label="Email" error={errors.email} id="contact-email">
              <input
                id="contact-email"
                className={`field-line${errors.email ? " field-line--error" : ""}`}
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                placeholder="email@kamu.com"
              />
            </FormField>

            <FormField label="Subjek" error={errors.subject} id="contact-subject">
              <input
                id="contact-subject"
                className={`field-line${errors.subject ? " field-line--error" : ""}`}
                type="text"
                value={form.subject}
                onChange={set("subject")}
                placeholder="Tentang apa pesan ini?"
              />
            </FormField>

            <FormField label="Pesan" error={errors.message} id="contact-message">
              <textarea
                id="contact-message"
                className={`field-line${errors.message ? " field-line--error" : ""}`}
                value={form.message}
                onChange={set("message")}
                placeholder="Tulis pesan kamu di sini…"
                rows={4}
                style={{ resize: "vertical" }}
              />
            </FormField>

            <button type="submit" className="link-text" disabled={loading} style={{ alignSelf: "flex-start" }}>
              {loading ? "Mengirim…" : "Kirim pesan →"}
            </button>
          </form>
        )}

        <div
          style={{
            marginTop: 32,
            paddingTop: 20,
            borderTop: "1px solid var(--line-soft)",
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 24px",
            fontSize: 13,
            color: "var(--ink-soft)",
          }}
        >
          <span>halo@muslimhebat.local</span>
          <span>+62 812-3456-7890</span>
          <span>Jakarta, Indonesia</span>
        </div>
      </section>
    </div>
  );
}

function FormField({ label, error, id, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {error && <span role="alert" style={{ fontSize: 12, color: "var(--coral-deep)" }}>{error}</span>}
    </div>
  );
}

export default ContactPage;
