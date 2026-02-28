"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { createCharge } from "@/services/api";
import api from "@/services/api";
import { registry } from "@/data/registry";

const categories = ["All", "Weather", "Finance", "Web Search", "AI & NLP", "Blockchain Data", "Travel"];

export default function BazaarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [services, setServices] = useState(registry);
  const [filteredServices, setFilteredServices] = useState(registry);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  // Fetch services from backend registry on mount
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await api.get('/v1/registry/discover');
        if (res.data?.results?.length > 0) {
          setServices(res.data.results);
        }
      } catch {
        // fallback to local registry.js
        setServices(registry);
      }
    }
    loadServices();
  }, []);

  useEffect(() => {
    let filtered = services;

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredServices(filtered);
  }, [searchQuery, selectedCategory, services]);

  const handleTestClick = (serviceId: string) => {
    if (expandedServiceId === serviceId) {
      setExpandedServiceId(null);
      setTestResponse(null);
      setTestError(null);
    } else {
      setExpandedServiceId(serviceId);
      setTestResponse(null);
      setTestError(null);
    }
  };

  const handleRunTest = async (service: any) => {
    setTestLoading(true);
    setTestError(null);
    setTestResponse(null);

    try {
      const sourceWallet = walletAddress || (document.getElementById(`wallet-input-${service.service_id}`) as HTMLInputElement)?.value;

      if (!sourceWallet) {
        setTestError("Please provide a source wallet address");
        setTestLoading(false);
        return;
      }

      const result = await createCharge({
        service_id: service.service_id,  // e.g. "srv_001"
        source_wallet: sourceWallet,     // from input or connected Phantom wallet
      });

      setTestResponse(result);
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Unknown error';
      setTestError(message);
    } finally {
      setTestLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).solana) {
      (window as any).solana.connect({ onlyIfTrusted: true })
        .then((res: any) => setWalletAddress(res.publicKey.toString()))
        .catch(() => {});
    }
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: "240px", flex: 1, minHeight: "100vh", overflowY: "auto", background: "var(--bg-primary)" }}>
        <div className="content-wrapper">
          {/* Top Bar */}
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "32px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
              API Bazaar
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
              Discover and test available APIs
            </p>

            {/* Search Bar */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search APIs... (e.g. weather, stocks, crypto)"
              autoFocus
              style={{
                width: "100%",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "14px 16px",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "14px",
                color: "var(--text-primary)",
                transition: "all 150ms ease",
                marginBottom: "24px"
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />

            {/* Category Filter Pills */}
            <div style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              paddingBottom: "8px"
            }}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: "1px solid var(--border)",
                    background: selectedCategory === category ? "var(--accent-primary)" : "var(--bg-elevated)",
                    color: selectedCategory === category ? "var(--bg-primary)" : "var(--text-primary)",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                    whiteSpace: "nowrap"
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* API Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px"
          }}>
            {filteredServices.map((service) => (
              <div key={service.service_id}>
                <div
                  className="service-card"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    padding: "24px",
                    transition: "all 150ms ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                    <h4 style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "var(--text-primary)"
                    }}>
                      {service.name}
                    </h4>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <span style={{
                        background: "rgba(90, 90, 122, 0.2)",
                        color: "var(--text-muted)",
                        padding: "4px 8px",
                        borderRadius: "3px",
                        fontSize: "10px",
                        fontWeight: "600",
                        fontFamily: "IBM Plex Mono, monospace"
                      }}>
                        {service.category}
                      </span>
                      <span style={{
                        background: "rgba(0, 255, 136, 0.15)",
                        color: "var(--accent-primary)",
                        padding: "4px 8px",
                        borderRadius: "3px",
                        fontSize: "10px",
                        fontWeight: "600",
                        fontFamily: "IBM Plex Mono, monospace"
                      }}>
                        LIVE
                      </span>
                    </div>
                  </div>
                  <p style={{
                    fontSize: "14px",
                    color: "var(--text-muted)",
                    marginBottom: "16px",
                    lineHeight: "1.5"
                  }}>
                    {service.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "var(--accent-primary)"
                    }}>
                      ${service.price_usd.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleTestClick(service.service_id)}
                      className="btn btn-secondary"
                      style={{ fontSize: "13px", padding: "8px 16px" }}
                    >
                      {expandedServiceId === service.service_id ? "Close" : "Test"}
                    </button>
                  </div>
                </div>

                {/* Test Panel */}
                {expandedServiceId === service.service_id && (
                  <div style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderTop: "none",
                    borderRadius: "0 0 4px 4px",
                    padding: "20px",
                    marginTop: "-4px"
                  }}>
                    <div style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      marginBottom: "4px"
                    }}>
                      Testing: {service.name}
                    </div>
                    <div style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "16px"
                    }}>
                      Cost: ${service.price_usd.toFixed(2)} per call
                    </div>

                    {!walletAddress && (
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                          marginBottom: "8px"
                        }}>
                          Source Wallet
                        </label>
                        <input
                          id={`wallet-input-${service.service_id}`}
                          type="text"
                          placeholder="Enter Solana wallet address"
                          style={{
                            width: "100%",
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            padding: "10px 12px",
                            fontFamily: "IBM Plex Mono, monospace",
                            fontSize: "13px",
                            color: "var(--text-primary)",
                            transition: "border-color 150ms ease"
                          }}
                          onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
                          onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                        />
                      </div>
                    )}

                    {walletAddress && (
                      <div style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "16px"
                      }}>
                        source_wallet: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                      </div>
                    )}

                    <button
                      onClick={() => handleRunTest(service)}
                      disabled={testLoading}
                      className="btn btn-primary"
                      style={{ width: "100%", marginBottom: "16px" }}
                    >
                      {testLoading ? "Running..." : "Run Test Call"}
                    </button>

                    {testError && (
                      <div style={{
                        background: "rgba(255, 68, 85, 0.1)",
                        border: "1px solid var(--danger)",
                        borderRadius: "4px",
                        padding: "12px",
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: "13px",
                        color: "var(--danger)",
                        marginBottom: "16px"
                      }}>
                        Error: {testError}
                      </div>
                    )}

                    {testResponse && (
                      <div>
                        <div style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                          marginBottom: "8px"
                        }}>
                          Response:
                        </div>
                        <div style={{
                          background: "var(--bg-primary)",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          padding: "12px",
                          fontFamily: "IBM Plex Mono, monospace",
                          fontSize: "12px",
                          color: "var(--text-primary)",
                          lineHeight: "1.8"
                        }}>
                          <div>Status: {testResponse.status}</div>
                          <div>Service: {testResponse.service_name}</div>
                          <div>Amount USD: ${testResponse.amount_usd}</div>
                          <div>Amount SOL: {testResponse.amount_sol}</div>
                          <div>Exchange Rate: ${testResponse.exchange_rate_sol_usd}/SOL</div>
                          <div>Destination: {testResponse.destination_wallet}</div>
                        </div>
                        <details style={{ marginTop: "12px" }}>
                          <summary style={{
                            fontSize: "12px",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            fontFamily: "IBM Plex Mono, monospace"
                          }}>
                            View raw JSON
                          </summary>
                          <pre style={{
                            background: "var(--bg-primary)",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            padding: "12px",
                            marginTop: "8px",
                            fontFamily: "IBM Plex Mono, monospace",
                            fontSize: "11px",
                            color: "var(--text-primary)",
                            overflowX: "auto",
                            lineHeight: "1.6"
                          }}>
                            {JSON.stringify(testResponse, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--text-muted)",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "14px"
            }}>
              No APIs found matching your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
