"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { discoverByIntent } from "@/services/api";

type MessageType = "user" | "agent" | "discovery_query" | "discovery_results" | "tool_call" | "payment_required" | "payment_confirmed";

type Message = {
  type: MessageType;
  content: string;
  service?: string;
  cost?: string;
  sol?: string;
  results?: any[];
};

const emojiMap: Record<string, string> = {
  "Weather": "🌤",
  "Finance": "💰",
  "Web Search": "🔍",
  "AI & NLP": "🤖",
  "Blockchain Data": "⛓",
  "Travel": "✈️"
};

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([
    { type: "user", content: "What is the weather in Chicago?" },
    {
      type: "discovery_results",
      content: "",
      results: [
        { service_id: "srv_weather_01", name: "Live Weather", price_usd: 0.01, category: "Weather", score: 5 },
        { service_id: "srv_weather_02", name: "7-Day Forecast", price_usd: 0.02, category: "Weather", score: 4 },
        { service_id: "srv_finance_02", name: "Crypto Price Oracle", price_usd: 0.01, category: "Finance", score: 2 },
      ]
    },
    {
      type: "tool_call",
      content: "Querying Registry...\nFound: Live Weather · $0.01\nRequesting payment authorization...",
      service: "Live Weather",
      cost: "$0.01"
    },
    {
      type: "payment_required",
      content: "",
      service: "Live Weather",
      cost: "$0.01",
      sol: "~0.000067 SOL"
    },
    {
      type: "payment_confirmed",
      content: "Payment Confirmed · Settled in 412ms"
    },
    {
      type: "agent",
      content: "The current weather in Chicago is 72°F and partly cloudy. Humidity is at 58%."
    }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApproveButton, setShowApproveButton] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>({ service_id: "srv_weather_01" });
  const [typewriterText, setTypewriterText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autoSelectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typewriterText]);

  const handleToolSelect = (tool: any) => {
    setSelectedTool(tool);
    if (autoSelectTimerRef.current) {
      clearTimeout(autoSelectTimerRef.current);
      autoSelectTimerRef.current = null;
    }

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          type: "tool_call",
          content: `Querying Registry...\nFound: ${tool.name} · $${tool.price_usd.toFixed(2)}\nRequesting payment authorization...`,
          service: tool.name,
          cost: `$${tool.price_usd.toFixed(2)}`
        }
      ]);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            type: "payment_required",
            content: "",
            service: tool.name,
            cost: `$${tool.price_usd.toFixed(2)}`,
            sol: `~${(tool.price_usd / 150).toFixed(6)} SOL`
          }
        ]);
        setShowApproveButton(true);
      }, 1000);
    }, 800);
  };

  const handleApprove = () => {
    setShowApproveButton(false);
    setMessages(prev => [
      ...prev,
      {
        type: "payment_confirmed",
        content: "Payment Confirmed · Settled in 412ms"
      }
    ]);

    setTimeout(() => {
      const response = "I've retrieved the data you requested via the Micropay Registry. Here is your result: The information has been successfully fetched and processed.";
      let index = 0;
      const interval = setInterval(() => {
        if (index <= response.length) {
          setTypewriterText(response.substring(0, index));
          index++;
        } else {
          clearInterval(interval);
          setMessages(prev => [
            ...prev,
            { type: "agent", content: response }
          ]);
          setTypewriterText("");
          setIsProcessing(false);
          setSelectedTool(null);
        }
      }, 20);
    }, 500);
  };

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input;
    setInput("");
    setIsProcessing(true);

    setMessages(prev => [
      ...prev,
      { type: "user", content: userMessage }
    ]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          type: "discovery_query",
          content: `Querying registry for: "${userMessage}"...`
        }
      ]);

      setTimeout(() => {
        const discovered = discoverByIntent(userMessage, 3);

        if (discovered.length === 0) {
          setMessages(prev => [
            ...prev.slice(0, -1),
            {
              type: "agent",
              content: "No matching tools found in registry. Proceeding without tool injection."
            }
          ]);
          setIsProcessing(false);
        } else {
          setMessages(prev => [
            ...prev.slice(0, -1),
            {
              type: "discovery_results",
              content: "",
              results: discovered
            }
          ]);

          autoSelectTimerRef.current = setTimeout(() => {
            handleToolSelect(discovered[0]);
          }, 5000);
        }
      }, 800);
    }, 500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ marginLeft: "240px", flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
        {/* Top Bar */}
        <div style={{
          borderBottom: "1px solid var(--border)",
          padding: "20px 32px",
          background: "var(--bg-surface)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "24px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>
                Agent Playground
              </h1>
              <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Your Micropay key is active. Ask the agent anything.
              </p>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              background: "rgba(255, 170, 0, 0.15)",
              border: "1px solid rgba(255, 170, 0, 0.3)",
              borderRadius: "4px"
            }}>
              <div style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--warning)"
              }} />
              <span style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "11px",
                color: "var(--warning)",
                fontWeight: "600"
              }}>
                DEVNET
              </span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          {messages.map((msg, index) => {
            if (msg.type === "user") {
              return (
                <div key={index} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "12px 16px",
                    maxWidth: "70%",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "14px",
                    color: "var(--text-primary)"
                  }}>
                    {msg.content}
                  </div>
                </div>
              );
            }

            if (msg.type === "agent") {
              return (
                <div key={index} style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "12px 16px",
                    maxWidth: "70%",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "14px",
                    color: "var(--text-primary)",
                    lineHeight: "1.6"
                  }}>
                    {msg.content}
                  </div>
                </div>
              );
            }

            if (msg.type === "discovery_query") {
              return (
                <div key={index} style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    fontStyle: "italic"
                  }}>
                    {msg.content}
                    <span style={{ animation: "blink 1s infinite" }}>▊</span>
                  </div>
                </div>
              );
            }

            if (msg.type === "discovery_results") {
              return (
                <div key={index} style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "20px",
                    maxWidth: "80%",
                    minWidth: "500px"
                  }}>
                    <div style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      marginBottom: "8px"
                    }}>
                      Registry Discovery Results
                    </div>
                    <div style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      marginBottom: "16px"
                    }}>
                      Found {msg.results?.length} tools matching your request:
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                      {msg.results?.map((tool, toolIndex) => (
                        <button
                          key={tool.service_id}
                          onClick={() => handleToolSelect(tool)}
                          disabled={selectedTool !== null}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            background: selectedTool?.service_id === tool.service_id ? "var(--accent-primary)" : "var(--bg-elevated)",
                            border: selectedTool?.service_id === tool.service_id ? "1px solid var(--accent-primary)" : "1px solid var(--border)",
                            borderRadius: "20px",
                            fontFamily: "IBM Plex Mono, monospace",
                            fontSize: "13px",
                            color: selectedTool?.service_id === tool.service_id ? "var(--bg-primary)" : "var(--text-primary)",
                            cursor: selectedTool === null ? "pointer" : "not-allowed",
                            transition: "all 150ms ease",
                            opacity: 0,
                            animation: "fadeInUp 300ms ease forwards",
                            animationDelay: `${toolIndex * 80}ms`,
                            animationFillMode: "forwards"
                          }}
                          onMouseEnter={(e) => {
                            if (selectedTool === null) {
                              e.currentTarget.style.borderColor = "var(--accent-primary)";
                              e.currentTarget.style.color = "var(--accent-primary)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedTool === null) {
                              e.currentTarget.style.borderColor = "var(--border)";
                              e.currentTarget.style.color = "var(--text-primary)";
                            }
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>{emojiMap[tool.category] || "📦"}</span>
                            <span>{tool.name}</span>
                          </div>
                          <span style={{
                            color: selectedTool?.service_id === tool.service_id ? "var(--bg-primary)" : "var(--accent-primary)",
                            fontWeight: "600"
                          }}>
                            ${tool.price_usd.toFixed(2)}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      textAlign: "center"
                    }}>
                      Select a tool to proceed →
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.type === "tool_call") {
              return (
                <div key={index} style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderLeft: "3px solid var(--accent-secondary)",
                    borderRadius: "6px",
                    padding: "16px",
                    maxWidth: "70%"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "16px" }}>🔍</span>
                      <span style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: "13px",
                        color: "var(--accent-secondary)",
                        fontWeight: "600"
                      }}>
                        TOOL CALL
                      </span>
                    </div>
                    <div style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      whiteSpace: "pre-line",
                      lineHeight: "1.6"
                    }}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.type === "payment_required") {
              return (
                <div key={index} style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderLeft: "3px solid var(--accent-primary)",
                    borderRadius: "6px",
                    padding: "16px",
                    maxWidth: "70%"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <span style={{ fontSize: "16px" }}>⚡</span>
                      <span style={{
                        fontFamily: "Syne, sans-serif",
                        fontSize: "14px",
                        color: "var(--accent-primary)",
                        fontWeight: "600"
                      }}>
                        Payment Required
                      </span>
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginBottom: "4px"
                      }}>
                        Service: {msg.service}
                      </div>
                      <div style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: "12px",
                        color: "var(--text-muted)"
                      }}>
                        Cost: {msg.cost} · {msg.sol}
                      </div>
                    </div>
                    {showApproveButton && index === messages.length - 1 && (
                      <button
                        onClick={handleApprove}
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                      >
                        Approve with Phantom
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            if (msg.type === "payment_confirmed") {
              return (
                <div key={index} style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    background: "rgba(0, 255, 136, 0.1)",
                    border: "1px solid rgba(0, 255, 136, 0.3)",
                    borderRadius: "6px",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <span style={{ color: "var(--accent-primary)", fontSize: "16px" }}>✓</span>
                    <span style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "13px",
                      color: "var(--accent-primary)",
                      fontWeight: "600"
                    }}>
                      {msg.content}
                    </span>
                  </div>
                </div>
              );
            }

            return null;
          })}

          {typewriterText && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "12px 16px",
                maxWidth: "70%",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "14px",
                color: "var(--text-primary)",
                lineHeight: "1.6"
              }}>
                {typewriterText}
                <span style={{ opacity: 0.5 }}>▊</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          borderTop: "1px solid var(--border)",
          padding: "24px 32px",
          background: "var(--bg-surface)"
        }}>
          <div style={{ display: "flex", gap: "12px", maxWidth: "1000px", margin: "0 auto" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask the agent anything... (e.g. What is the weather in Chicago?)"
              disabled={isProcessing}
              style={{
                flex: 1,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "14px 16px",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "14px",
                color: "var(--text-primary)",
                transition: "all 150ms ease"
              }}
            />
            <button
              onClick={handleSend}
              disabled={isProcessing || !input.trim()}
              className="btn btn-primary"
              style={{
                padding: "14px 28px",
                opacity: isProcessing || !input.trim() ? 0.5 : 1
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
