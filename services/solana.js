const BASE_URL = 'https://micropay.up.railway.app/api'
const WALLET_ADDRESS = 'AuofYo21iiX8NQtgWBXLRFMiWfv83z2CbnhPNen6WNt5'
const AUTH = 'Bearer mp_live_demo_key'

export async function getWalletBalance() {
  const res = await fetch(`${BASE_URL}/v1/balance/${WALLET_ADDRESS}`, {
    headers: { 'Authorization': AUTH }
  })
  const data = await res.json()
  return data.balance_sol?.toFixed(4) || '0.0000'
}

export async function getParsedTransactions() {
  const res = await fetch(`${BASE_URL}/v1/charges?limit=10`, {
    headers: { 'Authorization': AUTH }
  })
  const data = await res.json()

  // Map backend charges to the shape the dashboard table expects
  const charges = Array.isArray(data) ? data : data.charges || data.results || []

  return charges.map(charge => ({
    id: charge.id?.slice(0, 12) + '...' || 'unknown',
    fullSignature: charge.id || '',
    status: charge.status === 'requires_signature' ? 'pending' : charge.status || 'settled',
    time: charge.created_at
      ? new Date(charge.created_at).toLocaleTimeString()
      : 'Unknown',
    amount: charge.amount_sol || charge.amount_usd || 0,
    description: charge.service_name || 'API Call',
  }))
}

export async function getDashboardStats() {
  try {
    const [transactions, balance] = await Promise.all([
      getParsedTransactions(),
      getWalletBalance(),
    ])

    const totalVolume = transactions
      .reduce((acc, tx) => acc + Number(tx.amount), 0)
      .toFixed(4)

    const successCount = transactions.filter(t =>
      t.status === 'settled' || t.status === 'confirmed'
    ).length

    const successRate = transactions.length > 0
      ? ((successCount / transactions.length) * 100).toFixed(1)
      : '100.0'

    return {
      totalVolume: `${totalVolume} SOL`,
      transactionCount: transactions.length,
      successRate: `${successRate}%`,
      currentBalance: `${balance} SOL`,
      transactions,
    }
  } catch (err) {
    throw err
  }
}
