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
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "#0a0a0f",
            color: "#e8e8f0",
            gap: "16px",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          <div style={{ fontSize: "48px" }}>⚠️</div>
          <h2 style={{ fontSize: "20px", fontWeight: 800 }}>
            Something went wrong
          </h2>
          <p style={{ color: "#6b6b8a", fontSize: "13px" }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 24px",
              background: "#7c6cfa",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "14px",
            }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
