"use client";

import { useEffect, useState } from "react";
import { fetchRegistry } from "@/services/api";

const categories = ["All", "Weather", "Finance", "Web Search", "AI & NLP", "Blockchain Data", "Travel"];

export default function BazaarPage() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredServices, setFilteredServices] = useState<any[]>([]);

  useEffect(() => {
    fetchRegistry().then((data) => {
      setServices(data);
      setFilteredServices(data);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(s => s.category === selectedCategory));
    }
  }, [selectedCategory, services]);

  const scrollToRegistry = () => {
    document.getElementById("registry")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "radial-gradient(ellipse at top, #0d0d1a 0%, var(--bg-primary) 100%)", minHeight: "100vh" }}>
      <div style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
        minHeight: "100vh"
      }}>
        {/* Navbar */}
        <nav style={{
          borderBottom: "1px solid var(--border)",
          padding: "20px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "24px", fontWeight: "800", color: "var(--text-primary)" }}>
              Micropay
            </h1>
            <span className="devnet-badge">DEVNET</span>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <a
              href="http://localhost:3000/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              View API Docs
            </a>
            <a href="/login" className="btn btn-primary">
              Developer Login
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "120px 48px",
          textAlign: "center"
        }}>
          <h2 style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "64px",
            fontWeight: "800",
            color: "var(--text-primary)",
            marginBottom: "24px",
            lineHeight: "1.1",
            animation: "fadeInUp 600ms ease forwards"
          }}>
            The App Store for<br />Autonomous Agents
          </h2>
          <p style={{
            fontSize: "20px",
            color: "var(--text-muted)",
            marginBottom: "48px",
            maxWidth: "700px",
            margin: "0 auto 48px",
            lineHeight: "1.6",
            animation: "fadeInUp 600ms ease forwards",
            animationDelay: "100ms",
            opacity: 0,
            animationFillMode: "forwards"
          }}>
            Discover, pay for, and integrate live data APIs with a single Micropay key. Priced in USD. Settled in 400ms on Solana.
          </p>
          <div style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            animation: "fadeInUp 600ms ease forwards",
            animationDelay: "200ms",
            opacity: 0,
            animationFillMode: "forwards"
          }}>
            <a href="/login" className="btn btn-primary" style={{ padding: "16px 32px", fontSize: "16px" }}>
              Get Your API Key
            </a>
            <button
              onClick={scrollToRegistry}
              className="btn btn-secondary"
              style={{ padding: "16px 32px", fontSize: "16px" }}
            >
              Browse the Registry
            </button>
          </div>
        </div>

        {/* API Grid */}
        <div id="registry" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 48px 120px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
            <h3 style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "32px",
              fontWeight: "700",
              color: "var(--text-primary)"
            }}>
              Live Registry
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--accent-primary)",
                animation: "pulse 2s ease infinite"
              }} />
              <span style={{ fontSize: "13px", color: "var(--accent-primary)", fontWeight: "600" }}>LIVE</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: "flex",
            gap: "12px",
            marginBottom: "32px",
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

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px"
          }}>
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                className="service-card"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  padding: "24px",
                  transition: "all 150ms ease",
                  opacity: 0,
                  animation: "fadeInUp 400ms ease forwards",
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "forwards"
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
                    {service.cost}
                  </span>
                  <span style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "11px",
                    color: "var(--text-muted)"
                  }}>
                    {service.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          borderTop: "1px solid var(--border)",
          padding: "32px 48px",
          textAlign: "center"
        }}>
          <p style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "12px",
            color: "var(--text-muted)"
          }}>
            Micropay Bazaar · HackIllinois 2026 · Solana Devnet
          </p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7);
          }
          50% {
            opacity: 0.5;
            box-shadow: 0 0 0 8px rgba(0, 255, 136, 0);
          }
        }

        .service-card:hover {
          border-color: var(--accent-primary);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.15);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
