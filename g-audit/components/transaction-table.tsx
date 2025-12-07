"use client"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: string
  type: "inbound" | "outbound"
  amount: number
  reference: string
  description: string
  date: string
  status: "pending" | "completed" | "failed"
  employeeName?: string
  employeeId?: string
}

export function TransactionTable({
  transactions,
  showEmployee,
}: { transactions: Transaction[]; showEmployee?: boolean }) {
  if (transactions.length === 0) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">No transactions found</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border">
          <tr className="text-muted-foreground">
            <th className="text-left py-3 px-4 font-medium">Reference</th>
            {showEmployee && <th className="text-left py-3 px-4 font-medium">Employee</th>}
            <th className="text-left py-3 px-4 font-medium">Description</th>
            <th className="text-left py-3 px-4 font-medium">Type</th>
            <th className="text-right py-3 px-4 font-medium">Amount</th>
            <th className="text-left py-3 px-4 font-medium">Date</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 font-mono text-primary">{tx.reference}</td>
              {showEmployee && <td className="py-3 px-4">{tx.employeeName}</td>}
              <td className="py-3 px-4">{tx.description}</td>
              <td className="py-3 px-4">
                <Badge variant={tx.type === "inbound" ? "default" : "secondary"} className="capitalize">
                  {tx.type}
                </Badge>
              </td>
              <td
                className={`py-3 px-4 text-right font-semibold ${tx.type === "inbound" ? "text-primary" : "text-destructive"}`}
              >
                {tx.type === "inbound" ? "+" : "-"}${tx.amount.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</td>
              <td className="py-3 px-4">
                <Badge
                  variant={
                    tx.status === "completed" ? "default" : tx.status === "pending" ? "secondary" : "destructive"
                  }
                  className="capitalize"
                >
                  {tx.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
