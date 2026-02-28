"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { API_REGISTRY, discoverTools, getMockResponse, type ApiTool } from "@/lib/registry";

type Message = {
  role: 'user' | 'agent' | 'system' | 'discovery' | 'tool_call' | 'payment' | 'confirmed';
  content: string;
  results?: ApiTool[];
  service?: string;
  cost?: string;
  cost_usd?: number;
  sol?: number;
  ms?: number;
  signature?: string;
  inputTokens?: number;
  outputTokens?: number;
  solPrice?: number;
  pendingResponse?: string;
  approved?: boolean;
};

const emojiMap: Record<string, string> = {
  "Weather": "🌤",
  "Finance": "💰",
  "News": "📰",
  "Web Search": "🔍",
  "LLM / AI": "🧠",
  "AI & NLP": "🤖",
  "Sports": "⚽",
  "Food": "🍽",
  "Travel": "✈️",
  "Blockchain Data": "⛓",
  "Data & Stats": "📊"
};

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const toolId = searchParams.get('toolId');

  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
  const OPENAI_DESTINATION_WALLET = '2Hn6ESeMRqfVDTptanXgK6vDEpgJGnp4rG6Ls3dzszv8'
  const GPT4O_INPUT_COST_PER_TOKEN = 0.000005   // $5 per 1M input tokens
  const GPT4O_OUTPUT_COST_PER_TOKEN = 0.000015  // $15 per 1M output tokens

  const [userMessage, setUserMessage] = useState('');
  const [suggestedTools, setSuggestedTools] = useState<ApiTool[]>([]);
  const [chosenTool, setChosenTool] = useState<ApiTool | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'user', content: 'What is the weather in Chicago?' },
    {
      role: 'discovery',
      content: 'Found 3 matching tools:',
      results: [
        { id: 'weather_live', name: 'Live Weather', category: 'Weather', description: 'Real-time temperature and precipitation for any city.', endpoint: '/tools/weather', priceUsd: 0.01, tags: ['weather', 'temperature', 'forecast', 'climate', 'rain'] },
        { id: 'weather_forecast', name: '7-Day Forecast', category: 'Weather', description: 'Extended 7-day weather forecast for any location.', endpoint: '/tools/forecast', priceUsd: 0.02, tags: ['forecast', 'weekly', 'weather', 'climate'] },
        { id: 'finance_crypto', name: 'Crypto Price Oracle', category: 'Finance', description: 'Live SOL/USD, BTC/USD, ETH/USD price feeds.', endpoint: '/tools/crypto', priceUsd: 0.01, tags: ['crypto', 'bitcoin', 'solana', 'ethereum', 'price', 'blockchain'] },
      ]
    },
    {
      role: 'tool_call',
      service: 'Live Weather',
      cost: '0.01',
      content: ''
    },
    {
      role: 'payment',
      service: 'Live Weather',
      cost_usd: 0.01,
      sol: 0.000067,
      content: ''
    },
    {
      role: 'confirmed',
      content: '',
      ms: 412,
      signature: '5k7m9...',
      sol: 0.000067
    },
    {
      role: 'agent',
      content: 'The current weather in Chicago is 72°F and partly cloudy. Humidity is at 58%.'
    }
  ]);
  const [awaitingToolSelection, setAwaitingToolSelection] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (toolId) {
      const tool = API_REGISTRY.find(t => t.id === toolId);
      if (tool) {
        setChosenTool(tool);
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Tool preselected from Bazaar: ${tool.name} · $${tool.priceUsd.toFixed(2)}/call`
        }]);
      }
    }
  }, [toolId]);

  async function connectWallet() {
    if (typeof window === 'undefined' || !(window as any).solana) {
      alert('Please install Phantom wallet extension');
      return;
    }
    try {
      setWalletConnecting(true);
      const res = await (window as any).solana.connect();
      setWalletAddress(res.publicKey.toString());
    } catch (err) {
      console.error('Wallet connect failed:', err);
    } finally {
      setWalletConnecting(false);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).solana) {
      (window as any).solana.connect({ onlyIfTrusted: true })
        .then((res: any) => setWalletAddress(res.publicKey.toString()))
        .catch(() => {});
    }
  }, []);

  async function callOpenAIWithCost(prompt: string): Promise<{
    response: string
    inputTokens: number
    outputTokens: number
    costUsd: number
  }> {
    if (!OPENAI_API_KEY) throw new Error('OpenAI API key not configured')

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant integrated into Micropay Bazaar — a marketplace for AI-powered micro-transaction APIs on Solana. Answer concisely and helpfully.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
      })
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err?.error?.message || `OpenAI error: ${res.status}`)
    }

    const data = await res.json()
    const inputTokens = data.usage?.prompt_tokens || 0
    const outputTokens = data.usage?.completion_tokens || 0
    const costUsd = (inputTokens * GPT4O_INPUT_COST_PER_TOKEN) + (outputTokens * GPT4O_OUTPUT_COST_PER_TOKEN)

    return {
      response: data.choices?.[0]?.message?.content || 'No response.',
      inputTokens,
      outputTokens,
      costUsd: Math.max(costUsd, 0.000001), // minimum to avoid 0 lamports
    }
  }

  async function getSolPrice(): Promise<number> {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
      const data = await res.json()
      return data?.solana?.usd || 150
    } catch {
      return 150 // fallback price
    }
  }

  async function sendSolPayment(amountSol: number, sourceWallet: string): Promise<string> {
    const { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } = await import('@solana/web3.js')

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
    const fromPubkey = new PublicKey(sourceWallet)
    const toPubkey = new PublicKey(OPENAI_DESTINATION_WALLET)
    const lamports = Math.round(amountSol * LAMPORTS_PER_SOL)

    const transaction = new Transaction().add(
      SystemProgram.transfer({ fromPubkey, toPubkey, lamports })
    )

    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = fromPubkey

    const { signature } = await (window as any).solana.signAndSendTransaction(transaction)
    return signature
  }

  async function runOpenAIFlow(query: string) {
    if (!walletAddress) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: '⚠ Connect your Phantom wallet to proceed.'
      }])
      return
    }

    // Step 1 — Show thinking state
    setMessages(prev => [...prev, {
      role: 'tool_call',
      service: 'OpenAI GPT-4o',
      cost: 'Calculating...',
      content: ''
    }])

    try {
      // Step 2 — Call OpenAI and get real token usage
      const { response, inputTokens, outputTokens, costUsd } = await callOpenAIWithCost(query)

      // Step 3 — Get live SOL price
      const solPrice = await getSolPrice()
      const amountSol = costUsd / solPrice

      // Step 4 — Show real cost breakdown, ask for approval
      setMessages(prev => [...prev, {
        role: 'payment',
        service: 'OpenAI GPT-4o',
        cost_usd: costUsd,
        sol: amountSol,
        inputTokens,
        outputTokens,
        solPrice,
        pendingResponse: response, // store response, show only after payment
        approved: false,
        content: ''
      }])

    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `OpenAI error: ${err.message}`
      }])
    }

    setAwaitingToolSelection(false)
  }

  async function handleApprovePayment(paymentMsg: Message) {
    // Mark as approved immediately so button disappears
    setMessages(prev => prev.map(m =>
      m === paymentMsg ? { ...m, approved: true } : m
    ))

    try {
      const signature = await sendSolPayment(paymentMsg.sol!, walletAddress!)

      // Show confirmation
      setMessages(prev => [...prev, {
        role: 'confirmed',
        ms: 400,
        signature: signature.slice(0, 12) + '...',
        sol: paymentMsg.sol,
        content: ''
      }])

      // Now reveal the OpenAI response with typewriter
      await new Promise(r => setTimeout(r, 600))
      setMessages(prev => [...prev, {
        role: 'agent',
        content: paymentMsg.pendingResponse!,
      }])

    } catch (err: any) {
      if (err?.code === 4001) {
        setMessages(prev => [...prev, {
          role: 'system',
          content: 'Payment cancelled. Response not shown.'
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Payment failed: ${err?.message || 'Unknown error'}`
        }])
      }
    }
  }

  async function runAgentCall(query: string, tool: ApiTool) {
    if (tool.id === 'openai_chat') {
      await runOpenAIFlow(query)
      return
    }

    // All other tools — existing mock flow unchanged
    if (!walletAddress) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: '⚠ Connect your Phantom wallet to proceed with payment.'
      }]);
      return;
    }

    setMessages(prev => [...prev, {
      role: 'tool_call',
      service: tool.name,
      cost: `${tool.priceUsd}`,
      content: ''
    }]);

    try {
      const { createCharge } = await import('@/services/api');
      const charge = await createCharge({
        service_id: tool.id,
        source_wallet: walletAddress,
      });

      setMessages(prev => [...prev, {
        role: 'payment',
        service: tool.name,
        cost_usd: charge.amount_usd,
        sol: charge.amount_sol,
        content: ''
      }]);

      const { Transaction } = await import('@solana/web3.js');
      const tx = Transaction.from(Buffer.from(charge.transaction_payload, 'base64'));
      const { signature } = await (window as any).solana.signAndSendTransaction(tx);

      setMessages(prev => [...prev, {
        role: 'confirmed',
        ms: 400,
        signature: signature.slice(0, 12) + '...',
        sol: charge.amount_sol,
        content: ''
      }]);

      await new Promise(r => setTimeout(r, 600));

      const agentResponse = getMockResponse(tool.id, query)
      setMessages(prev => [...prev, { role: 'agent', content: agentResponse }]);

    } catch (err: any) {
      if (err?.code === 4001) {
        setMessages(prev => [...prev, { role: 'system', content: 'Payment cancelled by user.' }]);
      } else if (err?.response?.status === 400 || err?.response?.status === 404) {
        setMessages(prev => [...prev, {
          role: 'system',
          content: `⚠ Backend service not registered yet. Showing mocked response.`
        }]);
        setMessages(prev => [...prev, {
          role: 'agent',
          content: getMockResponse(tool.id, query)
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Error: ${err?.message || 'Unknown error'}`
        }]);
      }
    }

    setAwaitingToolSelection(false);
  }

  async function handleSend() {
    if (!userMessage.trim()) return;

    const query = userMessage;
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setUserMessage('');

    setChosenTool(null);
    setAwaitingToolSelection(true);

    const suggestions = discoverTools(query, 3);

    if (suggestions.length === 0) {
      setMessages(prev => [...prev, {
        role: 'discovery',
        content: `Found 3 tools matching your request:`,
        results: API_REGISTRY.slice(0, 3),
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'discovery',
        content: `Found ${suggestions.length} tools matching your request:`,
        results: suggestions,
      }]);
    }
  }

  function handleChipSelect(tool: ApiTool) {
    setChosenTool(tool);
    setAwaitingToolSelection(false);
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) runAgentCall(lastUserMsg.content, tool);
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ marginLeft: "240px", flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
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

        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          {!walletAddress && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--warning)',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontFamily: 'IBM Plex Mono',
              fontSize: '0.8rem',
              color: 'var(--warning)',
            }}>
              ⚠ Connect your Phantom wallet to enable payments.
              <button onClick={connectWallet} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                {walletConnecting ? 'Connecting...' : 'Connect Phantom'}
              </button>
            </div>
          )}

          {messages.map((msg, index) => {
            if (msg.role === "user") {
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

            if (msg.role === "agent") {
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

            if (msg.role === "system") {
              return (
                <div key={index} style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                    padding: "8px 12px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px"
                  }}>
                    {msg.content}
                  </div>
                </div>
              );
            }

            if (msg.role === "discovery") {
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
                      {msg.content}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                      {Array.isArray(msg.results) && msg.results.map((tool, toolIndex) => (
                        <button
                          key={tool.id}
                          onClick={() => handleChipSelect(tool)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                            borderRadius: "20px",
                            fontFamily: "IBM Plex Mono, monospace",
                            fontSize: "13px",
                            color: "var(--text-primary)",
                            cursor: "pointer",
                            transition: "all 150ms ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--accent-primary)";
                            e.currentTarget.style.color = "var(--accent-primary)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.color = "var(--text-primary)";
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>{emojiMap[tool.category] || "📦"}</span>
                            <span>{tool.name}</span>
                          </div>
                          <span style={{
                            color: "var(--accent-primary)",
                            fontWeight: "600"
                          }}>
                            ${tool.priceUsd.toFixed(2)}
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

            if (msg.role === "tool_call") {
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
                      lineHeight: "1.6"
                    }}>
                      Querying Registry...<br/>
                      Found: {msg.service} · ${msg.cost}<br/>
                      Requesting payment authorization...
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.role === "payment") {
              // OpenAI payment with token breakdown
              if (msg.pendingResponse !== undefined) {
                return (
                  <div key={index} style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid rgba(0,255,136,0.3)',
                      borderRadius: '4px',
                      padding: '1rem',
                      fontFamily: 'IBM Plex Mono',
                      fontSize: '0.8rem',
                      maxWidth: '70%'
                    }}>
                      <div style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>⚡ Payment Required</div>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Service: {msg.service}</div>

                      {msg.inputTokens && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.25rem' }}>
                          Tokens: {msg.inputTokens} input + {msg.outputTokens} output
                        </div>
                      )}

                      <div style={{ color: 'var(--text-primary)', margin: '0.5rem 0' }}>
                        Cost: <span style={{ color: 'var(--accent-primary)' }}>${msg.cost_usd?.toFixed(6)} USD</span>
                        {' · '}
                        <span style={{ color: 'var(--accent-primary)' }}>{msg.sol?.toFixed(8)} SOL</span>
                      </div>

                      {msg.solPrice && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.75rem' }}>
                          Rate: 1 SOL = ${msg.solPrice} USD
                        </div>
                      )}

                      {!msg.approved && (
                        <button
                          onClick={() => handleApprovePayment(msg)}
                          style={{
                            background: 'var(--accent-primary)',
                            color: '#000',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.5rem 1.25rem',
                            fontFamily: 'IBM Plex Mono',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Approve with Phantom
                        </button>
                      )}
                    </div>
                  </div>
                );
              }

              // Regular tool payment (original flow)
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
                        Cost: ${msg.cost_usd?.toFixed(2)} · ~{msg.sol?.toFixed(6)} SOL
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.role === "confirmed") {
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
                      Payment Confirmed · Settled in {msg.ms}ms
                    </span>
                  </div>
                </div>
              );
            }

            return null;
          })}

          <div ref={messagesEndRef} />
        </div>

        <div style={{
          borderTop: "1px solid var(--border)",
          padding: "24px 32px",
          background: "var(--bg-surface)"
        }}>
          {chosenTool && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.3)',
              borderRadius: '4px',
              fontFamily: 'IBM Plex Mono',
              fontSize: '0.75rem',
              color: 'var(--accent-primary)',
              marginBottom: '8px',
            }}>
              ● Active Tool: {chosenTool.name} · ${chosenTool.priceUsd}/call
              <button onClick={() => setChosenTool(null)} style={{ marginLeft: 'auto', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", maxWidth: "1000px", margin: "0 auto" }}>
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !awaitingToolSelection && handleSend()}
              placeholder="Ask the agent anything... (e.g. What is the weather in Chicago?)"
              disabled={awaitingToolSelection}
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
              disabled={awaitingToolSelection || !userMessage.trim()}
              className="btn btn-primary"
              style={{
                padding: "14px 28px",
                opacity: awaitingToolSelection || !userMessage.trim() ? 0.5 : 1
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlaygroundContent />
    </Suspense>
  );
}
