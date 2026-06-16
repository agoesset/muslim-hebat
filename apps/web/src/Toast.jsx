import React from "react";

let toastId = 0;
const listeners = new Set();

export function toast(message, type = "info", duration = 3000) {
  const id = ++toastId;
  listeners.forEach((fn) => fn({ id, message, type, duration }));
}

export function ToastContainer() {
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    const handle = (t) => setToasts((prev) => [...prev, t]);
    listeners.add(handle);
    return () => listeners.delete(handle);
  }, []);

  function remove(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 360,
        width: "calc(100% - 40px)",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={remove} />
      ))}
    </div>
  );
}

function ToastItem({ toast: t, onRemove }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(t.id), 300);
    }, t.duration);
    return () => clearTimeout(timer);
  }, [t.id, t.duration, onRemove]);

  const colors = {
    success: { bg: "var(--sage)", border: "var(--sage-deep)", icon: "✓" },
    error: { bg: "var(--coral)", border: "var(--coral-deep)", icon: "✕" },
    info: { bg: "var(--lilac)", border: "var(--lilac-deep)", icon: "ℹ" },
    warning: { bg: "var(--butter)", border: "var(--peach-deep)", icon: "⚠" },
  };
  const c = colors[t.type] || colors.info;

  return (
    <div
      style={{
        pointerEvents: "auto",
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        borderRadius: "var(--radius-sm)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 14,
        fontWeight: 500,
        boxShadow: "3px 4px 0 var(--ink)",
        transform: visible ? "translateX(0)" : "translateX(120%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.3s ease, opacity 0.3s ease",
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "var(--paper)",
          border: `1.5px solid ${c.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          flexShrink: 0,
        }}
      >
        {c.icon}
      </span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(t.id), 300);
        }}
        style={{
          background: "none",
          border: 0,
          padding: 0,
          cursor: "pointer",
          fontSize: 16,
          color: "var(--ink-soft)",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
