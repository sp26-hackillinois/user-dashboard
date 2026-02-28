"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-surface) 50%, var(--bg-primary) 100%)"
    }}>
      <div style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        padding: "48px",
        width: "100%",
        maxWidth: "420px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 className="heading" style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>
            Micropay Bazaar
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Developer Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--text-muted)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                color: "var(--text-primary)",
                fontSize: "14px",
                transition: "all 150ms ease"
              }}
              placeholder="dev@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--text-muted)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                color: "var(--text-primary)",
                fontSize: "14px",
                transition: "all 150ms ease"
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "8px", padding: "14px" }}
          >
            Sign In
          </button>
        </form>

        <div style={{
          marginTop: "24px",
          padding: "16px",
          background: "rgba(0, 255, 136, 0.05)",
          border: "1px solid rgba(0, 255, 136, 0.2)",
          borderRadius: "4px"
        }}>
          <p style={{ fontSize: "13px", color: "var(--accent-primary)" }}>
            <span style={{ fontWeight: "600" }}>Demo Mode:</span> Use any credentials to login
          </p>
        </div>
      </div>
    </div>
  );
}
