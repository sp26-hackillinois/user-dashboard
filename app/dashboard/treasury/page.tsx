"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const mockTreasuryData = [
  { date: "Jan 1", value: 10.0, apy: 2.2 },
  { date: "Jan 5", value: 10.12, apy: 2.3 },
  { date: "Jan 10", value: 10.25, apy: 2.4 },
  { date: "Jan 15", value: 10.41, apy: 2.5 },
  { date: "Jan 20", value: 10.58, apy: 2.4 },
  { date: "Jan 25", value: 10.72, apy: 2.5 },
  { date: "Jan 30", value: 10.89, apy: 2.6 },
];

export default function TreasuryPage() {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className="content-wrapper">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 className="section-header" style={{ marginBottom: "8px" }}>Treasury Management</h1>
          <p className="section-subheader">
            Automatically earn yield on idle funds through Jupiter DeFi integration
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "600", fontFamily: "Syne, sans-serif" }}>
            Enable Autonomous Yield
          </span>
          <div
            className={`treasury-toggle ${isEnabled ? "treasury-toggle-active" : ""}`}
            onClick={() => setIsEnabled(!isEnabled)}
          >
            <div className="treasury-toggle-knob" />
          </div>
        </div>
      </div>

      {isEnabled && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
            <div style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "24px"
            }}>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Current Yield
              </p>
              <p className="mono" style={{ fontSize: "32px", fontWeight: "600", color: "var(--accent-primary)" }}>
                +2.4% APY
              </p>
            </div>

            <div style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "24px"
            }}>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Total Deposited
              </p>
              <p className="mono" style={{ fontSize: "32px", fontWeight: "600", color: "var(--text-primary)" }}>
                12.45 SOL
              </p>
            </div>

            <div style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "24px"
            }}>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Yield Earned (30d)
              </p>
              <p className="mono" style={{ fontSize: "32px", fontWeight: "600", color: "var(--accent-primary)" }}>
                +0.089 SOL
              </p>
            </div>
          </div>

          <div className="chart-container grid-pattern" style={{ marginBottom: "32px" }}>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>
              Treasury Growth Over Time
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={mockTreasuryData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
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
                    color: "var(--text-primary)"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--accent-primary)"
                  strokeWidth={3}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "32px",
            marginBottom: "32px"
          }}>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>
              How It Works
            </h3>

            <div style={{ display: "grid", gap: "20px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(0, 255, 136, 0.15)",
                  border: "1px solid rgba(0, 255, 136, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontWeight: "600",
                  color: "var(--accent-primary)",
                  flexShrink: 0
                }}>
                  1
                </div>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "6px", fontFamily: "Syne, sans-serif" }}>
                    Automatic Detection
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                    When your idle wallet balance exceeds $10, Micropay automatically detects eligible funds for yield optimization
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(0, 255, 136, 0.15)",
                  border: "1px solid rgba(0, 255, 136, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontWeight: "600",
                  color: "var(--accent-primary)",
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "6px", fontFamily: "Syne, sans-serif" }}>
                    Jupiter Integration
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                    Funds are automatically swapped into JitoSOL via the Jupiter API to maximize yield potential
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(0, 255, 136, 0.15)",
                  border: "1px solid rgba(0, 255, 136, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontWeight: "600",
                  color: "var(--accent-primary)",
                  flexShrink: 0
                }}>
                  3
                </div>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "6px", fontFamily: "Syne, sans-serif" }}>
                    Earn Yield
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                    Your funds earn competitive APY while remaining liquid and accessible for immediate withdrawals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div style={{
        background: "rgba(255, 170, 0, 0.1)",
        border: "1px solid rgba(255, 170, 0, 0.3)",
        borderRadius: "6px",
        padding: "20px",
        marginBottom: "32px"
      }}>
        <p style={{ fontSize: "13px", color: "var(--warning)", fontWeight: "600", marginBottom: "8px" }}>
          Testnet Only — No Real Funds at Risk
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          This treasury feature is running on Solana testnet. All yield calculations and transactions are simulated for testing purposes.
        </p>
      </div>

      {isEnabled && (
        <div style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "32px"
        }}>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>
            Risk & Safety
          </h3>
          <ul style={{ display: "grid", gap: "12px", listStyle: "none" }}>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ color: "var(--accent-primary)", marginTop: "2px" }}>•</span>
              <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Funds remain non-custodial and under your control at all times
              </span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ color: "var(--accent-primary)", marginTop: "2px" }}>•</span>
              <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Withdraw anytime without penalties or lock-up periods
              </span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ color: "var(--accent-primary)", marginTop: "2px" }}>•</span>
              <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                JitoSOL is a liquid staking token with minimal slippage on Jupiter
              </span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ color: "var(--accent-primary)", marginTop: "2px" }}>•</span>
              <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Smart contracts audited by leading blockchain security firms
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
