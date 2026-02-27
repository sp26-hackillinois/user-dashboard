"use client";

import { useState } from "react";
import { generateApiKey } from "@/services/api";

export default function APIKeysPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState("mp_live_9x8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c");
  const [generating, setGenerating] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const result: any = await generateApiKey();
    setApiKey(result.apiKey);
    setGenerating(false);
    setIsRevealed(true);
  };

  return (
    <div className="content-wrapper">
      <h1 className="section-header">API Keys</h1>
      <p className="section-subheader" style={{ marginTop: "-16px", marginBottom: "32px" }}>
        Manage your Micropay API keys for authentication
      </p>

      <div style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        padding: "32px",
        marginBottom: "24px"
      }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
            Production API Key
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Use this key to authenticate API requests
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
          <input
            type="text"
            value={apiKey}
            readOnly
            className={`api-key-input ${!isRevealed ? "api-key-blurred" : ""}`}
            style={{ flex: 1 }}
          />
          <button
            onClick={() => setIsRevealed(!isRevealed)}
            className="btn btn-secondary"
          >
            {isRevealed ? "Hide" : "Reveal"}
          </button>
          <button
            onClick={handleCopy}
            className="btn btn-primary"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn btn-secondary"
          style={{ fontSize: "13px" }}
        >
          {generating ? "Generating..." : "Regenerate Key"}
        </button>
      </div>

      <div style={{
        background: "rgba(255, 68, 85, 0.1)",
        border: "1px solid rgba(255, 68, 85, 0.3)",
        borderRadius: "6px",
        padding: "20px"
      }}>
        <p style={{ fontSize: "13px", color: "var(--danger)", fontWeight: "600", marginBottom: "8px" }}>
          Security Notice
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          Never share your API key publicly or commit it to version control. Regenerating a key will invalidate the previous one.
        </p>
      </div>

      <div style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        padding: "32px",
        marginTop: "32px"
      }}>
        <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>
          Quick Start
        </h3>

        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            1. Include your API key in the request header
          </p>
          <pre style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "16px",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "13px",
            color: "var(--accent-primary)",
            overflowX: "auto"
          }}>
{`Authorization: Bearer ${apiKey}`}
          </pre>
        </div>

        <div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            2. Make requests to the Micropay API
          </p>
          <pre style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "16px",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "13px",
            color: "var(--accent-primary)",
            overflowX: "auto"
          }}>
{`curl http://localhost:3000/api/payment \\
  -H "Authorization: Bearer ${apiKey}"`}
          </pre>
        </div>

        <div style={{ marginTop: "24px" }}>
          <a
            href="http://localhost:3000/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            View Full API Documentation →
          </a>
        </div>
      </div>
    </div>
  );
}
