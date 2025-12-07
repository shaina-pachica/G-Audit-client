"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Transaction {
  employeeId: string
  employeeName: string
  type: "inbound" | "outbound"
  amount: number
}

interface Employee {
  id: string
  name: string
}

export function AggregationChart({ transactions, employees }: { transactions: Transaction[]; employees: Employee[] }) {
  const aggregated = employees
    .map((emp) => {
      const empTransactions = transactions.filter((t) => t.employeeId === emp.id)
      const inbound = empTransactions.filter((t) => t.type === "inbound").reduce((sum, t) => sum + t.amount, 0)
      const outbound = empTransactions.filter((t) => t.type === "outbound").reduce((sum, t) => sum + t.amount, 0)

      return {
        name: emp.name,
        Inbound: inbound,
        Outbound: outbound,
        Net: inbound - outbound,
      }
    })
    .filter((item) => item.Inbound > 0 || item.Outbound > 0)

  if (aggregated.length === 0) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">No data to display</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={aggregated}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
        <YAxis stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
          formatter={(value: any) => `$${value.toLocaleString()}`}
        />
        <Legend />
        <Bar dataKey="Inbound" fill="var(--color-primary)" />
        <Bar dataKey="Outbound" fill="var(--color-destructive)" />
      </BarChart>
    </ResponsiveContainer>
  )
}
