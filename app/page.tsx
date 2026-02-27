"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import MetricCard from "@/components/MetricCard";
import { fetchDashboardStats } from "@/services/api";

const mockTreasuryData = [
  { date: "Jan 1", value: 10.0 },
  { date: "Jan 5", value: 10.12 },
  { date: "Jan 10", value: 10.25 },
  { date: "Jan 15", value: 10.41 },
  { date: "Jan 20", value: 10.58 },
  { date: "Jan 25", value: 10.72 },
  { date: "Jan 30", value: 10.89 },
];

type Transaction = {
  id: string;
  amount: string;
  status: "settled" | "requires_signature" | "failed";
  description: string;
  time: string;
};

const mockTransactions: Transaction[] = [
  { id: "txn_8k2j9d1m", amount: "0.0042", status: "settled", description: "Premium feature unlock", time: "2 min ago" },
  { id: "txn_7h3k8s2p", amount: "0.0018", status: "settled", description: "API call payment", time: "15 min ago" },
  { id: "txn_9m4n7f3q", amount: "0.0095", status: "requires_signature", description: "Monthly subscription", time: "1 hr ago" },
  { id: "txn_6j2k9d5r", amount: "0.0031", status: "settled", description: "Content access fee", time: "3 hrs ago" },
  { id: "txn_5h8j3k2s", amount: "0.0067", status: "failed", description: "Premium upgrade", time: "5 hrs ago" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalVolume: "$0.00", transactionCount: 0 });
  const [apiKeyRevealed, setApiKeyRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [treasuryEnabled, setTreasuryEnabled] = useState(true);

  const apiKey = "mp_live_9x8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c";

  useEffect(() => {
    fetchDashboardStats().then((data: any) => {
      setStats({
        totalVolume: data.totalVolume,
        transactionCount: data.transactionCount,
      });
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleTreasury = () => {
    setTreasuryEnabled(!treasuryEnabled);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          width: "240px",
          flexShrink: 0,
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
        }}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">Micropay</div>
          <span className="devnet-badge">DEVNET</span>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item nav-item-active">
            Dashboard
          </a>
          <a href="#" className="nav-item">
            API Keys
          </a>
          <a href="#" className="nav-item">
            Transactions
          </a>
          <a href="#" className="nav-item">
            Treasury
          </a>
        </nav>

        <div className="sidebar-footer">v1.0.0 · Solana Devnet</div>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: "240px",
          flex: 1,
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Navbar */}
        <div className="navbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="navbar-logo">Micropay</div>
            <span className="devnet-badge">DEVNET</span>
          </div>
          <a
            href="http://localhost:3000/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            View API Docs
          </a>
        </div>

        {/* Content Wrapper */}
        <div className="content-wrapper">
          {/* Metrics Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            <MetricCard
              title="Total Volume"
              value={stats.totalVolume}
              percentChange="+12.3%"
              delay={0}
            />
            <MetricCard
              title="Transaction Count"
              value={stats.transactionCount.toString()}
              percentChange="+8.1%"
              delay={100}
            />
            <MetricCard
              title="Success Rate"
              value="98.4%"
              percentChange="+0.3%"
              delay={200}
            />
          </div>

          {/* API Keys Section */}
          <div style={{ marginBottom: "40px" }}>
            <h2 className="section-header">API Keys</h2>
            <div
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <input
                  type="text"
                  value={apiKey}
                  readOnly
                  className={`api-key-input ${!apiKeyRevealed ? "api-key-blurred" : ""}`}
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => setApiKeyRevealed(!apiKeyRevealed)}
                  className="btn btn-secondary"
                >
                  {apiKeyRevealed ? "Hide" : "Reveal"}
                </button>
                <button onClick={handleCopy} className="btn btn-primary">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Treasury Section */}
          <div style={{ marginBottom: "40px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div>
                <h2 className="section-header" style={{ marginBottom: "0" }}>
                  Treasury Management
                </h2>
                <p className="section-subheader">Autonomous Yield via Jupiter</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--text-muted)",
                    fontWeight: "600",
                  }}
                >
                  Enable Autonomous Yield
                </span>
                <div
                  className={`treasury-toggle ${treasuryEnabled ? "treasury-toggle-active" : ""}`}
                  onClick={handleToggleTreasury}
                >
                  <div className="treasury-toggle-knob" />
                </div>
              </div>
            </div>

            {treasuryEnabled && (
              <div
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "24px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                      }}
                    >
                      Current Yield
                    </p>
                    <p
                      className="mono"
                      style={{
                        fontSize: "28px",
                        fontWeight: "600",
                        color: "var(--accent-primary)",
                      }}
                    >
                      +2.4% APY
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                      }}
                    >
                      Asset
                    </p>
                    <p
                      className="mono"
                      style={{
                        fontSize: "28px",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                      }}
                    >
                      JitoSOL
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="chart-container grid-pattern">
              <h3
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "20px",
                }}
              >
                Treasury Growth
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockTreasuryData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    stroke="var(--text-muted)"
                    style={{ fontSize: "12px", fontFamily: "IBM Plex Mono, monospace" }}
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    style={{ fontSize: "12px", fontFamily: "IBM Plex Mono, monospace" }}
                    domain={[10, 11]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      fontFamily: "IBM Plex Mono, monospace",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--accent-primary)"
                    strokeWidth={2}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions Table */}
          <div>
            <h2 className="section-header">Recent Transactions</h2>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount (SOL)</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((txn) => (
                  <tr key={txn.id}>
                    <td>
                      <code className="mono" style={{ fontSize: "13px" }}>
                        {txn.id}
                      </code>
                    </td>
                    <td>
                      <span className="mono" style={{ fontWeight: "600" }}>
                        {txn.amount}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          txn.status === "settled"
                            ? "status-settled"
                            : txn.status === "requires_signature"
                            ? "status-requires-signature"
                            : "status-failed"
                        }`}
                      >
                        {txn.status === "settled"
                          ? "Settled"
                          : txn.status === "requires_signature"
                          ? "Pending"
                          : "Failed"}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{txn.description}</td>
                    <td>
                      <span
                        className="mono"
                        style={{ fontSize: "13px", color: "var(--text-muted)" }}
                      >
                        {txn.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
