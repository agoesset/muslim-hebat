import React from "react";

/**
 * EmptyState — ilustrasi + copy + CTA untuk daftar kosong.
 * Dipakai di list pages (produk/kelas/kajian/bacaan) ketika hasil filter = 0.
 */
export function EmptyState({ icon = "🌱", title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && onAction && (
        <button className="btn btn--primary" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}
