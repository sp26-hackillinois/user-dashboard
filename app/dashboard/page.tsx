"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import MetricCard from "@/components/MetricCard";
import Sidebar from "@/components/Sidebar";
import { getDashboardStats } from "@/services/solana";

const mockTransactionHistory = [
  { day: 'Mon', volume: 2.1, count: 210 },
  { day: 'Tue', volume: 3.4, count: 340 },
  { day: 'Wed', volume: 2.8, count: 280 },
  { day: 'Thu', volume: 5.2, count: 520 },
  { day: 'Fri', volume: 4.1, count: 410 },
  { day: 'Sat', volume: 6.7, count: 670 },
  { day: 'Sun', volume: 5.9, count: 590 },
];

type Transaction = {
  id: string;
  amount: number;
  status: "settled" | "failed";
  description: string;
  time: string;
  fullSignature: string;
};

export default function DashboardPage() {
  const [totalVolume, setTotalVolume] = useState("—");
  const [transactionCount, setTransactionCount] = useState<number | string>("—");
  const [successRate, setSuccessRate] = useState("—");
  const [currentBalance, setCurrentBalance] = useState("—");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [apiKeyRevealed, setApiKeyRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionView, setTransactionView] = useState<"chart" | "table">("table");
  const [registerFormSubmitted, setRegisterFormSubmitted] = useState(false);
  const [generatedServiceId, setGeneratedServiceId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    endpoint: "",
    cost: "",
    category: "Weather",
    tags: "",
    wallet: ""
  });

  const apiKey = "mp_live_9x8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c";

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await getDashboardStats();
        setTotalVolume(stats.totalVolume);
        setTransactionCount(stats.transactionCount);
        setSuccessRate(stats.successRate);
        setCurrentBalance(stats.currentBalance);
        setTransactions(stats.transactions as Transaction[]);
      } catch {
        setTotalVolume('—');
        setTransactionCount('—');
        setSuccessRate('—');
        setCurrentBalance('—');
        setTransactions([]);
      }
    }
    loadStats();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceId = `srv_${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedServiceId(serviceId);
    setRegisterFormSubmitted(true);
    setTimeout(() => {
      setRegisterFormSubmitted(false);
      setFormData({
        name: "",
        description: "",
        endpoint: "",
        cost: "",
        category: "Weather",
        tags: "",
        wallet: ""
      });
    }, 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh", width: "100%", margin: 0, padding: 0 }}>
      <Sidebar />
      <main style={{ marginLeft: "240px", flex: 1, minHeight: "100vh", overflowY: "auto", background: "var(--bg-primary)" }}>
    <div className="content-wrapper">
      {/* Top Navbar */}
      <div className="navbar" style={{ marginLeft: "-40px", marginTop: "-40px", marginRight: "-40px", marginBottom: "40px" }}>
        <div className="navbar-logo">Micropay</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
          <a
            href="http://localhost:3000/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            View API Docs
          </a>
          <div style={{ display: "flex", gap: "8px", fontSize: "10px", fontFamily: "IBM Plex Mono, monospace", color: "var(--text-muted)" }}>
            <span>GET /v1/registry/discover</span>
            <span>·</span>
            <span>POST /v1/charges</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <MetricCard
          title="Current Balance"
          value={currentBalance}
          percentChange=""
          delay={0}
        />
        <MetricCard
          title="Transaction Count"
          value={transactionCount.toString()}
          percentChange=""
          delay={100}
        />
        <MetricCard
          title="Success Rate"
          value={successRate}
          percentChange=""
          delay={200}
        />
      </div>

      {/* API Keys Section */}
      <div id="keys" style={{ marginBottom: "40px" }}>
        <h2 className="section-header">API Keys</h2>
        <div style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "24px"
        }}>
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
            <button
              onClick={handleCopy}
              className="btn btn-primary"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div id="transactions" style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 className="section-header" style={{ marginBottom: "0" }}>Recent Transactions</h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setTransactionView("chart")}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid var(--border)",
                background: transactionView === "chart" ? "var(--accent-primary)" : "var(--bg-elevated)",
                color: transactionView === "chart" ? "var(--bg-primary)" : "var(--text-primary)",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 150ms ease"
              }}
            >
              Chart
            </button>
            <button
              onClick={() => setTransactionView("table")}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid var(--border)",
                background: transactionView === "table" ? "var(--accent-primary)" : "var(--bg-elevated)",
                color: transactionView === "table" ? "var(--bg-primary)" : "var(--text-primary)",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 150ms ease"
              }}
            >
              Table
            </button>
          </div>
        </div>

        <div style={{ display: transactionView === "chart" ? "block" : "none" }}>
          <div style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "24px",
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
            backgroundSize: '20px 20px',
            opacity: 0,
            animation: "fadeIn 300ms ease forwards"
          }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTransactionHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="day"
                  stroke="var(--text-muted)"
                  style={{ fontSize: "12px", fontFamily: "IBM Plex Mono, monospace" }}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  style={{ fontSize: "12px", fontFamily: "IBM Plex Mono, monospace" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    fontFamily: "IBM Plex Mono, monospace"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="var(--accent-primary)"
                  strokeWidth={2}
                  name="Volume (SOL)"
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--accent-secondary)"
                  strokeWidth={2}
                  name="Count"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: transactionView === "table" ? "block" : "none" }}>
          <table className="transactions-table" style={{
            width: '100%',
            tableLayout: 'fixed',
            borderCollapse: 'collapse',
            opacity: 0,
            animation: "fadeIn 300ms ease forwards"
          }}>
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Transaction ID</th>
              <th style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Amount (SOL)</th>
              <th style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Status</th>
              <th style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Description</th>
              <th style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontFamily: "Martian Mono, monospace",
                  fontSize: "0.75rem",
                  padding: "2rem"
                }}>
                  Loading transactions...
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn.fullSignature}>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <code className="mono" style={{ fontSize: "13px" }}>{txn.id}</code>
                  </td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span className="mono" style={{ fontWeight: "600" }}>{txn.amount}</span>
                  </td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span className={`status-badge ${
                      txn.status === "settled" ? "status-settled" : "status-failed"
                    }`}>
                      {txn.status === "settled" ? "Settled" : "Failed"}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{txn.description}</td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span className="mono" style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {txn.time}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Register API Section */}
      <div id="register" style={{ marginBottom: "40px" }}>
        <h2 className="section-header">Register API</h2>
        <div style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "24px"
        }}>
          {registerFormSubmitted ? (
            <div style={{
              background: "rgba(0, 255, 136, 0.1)",
              border: "1px solid rgba(0, 255, 136, 0.3)",
              borderRadius: "6px",
              padding: "20px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "24px", marginBottom: "12px" }}>✓</div>
              <div style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "18px",
                fontWeight: "600",
                color: "var(--accent-primary)",
                marginBottom: "8px"
              }}>
                API Registered Successfully
              </div>
              <div style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "14px",
                color: "var(--text-muted)"
              }}>
                Service ID: {generatedServiceId}
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "8px"
                  }}>
                    API Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      padding: "10px 12px",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      transition: "border-color 150ms ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "8px"
                  }}>
                    Endpoint URL
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.endpoint}
                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                    style={{
                      width: "100%",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      padding: "10px 12px",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      transition: "border-color 150ms ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "8px"
                  }}>
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{
                      width: "100%",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      padding: "10px 12px",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      transition: "border-color 150ms ease",
                      resize: "vertical"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "8px"
                  }}>
                    Cost per Call (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    style={{
                      width: "100%",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      padding: "10px 12px",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      transition: "border-color 150ms ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "8px"
                  }}>
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: "100%",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      padding: "10px 12px",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      transition: "border-color 150ms ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  >
                    <option value="Weather">Weather</option>
                    <option value="Finance">Finance</option>
                    <option value="Web Search">Web Search</option>
                    <option value="AI & NLP">AI & NLP</option>
                    <option value="Blockchain Data">Blockchain Data</option>
                    <option value="Travel">Travel</option>
                  </select>
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "8px"
                  }}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="weather, forecast, temperature"
                    style={{
                      width: "100%",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      padding: "10px 12px",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      transition: "border-color 150ms ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "8px"
                  }}>
                    Developer Wallet
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.wallet}
                    onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                    placeholder="Solana wallet address"
                    style={{
                      width: "100%",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      padding: "10px 12px",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      transition: "border-color 150ms ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "12px"
                }}
              >
                Register API
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
    </main>
    </div>
  );
}
