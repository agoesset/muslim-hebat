// ContactPage — inquiry form with validation.

import React from "react";
import { Icon } from "./icons.jsx";
import { Blob } from "./shell.jsx";
import { Seo } from "./seo.jsx";
import { toast } from "./Toast.jsx";
import { submitContact } from "./api/public.js";

export function ContactPage({ onNav }) {
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
      toast("Pesan berhasil dikirim! Kami akan membalas secepatnya. 💌", "success");
    } catch {
      toast("Gagal mengirim pesan. Coba lagi ya.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-screen-label="Contact">
      <Seo title="Hubungi Kami" description="Ada pertanyaan, saran, atau mau kolaborasi? Hubungi Muslim Hebat — kami bales secepatnya." keywords="kontak, hubungi, kolaborasi, pertanyaan" />

      <section className="shell" style={{ paddingTop: 24, paddingBottom: 32, position: "relative" }}>
        <Blob color="var(--sage)" size={260} top={20} right={60} opacity={0.4}/>
        <div className="card card--paper" style={{ padding: "44px 48px", maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span className="pill pill--ink"><Icon.Mail size={12}/> Ada yang mau disampaikan?</span>
            <h1 style={{ fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 700, lineHeight: 1, marginTop: 16 }}>
              Hubungi kami, <span style={{ fontFamily: "var(--font-hand)", color: "var(--coral-deep)", fontWeight: 500 }}>pelan-pelan aja</span>.
            </h1>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 12, maxWidth: 480, margin: "12px auto 0" }}>
              Ada pertanyaan, saran, mau kolaborasi, atau sekadar say hi? Isi form ini — tim Muslim Hebat bales secepatnya.
            </p>
          </div>

          {submitted ? (
            <div className="card card--sage" style={{ padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💌</div>
              <h3 style={{ fontSize: 24, marginBottom: 8 }}>Pesan sudah terkirim!</h3>
              <p style={{ color: "var(--ink-soft)", margin: 0 }}>Terima kasih sudah menghubungi kami. Tim Muslim Hebat akan membalas secepatnya.</p>
              <button className="btn btn--primary" style={{ marginTop: 20 }} onClick={() => setSubmitted(false)}>
                Kirim pesan lagi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FormField label="Nama" error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Nama kamu"
                    style={inputStyle(errors.name)}
                  />
                </FormField>
                <FormField label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@kamu.com"
                    style={inputStyle(errors.email)}
                  />
                </FormField>
              </div>
              <FormField label="Subjek" error={errors.subject}>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="Tentang apa pesan ini?"
                  style={inputStyle(errors.subject)}
                />
              </FormField>
              <FormField label="Pesan" error={errors.message}>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tulis pesan kamu di sini..."
                  rows={5}
                  style={{ ...inputStyle(errors.message), resize: "vertical" }}
                />
              </FormField>
              <button type="submit" className="btn btn--primary" disabled={loading} style={{ alignSelf: "flex-start" }}>
                {loading ? "Mengirim..." : "Kirim pesan"} <Icon.Arrow size={14}/>
              </button>
            </form>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(31,58,45,0.08)", display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            <ContactInfo icon="📧" label="Email" value="halo@muslimhebat.local" />
            <ContactInfo icon="📱" label="WhatsApp" value="+62 812-3456-7890" />
            <ContactInfo icon="📍" label="Lokasi" value="Jakarta, Indonesia" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 12, color: "var(--coral-deep)" }}>{error}</span>}
    </div>
  );
}

function ContactInfo({ icon, label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function inputStyle(hasError) {
  return {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    border: `1.5px solid ${hasError ? "var(--coral-deep)" : "rgba(31,58,45,0.12)"}`,
    background: "var(--paper)",
    fontFamily: "var(--font-body)",
    fontSize: 15,
    color: "var(--ink)",
    outline: "none",
    transition: "border-color 0.15s",
  };
}

export default ContactPage;
