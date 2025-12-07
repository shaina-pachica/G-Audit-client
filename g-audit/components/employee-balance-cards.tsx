"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: string
  employeeId: string
  employeeName: string
  type: "inbound" | "outbound"
  amount: number
  reference: string
  description: string
  date: string
  status: "pending" | "completed" | "failed"
}

interface Employee {
  id: string
  name: string
  email: string
}

export function EmployeeBalanceCards({
  transactions,
  employees,
}: { transactions: Transaction[]; employees: Employee[] }) {
  const calculateEmployeeBalance = (employeeId: string) => {
    return transactions
      .filter((t) => t.employeeId === employeeId && t.status === "completed")
      .reduce((balance, t) => {
        return t.type === "inbound" ? balance + t.amount : balance - t.amount
      }, 0)
  }

  const getEmployeeStats = (employeeId: string) => {
    const employeeTxns = transactions.filter((t) => t.employeeId === employeeId)
    const inbound = employeeTxns
      .filter((t) => t.type === "inbound" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0)
    const outbound = employeeTxns
      .filter((t) => t.type === "outbound" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0)
    return { inbound, outbound }
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {employees.map((employee) => {
        const balance = calculateEmployeeBalance(employee.id)
        const stats = getEmployeeStats(employee.id)
        const isPositive = balance >= 0

        return (
          <Card key={employee.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{employee.name}</CardTitle>
              <CardDescription className="text-xs">{employee.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className={`text-3xl font-bold ${isPositive ? "text-primary" : "text-destructive"}`}>
                  {isPositive ? "+" : "-"}${Math.abs(balance).toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Inbound</p>
                  <p className="text-lg font-semibold text-primary">+${stats.inbound.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Outbound</p>
                  <p className="text-lg font-semibold text-destructive">-${stats.outbound.toLocaleString()}</p>
                </div>
              </div>

              <Badge variant="outline" className="w-full justify-center py-1.5 text-xs">
                {transactions.filter((t) => t.employeeId === employee.id).length} transactions
              </Badge>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
