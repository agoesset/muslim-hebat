import React from "react";

export function ScrollToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollUp}
      aria-label="Kembali ke atas"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 100,
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "var(--ink)",
        color: "var(--bg)",
        border: "1.5px solid var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "3px 4px 0 var(--ink)",
        transform: visible ? "translateY(0)" : "translateY(80px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.3s ease, opacity 0.3s ease",
        fontSize: 20,
      }}
    >
      ↑
    </button>
  );
}
