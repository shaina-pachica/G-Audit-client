"use client"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: string
  type: "inbound" | "outbound"
  amount: number
  reference: string
  description: string
  date: string
  employeeName?: string
  employeeId?: string
  transferFrom?: string
  transferTo?: string
  balance?: number
}

export function TransactionTable({
  transactions,
  userType,
  showEmployee,
}: { transactions: Transaction[]; userType?: "employee" | "owner"; showEmployee?: boolean }) {
  if (transactions.length === 0) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">No transactions found</div>
  }

  const isEmployee = userType === "employee"

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border">
          <tr className="text-muted-foreground">
            <th className="text-left py-3 px-4 font-medium">Date & Time</th>
            <th className="text-left py-3 px-4 font-medium">Transfer From</th>
            <th className="text-left py-3 px-4 font-medium">Reference #</th>
            <th className="text-left py-3 px-4 font-medium">Amount</th>
            {!isEmployee && (
              <th className="text-left py-3 px-4 font-medium">Transfer To</th>
            )}
            {isEmployee && (
              <th className="text-left py-3 px-4 font-medium">Balance</th>
            )}
            {showEmployee && (
              <th className="text-left py-3 px-4 font-medium">Employee</th>
            )}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr
              key={tx.id}
              className={`border-b border-border hover:bg-muted/50 transition-colors ${
                index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
              }`}
            >
              <td className="py-3 px-4 text-muted-foreground">
                {new Date(tx.date).toLocaleString()}
              </td>
              <td className="py-3 px-4">{tx.transferFrom || '—'}</td>
              <td className="py-3 px-4 font-mono text-primary">
                {tx.reference}
              </td>
              <td
                className={`py-3 px-4 font-semibold ${
                  tx.type === 'inbound' ? 'text-primary' : 'text-destructive'
                }`}
              >
                {tx.type === 'inbound' ? '+' : '-'}${tx.amount.toLocaleString()}
              </td>
              {!isEmployee && (
                <td className="py-3 px-4">{tx.transferTo || '—'}</td>
              )}
              {isEmployee && (
                <td className="py-3 px-4">
                  ${tx.balance?.toLocaleString() || '—'}
                </td>
              )}
              {showEmployee && <td className="py-3 px-4">{tx.employeeName}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
