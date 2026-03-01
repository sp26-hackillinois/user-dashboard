const BASE_URL = 'https://micropay.up.railway.app/api'
const CONSUMER_WALLET = '2Hn6ESeMRqfVDTptanXgK6vDEpgJGnp4rG6Ls3dzszv8'
const AUTH = { 'Authorization': 'Bearer mp_live_demo_key' }

export async function getWalletBalance() {
  const res = await fetch(`${BASE_URL}/v1/balance/${CONSUMER_WALLET}`)
  if (!res.ok) throw new Error(`Balance failed: ${res.status}`)
  const data = await res.json()
  return {
    balance: Number(data.balance_sol).toFixed(4),
    developerWallet: data.developer_wallet, // read from response
  }
}

export async function getParsedTransactions(developerWallet) {
  const res = await fetch(
    `${BASE_URL}/v1/transactions/${developerWallet}`,
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

export async function getTotalTransactionCount() {
  try {
    const res = await fetch(
      `${BASE_URL}/v1/charges/count`
      // no auth needed
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.count ?? null
  } catch {
    return null
  }
}

export async function getDashboardStats() {
  // Step 1 — get balance AND developer wallet address
  const { balance, developerWallet } = await getWalletBalance()

  // Step 2 — use developer wallet to get real payment transactions
  const [transactions, totalCount] = await Promise.all([
    getParsedTransactions(developerWallet),
    getTotalTransactionCount(),
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
    transactionCount: totalCount ?? transactions.length,
    successRate: `${successRate}%`,
    currentBalance: `${balance} SOL`,
    transactions,
  }
}
