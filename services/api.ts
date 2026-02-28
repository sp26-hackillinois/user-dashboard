import axios from 'axios'

const api = axios.create({
  baseURL: 'https://micropay.up.railway.app/api',
  headers: {
    'Authorization': 'Bearer mp_live_demo_key',
    'Content-Type': 'application/json',
  },
})

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

// Generate API key
export async function generateApiKey() {
  try {
    const res = await api.post('/v1/keys/generate')
    return res.data
  } catch {
    return { apiKey: 'mp_live_' + Math.random().toString(36).substr(2, 16) }
  }
}

export default api
