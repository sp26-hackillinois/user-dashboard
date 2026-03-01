"use client";

import { useEffect, useState } from "react";
import { API_REGISTRY, type ApiTool } from "@/lib/registry";

const CATEGORIES = [
  'All', 'Weather', 'Finance', 'News', 'Web Search',
  'LLM / AI', 'AI & NLP', 'Sports', 'Food', 'Travel',
  'Blockchain Data', 'Data & Stats'
];

export default function BazaarPage() {
  const [services, setServices] = useState<any[]>(
    API_REGISTRY.map(item => ({
      name: item.name,
      description: item.description,
      id: item.id,
      category: item.category
    }))
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredServices, setFilteredServices] = useState<any[]>(services);

  // All services loaded from frontend registry only - no backend calls
  useEffect(() => {
    setFilteredServices(services);
  }, [services]);

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
    <div className="hero">
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
            <h1 style={{ fontFamily: "Anybody, sans-serif", fontSize: "1.1rem", fontWeight: "900", color: "var(--accent-primary)", letterSpacing: "-0.02em", textShadow: "var(--glow-cyan)" }}>
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
            fontFamily: "Anybody, sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: "900",
            color: "var(--text-primary)",
            marginBottom: "24px",
            lineHeight: "0.95",
            letterSpacing: "-0.04em",
            animation: "fadeInUp 600ms ease forwards"
          }}>
            The App Store for<br /><span style={{ color: "var(--accent-primary)", textShadow: "0 0 40px rgba(0, 255, 224, 0.4)" }}>Autonomous Agents</span>
          </h2>
          <p style={{
            fontSize: "1.1rem",
            color: "var(--text-muted)",
            marginBottom: "48px",
            maxWidth: "700px",
            margin: "0 auto 48px",
            lineHeight: "1.6",
            fontFamily: "Martian Mono, monospace",
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
            <a href="/login" className="btn btn-primary" style={{ padding: "16px 32px", fontSize: "0.8rem" }}>
              Get Your API Key
            </a>
            <button
              onClick={scrollToRegistry}
              className="btn btn-secondary"
              style={{ padding: "16px 32px", fontSize: "0.8rem" }}
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
              fontFamily: "Anybody, sans-serif",
              fontSize: "2rem",
              fontWeight: "700",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em"
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
              <span style={{ fontSize: "0.7rem", color: "var(--accent-primary)", fontWeight: "600", fontFamily: "Martian Mono, monospace", letterSpacing: "0.1em" }}>LIVE</span>
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
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "2px",
                  border: "1px solid var(--border)",
                  background: selectedCategory === category ? "var(--accent-primary)" : "var(--bg-elevated)",
                  color: selectedCategory === category ? "#000" : "var(--text-primary)",
                  fontFamily: "Martian Mono, monospace",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 120ms ease",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase"
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
                className="card"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "2px",
                  padding: "24px",
                  transition: "all 120ms ease",
                  opacity: 0,
                  animation: "fadeInUp 400ms ease forwards",
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "forwards"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                  <h4 style={{
                    fontFamily: "Anybody, sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em"
                  }}>
                    {service.name}
                  </h4>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span style={{
                      background: "var(--bg-hover)",
                      color: "var(--text-muted)",
                      padding: "4px 8px",
                      borderRadius: "2px",
                      fontSize: "0.6rem",
                      fontWeight: "400",
                      fontFamily: "Martian Mono, monospace",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase"
                    }}>
                      {service.category}
                    </span>
                    <span style={{
                      background: "rgba(0, 255, 224, 0.08)",
                      color: "var(--accent-primary)",
                      padding: "4px 8px",
                      borderRadius: "2px",
                      fontSize: "0.6rem",
                      fontWeight: "400",
                      fontFamily: "Martian Mono, monospace",
                      letterSpacing: "0.08em",
                      border: "1px solid rgba(0, 255, 224, 0.2)"
                    }}>
                      LIVE
                    </span>
                  </div>
                </div>
                <p style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "16px",
                  lineHeight: "1.5",
                  fontFamily: "Martian Mono, monospace"
                }}>
                  {service.description}
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <span style={{
                    fontFamily: "Martian Mono, monospace",
                    fontSize: "0.65rem",
                    color: "var(--text-dim)",
                    letterSpacing: "0.02em"
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
            fontFamily: "Martian Mono, monospace",
            fontSize: "0.65rem",
            color: "var(--text-dim)",
            letterSpacing: "0.05em"
          }}>
            Micropay Bazaar · HackIllinois 2026 · Solana Devnet
          </p>
        </footer>
      </div>
    </div>
  );
}
