import React from "react";
import { Bookmark, Minus, Plus, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { getSavedArticles } from "./saved-articles.js";
import { Seo } from "./seo.jsx";

const PREF_KEY = "muslim-hebat:reading-preferences";
const defaults = { fontSize: 17, lineHeight: 1.8 };

function readPreferences() {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(PREF_KEY) || "{}") }; } catch { return defaults; }
}

export function ProfilePage() {
  const [preferences, setPreferences] = React.useState(readPreferences);
  const savedCount = getSavedArticles().length;
  const update = (next) => {
    setPreferences(next);
    try { localStorage.setItem(PREF_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
    document.documentElement.style.setProperty("--article-font-size", `${next.fontSize}px`);
    document.documentElement.style.setProperty("--article-line-height", String(next.lineHeight));
  };

  return (
    <main className="page profile-page">
      <Seo title="Profil | Muslim Hebat" description="Atur pengalaman membaca dan koleksi bacaanmu." noindex />
      <span className="eyebrow">Ruangmu</span><h1>Profil</h1>
      <section className="card profile-card"><h2>Bacaan tersimpan</h2><p>{savedCount} artikel tersimpan di perangkat ini.</p><Link className="btn btn--outline" to="/disimpan"><Bookmark size={17}/>Lihat koleksi</Link></section>
      <section className="card profile-card"><h2>Preferensi membaca</h2><p>Ukuran teks: {preferences.fontSize}px</p><div className="preference-actions"><button className="btn btn--sm" type="button" aria-label="Perkecil teks" onClick={() => update({ ...preferences, fontSize: Math.max(14, preferences.fontSize - 1) })}><Minus size={16}/></button><button className="btn btn--sm" type="button" aria-label="Perbesar teks" onClick={() => update({ ...preferences, fontSize: Math.min(24, preferences.fontSize + 1) })}><Plus size={16}/></button><button className="btn btn--sm btn--ghost" type="button" onClick={() => update(defaults)}><RotateCcw size={15}/>Reset</button></div></section>
    </main>
  );
}

export function applyReadingPreferences() {
  const preferences = readPreferences();
  document.documentElement.style.setProperty("--article-font-size", `${preferences.fontSize}px`);
  document.documentElement.style.setProperty("--article-line-height", String(preferences.lineHeight));
}
