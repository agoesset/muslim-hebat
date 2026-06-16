import React from "react";
import { Icon } from "./icons.jsx";

export function SearchBar({ value, onChange, placeholder = "Cari...", style = {} }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--paper)",
        border: "1.5px solid rgba(31,58,45,0.12)",
        borderRadius: 999,
        padding: "10px 18px",
        maxWidth: 400,
        width: "100%",
        transition: "border-color 0.15s, box-shadow 0.15s",
        ...style
      }}
    >
      <Icon.Search size={16} style={{ flexShrink: 0, color: "var(--ink-soft)" }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: 0,
          background: "transparent",
          outline: "none",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "var(--ink)",
          minWidth: 0
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            background: "none",
            border: 0,
            padding: 0,
            cursor: "pointer",
            color: "var(--ink-soft)",
            fontSize: 18,
            lineHeight: 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
