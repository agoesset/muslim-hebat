import React from "react";
export function SectionHeader({ kicker, title, sub, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, gap: 24, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 400px" }}>
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 24, color: "var(--coral-deep)", marginBottom: 6 }}>{kicker}</div>
        <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em" }}>{title}</h2>
        {sub && <p style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 8, maxWidth: 480 }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}
