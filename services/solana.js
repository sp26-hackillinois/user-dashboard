const BASE_URL = 'https://micropay.up.railway.app/api'
const BALANCE_WALLET = 'AuofYo21iiX8NQtgWBXLRFMiWfv83z2CbnhPNen6WNt5'
const TRANSACTIONS_WALLET = '2Hn6ESeMRqfVDTptanXgK6vDEpgJGnp4rG6Ls3dzszv8'
const AUTH = { 'Authorization': 'Bearer mp_live_demo_key' }

export async function getWalletBalance() {
  const res = await fetch(`${BASE_URL}/v1/balance/${BALANCE_WALLET}`)
  if (!res.ok) throw new Error(`Balance failed: ${res.status}`)
  const data = await res.json()
  return Number(data.balance_sol).toFixed(4)
}

export async function getParsedTransactions() {
  const res = await fetch(
    `${BASE_URL}/v1/transactions/${TRANSACTIONS_WALLET}`,
    { headers: AUTH }
  )
  if (!res.ok) throw new Error(`Transactions failed: ${res.status}`)
  const data = await res.json()
  return (data.transactions || []).map(tx => ({
    id: tx.signature.slice(0, 12) + '...',
    fullSignature: tx.signature,
    status: tx.status,
    time: new Date(tx.time).toLocaleTimeString(),
    amount: Number(tx.amount_sol).toFixed(6),
    description: tx.description,
  }))
}

export async function getDashboardStats() {
  const [balance, transactions] = await Promise.all([
    getWalletBalance(),
    getParsedTransactions(),
  ])

  const totalVolume = transactions
    .reduce((acc, tx) => acc + parseFloat(tx.amount), 0)
    .toFixed(6)

  const successCount = transactions.filter(t => t.status === 'settled').length
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
}
