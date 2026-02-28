import { Connection, PublicKey } from '@solana/web3.js'

const WALLET_ADDRESS = 'AuofYo21iiX8NQtgWBXLRFMiWfv83z2CbnhPNen6WNt5'
const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com',
  'confirmed'
)

export async function getWalletBalance() {
  const lamports = await connection.getBalance(new PublicKey(WALLET_ADDRESS))
  return (lamports / 1_000_000_000).toFixed(4)
}

export async function getParsedTransactions() {
  const pubkey = new PublicKey(WALLET_ADDRESS)
  const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 20 })
  const parsed = await Promise.all(
    signatures.map(async (sig) => {
      const tx = await connection.getParsedTransaction(sig.signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      })
      return {
        id: sig.signature.slice(0, 12) + '...',
        fullSignature: sig.signature,
        status: sig.err ? 'failed' : 'settled',
        time: sig.blockTime ? new Date(sig.blockTime * 1000).toLocaleTimeString() : 'Unknown',
        amount: tx?.meta
          ? Math.abs(tx.meta.preBalances[0] - tx.meta.postBalances[0]) / 1_000_000_000
          : 0,
        description: 'Solana Transfer',
      }
    })
  )
  return parsed
}

export async function getDashboardStats() {
  const [transactions, balance] = await Promise.all([
    getParsedTransactions(),
    getWalletBalance(),
  ])
  const totalVolume = transactions.reduce((acc, tx) => acc + tx.amount, 0).toFixed(4)
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
