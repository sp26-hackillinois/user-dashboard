import axios from 'axios'

const api = axios.create({
  baseURL: 'https://micropay.up.railway.app/api',
  headers: {
    'Authorization': 'Bearer mp_live_demo_key',
    'Content-Type': 'application/json',
  },
})

// Dashboard stats — keep using solana.js for this (real on-chain data)
// Only replace the mock functions below

// POST /v1/charges — core payment endpoint
// Backend looks up cost_usd and destination_wallet automatically from service_id
export async function createCharge({ service_id, source_wallet }: { service_id: string; source_wallet: string }) {
  const res = await api.post('/v1/charges', {
    service_id,      // backend fetches cost + destination wallet from registry
    source_wallet,   // the wallet being charged (consumer/user wallet)
  })
  return res.data
  // Returns: { id, status, service_name, amount_usd, amount_sol,
  //            exchange_rate_sol_usd, transaction_payload, destination_wallet }
}

// Registry discovery — check if backend has this endpoint, fallback to local if not
export async function discoverByIntent(query: string, limit = 3) {
  try {
    const res = await api.get(`/v1/registry/discover?intent=${encodeURIComponent(query)}&limit=${limit}`)
    return res.data.results
  } catch {
    // fallback to local registry if endpoint not ready
    const { registry } = await import('@/data/registry')
    const tokens = query.toLowerCase().split(/\s+/)
    return registry
      .map(s => ({
        ...s,
        score: [...s.tags, s.category.toLowerCase()].filter(h =>
          tokens.some(t => h.includes(t))
        ).length,
      }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }
}

// Register a new API tool
export async function registerAgenticAPI(payload: any) {
  try {
    const res = await api.post('/v1/registry/register', payload)
    return res.data
  } catch {
    // fallback mock if endpoint not ready
    return {
      service_id: 'srv_' + Math.random().toString(36).substr(2, 9),
      name: payload.name,
      status: 'active',
    }
  }
}

// Generate API key
export async function generateApiKey() {
  try {
    const res = await api.post('/v1/keys/generate')
    return res.data
  } catch {
    return { apiKey: 'mp_live_' + Math.random().toString(36).substr(2, 16) }
  }
}

// Fetch registry for homepage
export async function fetchRegistry() {
  const { registry } = await import('@/data/registry')
  return registry.map(item => ({
    name: item.name,
    description: item.description,
    cost: `$${item.price_usd.toFixed(2)}`,
    id: item.service_id,
    category: item.category
  }))
}

export default api
