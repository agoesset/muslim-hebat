import React from "react";

export function Skeleton({ width, height, circle = false, className = "" }) {
  return (
    <div
      className={`skeleton ${circle ? "skeleton-circle" : ""} ${className}`}
      style={{ width: width || "100%", height: height || "1em" }}
    />
  );
}

export function SkeletonText({ lines = 3, width = "100%" }) {
  return (
    <div style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton skeleton-text" style={{ width: i === lines - 1 ? "70%" : "100%" }} />
      ))}
    </div>
  );
}

export function SkeletonCard({ children, style = {} }) {
  return (
    <div className="skeleton skeleton-card" style={{ padding: 0, ...style }}>
      {children}
    </div>
  );
}

export function SkeletonGrid({ count, columns = 3, cardHeight = 320, gap = 20, style = {} }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        ...style
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} style={{ minHeight: cardHeight }} />
      ))}
    </div>
  );
}

export function SkeletonArticle() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 32, maxWidth: 920, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Skeleton circle width={40} height={40} />
        <Skeleton circle width={40} height={40} />
        <Skeleton circle width={40} height={40} />
      </div>
      <div>
        <Skeleton height={24} style={{ marginBottom: 16, width: "60%" }} />
        <SkeletonText lines={5} />
        <Skeleton height={200} style={{ marginTop: 24, borderRadius: "var(--radius)" }} />
        <SkeletonText lines={4} />
      </div>
    </div>
  );
}

export function SkeletonKajianRow() {
  return (
    <div className="card" style={{ padding: 22, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center" }}>
      <Skeleton width={86} height={86} style={{ borderRadius: 18 }} />
      <div>
        <Skeleton height={20} style={{ marginBottom: 10, width: "70%" }} />
        <Skeleton height={14} style={{ marginBottom: 6, width: "40%" }} />
        <Skeleton height={14} style={{ width: "50%" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton width={80} height={32} style={{ borderRadius: 999 }} />
        <Skeleton width={80} height={28} style={{ borderRadius: 999 }} />
      </div>
    </div>
  );
}

export function SkeletonBatchCard() {
  return (
    <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <Skeleton width={64} height={64} style={{ borderRadius: 14 }} />
        <div style={{ flex: 1 }}>
          <Skeleton height={16} style={{ marginBottom: 8, width: "80%" }} />
          <Skeleton height={14} style={{ width: "60%" }} />
        </div>
      </div>
      <Skeleton height={12} style={{ width: "90%" }} />
      <Skeleton height={8} style={{ width: "100%", borderRadius: 999 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
        <Skeleton width={80} height={24} />
        <Skeleton width={90} height={28} style={{ borderRadius: 999 }} />
      </div>
    </div>
  );
}
