"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { API_REGISTRY, type ApiTool } from "@/lib/registry";

const CATEGORIES = [
  'All', 'Weather', 'Finance', 'News', 'Web Search',
  'LLM / AI', 'AI & NLP', 'Sports', 'Food', 'Travel',
  'Blockchain Data', 'Data & Stats'
];

const MICROPAY_API_KEY = 'mp_live_demo_key';
const DOCS_URL = '#';

const getModelName = (toolId: string) => `micropay/${toolId.replace(/_/g, '-')}`;

export default function BazaarPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [services, setServices] = useState<ApiTool[]>(API_REGISTRY);
  const [filteredServices, setFilteredServices] = useState<ApiTool[]>(API_REGISTRY);
  const [keyPopupTool, setKeyPopupTool] = useState<ApiTool | null>(null);
  const [copiedField, setCopiedField] = useState<'key' | 'model' | null>(null);

  // All services loaded from frontend registry only
  useEffect(() => {
    setServices(API_REGISTRY);
    setFilteredServices(API_REGISTRY);
  }, []);

  useEffect(() => {
    let filtered = services;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

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

  function openKeyPopup(tool: ApiTool) {
    setKeyPopupTool(tool);
  }

  function closeKeyPopup() {
    setKeyPopupTool(null);
    setCopiedField(null);
  }

  async function copyToClipboard(text: string, field: 'key' | 'model') {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: "240px", flex: 1, minHeight: "100vh", overflowY: "auto", background: "var(--bg-primary)" }}>
        <div className="content-wrapper">
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "32px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
              API Bazaar
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
              Discover and test available APIs
            </p>

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

            <div style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              paddingBottom: "8px"
            }}>
              {CATEGORIES.map((category) => (
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

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px"
          }}>
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="service-card"
                style={{
                  background: "var(--bg-elevated)",
                  border: service.id === 'openai_chat' ? "1px solid var(--accent-secondary)" : "1px solid var(--border)",
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
                    {service.id === 'openai_chat' ? (
                      <span style={{
                        background: "rgba(138, 92, 246, 0.15)",
                        color: "var(--accent-secondary)",
                        padding: "4px 8px",
                        borderRadius: "3px",
                        fontSize: "10px",
                        fontWeight: "600",
                        fontFamily: "IBM Plex Mono, monospace"
                      }}>
                        LIVE ⚡
                      </span>
                    ) : (
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
                    )}
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
                {service.id === 'openai_chat' && (
                  <div style={{
                    border: '1px solid var(--accent-secondary)',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    fontSize: '0.65rem',
                    fontFamily: 'IBM Plex Mono',
                    color: 'var(--accent-secondary)',
                    marginBottom: '12px',
                    display: 'inline-block',
                  }}>
                    FULLY INTEGRATED · GPT-4o
                  </div>
                )}
                <div style={{ marginBottom: "12px" }}>
                  <span style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "20px",
                    fontWeight: "600",
                    color: service.id === 'openai_chat' ? "var(--accent-secondary)" : "var(--accent-primary)"
                  }}>
                    ${service.priceUsd.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => router.push(`/playground?toolId=${service.id}`)}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      color: "var(--text-muted)",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      transition: "all 150ms ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent-primary)";
                      e.currentTarget.style.color = "var(--accent-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    Test in Playground
                  </button>
                  <button
                    onClick={() => openKeyPopup(service)}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      background: "var(--accent-primary)",
                      border: "none",
                      borderRadius: "4px",
                      color: "#000",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 150ms ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    Get Key
                  </button>
                </div>
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

      {keyPopupTool && (
        <div
          onClick={closeKeyPopup}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '2rem',
              width: '480px',
              maxWidth: '90vw',
              position: 'relative',
            }}
          >
            <button
              onClick={closeKeyPopup}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontFamily: 'IBM Plex Mono',
                fontSize: '1rem',
              }}
            >
              ✕
            </button>

            <h2 style={{ fontFamily: 'Syne', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {keyPopupTool.name}
            </h2>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Get started with this API
            </p>

            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Micropay API Key
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
              <code style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontFamily: 'IBM Plex Mono',
                fontSize: '0.8rem',
                color: 'var(--accent-primary)',
              }}>
                {MICROPAY_API_KEY}
              </code>
              <button
                onClick={() => copyToClipboard(MICROPAY_API_KEY, 'key')}
                style={{
                  padding: '0.5rem 1rem',
                  background: copiedField === 'key' ? 'rgba(0,255,136,0.15)' : 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: copiedField === 'key' ? 'var(--accent-primary)' : 'var(--text-muted)',
                  fontFamily: 'IBM Plex Mono',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {copiedField === 'key' ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Model Name
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
              <code style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontFamily: 'IBM Plex Mono',
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
              }}>
                {getModelName(keyPopupTool.id)}
              </code>
              <button
                onClick={() => copyToClipboard(getModelName(keyPopupTool.id), 'model')}
                style={{
                  padding: '0.5rem 1rem',
                  background: copiedField === 'model' ? 'rgba(0,255,136,0.15)' : 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: copiedField === 'model' ? 'var(--accent-primary)' : 'var(--text-muted)',
                  fontFamily: 'IBM Plex Mono',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {copiedField === 'model' ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <a
              href={DOCS_URL}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent-primary)',
                fontFamily: 'IBM Plex Mono',
                fontSize: '0.8rem',
                textDecoration: 'none',
                border: '1px solid rgba(0,255,136,0.3)',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
              }}
            >
              View Documentation →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
