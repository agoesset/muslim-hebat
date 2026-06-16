import React from "react";
import { Icon } from "./icons.jsx";

export function FloatingActionBar({ c, clapped, onClap, saved, onSave, onShare }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const check = () => {
      const hero = document.querySelector("[data-article-hero]");
      if (!hero) return;
      const heroBottom = hero.getBoundingClientRect().bottom;
      setVisible(heroBottom < 0);
    };
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <div className={`fab ${visible ? "fab--show" : ""}`}>
      <button className="fab-btn" onClick={onClap} aria-label="Clap">
        <Icon.Heart size={18}/>
        <span>{c.claps + (clapped ? 1 : 0)}</span>
      </button>
      <button className="fab-btn" onClick={onSave} aria-label="Simpan">
        <Icon.Bookmark size={18}/>
      </button>
      <button className="fab-btn" onClick={onShare} aria-label="Bagikan">
        <Icon.ArrowUR size={18}/>
      </button>
    </div>
  );
}
