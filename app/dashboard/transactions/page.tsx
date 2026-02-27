"use client";

type Transaction = {
  id: string;
  amount: string;
  status: "settled" | "requires_signature" | "failed";
  description: string;
  time: string;
};

const mockTransactions: Transaction[] = [
  { id: "txn_8k2j9d1m", amount: "0.0042", status: "settled", description: "Premium feature unlock", time: "2 minutes ago" },
  { id: "txn_7h3k8s2p", amount: "0.0018", status: "settled", description: "API call payment", time: "15 minutes ago" },
  { id: "txn_9m4n7f3q", amount: "0.0095", status: "requires_signature", description: "Monthly subscription", time: "1 hour ago" },
  { id: "txn_6j2k9d5r", amount: "0.0031", status: "settled", description: "Content access fee", time: "3 hours ago" },
  { id: "txn_5h8j3k2s", amount: "0.0067", status: "failed", description: "Premium upgrade", time: "5 hours ago" },
  { id: "txn_4g7j2k9d", amount: "0.0053", status: "settled", description: "Data export request", time: "8 hours ago" },
  { id: "txn_3f6h1j8k", amount: "0.0022", status: "settled", description: "Image processing", time: "12 hours ago" },
  { id: "txn_2e5g9h7j", amount: "0.0088", status: "failed", description: "Webhook delivery", time: "1 day ago" },
];

export default function TransactionsPage() {
  return (
    <div className="content-wrapper">
      <h1 className="section-header">Transactions</h1>
      <p className="section-subheader" style={{ marginTop: "-16px", marginBottom: "32px" }}>
        View and manage all Micropay transactions
      </p>

      <div style={{ marginBottom: "24px", display: "flex", gap: "20px" }}>
        <div style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "20px",
          flex: 1
        }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>Total Transactions</p>
          <p className="mono" style={{ fontSize: "28px", fontWeight: "600", color: "var(--text-primary)" }}>
            {mockTransactions.length}
          </p>
        </div>
        <div style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "20px",
          flex: 1
        }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>Volume (24h)</p>
          <p className="mono" style={{ fontSize: "28px", fontWeight: "600", color: "var(--accent-primary)" }}>
            0.0456 SOL
          </p>
        </div>
        <div style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "20px",
          flex: 1
        }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>Success Rate</p>
          <p className="mono" style={{ fontSize: "28px", fontWeight: "600", color: "var(--text-primary)" }}>
            75%
          </p>
        </div>
      </div>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Amount (SOL)</th>
            <th>Status</th>
            <th>Description</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {mockTransactions.map((txn) => (
            <tr key={txn.id}>
              <td>
                <code className="mono" style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                  {txn.id}
                </code>
              </td>
              <td>
                <span className="mono" style={{ fontWeight: "600", fontSize: "14px" }}>
                  {txn.amount}
                </span>
              </td>
              <td>
                <span className={`status-badge ${
                  txn.status === "settled" ? "status-settled" :
                  txn.status === "requires_signature" ? "status-requires-signature" :
                  "status-failed"
                }`}>
                  {txn.status === "settled" ? "Settled" :
                   txn.status === "requires_signature" ? "Requires Signature" :
                   "Failed"}
                </span>
              </td>
              <td style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                {txn.description}
              </td>
              <td>
                <span className="mono" style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {txn.time}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        marginTop: "24px",
        background: "rgba(0, 255, 136, 0.05)",
        border: "1px solid rgba(0, 255, 136, 0.2)",
        borderRadius: "6px",
        padding: "16px"
      }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          <span style={{ color: "var(--accent-primary)", fontWeight: "600" }}>Status Definitions:</span>
          {" "}
          <span className="status-badge status-settled" style={{ marginLeft: "8px", marginRight: "4px" }}>Settled</span>
          Payment completed
          {" • "}
          <span className="status-badge status-requires-signature" style={{ marginLeft: "4px", marginRight: "4px" }}>Requires Signature</span>
          Awaiting confirmation
          {" • "}
          <span className="status-badge status-failed" style={{ marginLeft: "4px", marginRight: "4px" }}>Failed</span>
          Payment unsuccessful
        </p>
      </div>
    </div>
  );
}
