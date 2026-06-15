import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary caught:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="shell" style={{ padding: "80px 20px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 48, marginBottom: 16 }}>
            😥
          </div>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Ada yang error</h1>
          <p style={{ color: "var(--ink-soft)", maxWidth: 460, margin: "0 auto 24px" }}>
            Halaman ini gagal dimuat. Coba refresh atau kembali ke beranda.
          </p>
          <button className="btn btn--primary" onClick={() => window.location.href = "/"}>
            Ke beranda
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{ marginTop: 24, textAlign: "left", background: "var(--bg-soft)", padding: 16, borderRadius: 16, fontSize: 12, overflow: "auto" }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
