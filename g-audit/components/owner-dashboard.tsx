"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react"
import { TransactionTable } from "./transaction-table"
import { AggregationChart } from "./aggregation-chart"
import { EmployeeBalanceCards } from "./employee-balance-cards"

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

export function OwnerDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchRef, setSearchRef] = useState("")
  const [stats, setStats] = useState({ totalInbound: 0, totalOutbound: 0, employeeCount: 0, transactionCount: 0 })

  useEffect(() => {
    // Mock employees
    const mockEmployees: Employee[] = [
      { id: "1", name: "John Doe", email: "john@example.com" },
      { id: "2", name: "Jane Smith", email: "jane@example.com" },
      { id: "3", name: "Mike Johnson", email: "mike@example.com" },
    ]
    setEmployees(mockEmployees)

    // Mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        employeeId: "1",
        employeeName: "John Doe",
        type: "inbound",
        amount: 5000,
        reference: "INV-001",
        description: "Client payment",
        date: new Date(Date.now() - 259200000).toISOString(),
        status: "completed",
      },
      {
        id: "2",
        employeeId: "1",
        employeeName: "John Doe",
        type: "outbound",
        amount: 1200,
        reference: "EXP-001",
        description: "Vendor payment",
        date: new Date(Date.now() - 172800000).toISOString(),
        status: "completed",
      },
      {
        id: "3",
        employeeId: "2",
        employeeName: "Jane Smith",
        type: "inbound",
        amount: 8500,
        reference: "INV-002",
        description: "Project payment",
        date: new Date(Date.now() - 86400000).toISOString(),
        status: "completed",
      },
      {
        id: "4",
        employeeId: "2",
        employeeName: "Jane Smith",
        type: "outbound",
        amount: 3200,
        reference: "EXP-002",
        description: "Equipment purchase",
        date: new Date(Date.now() - 86400000).toISOString(),
        status: "completed",
      },
      {
        id: "5",
        employeeId: "3",
        employeeName: "Mike Johnson",
        type: "inbound",
        amount: 12000,
        reference: "INV-003",
        description: "Contract fulfillment",
        date: new Date().toISOString(),
        status: "completed",
      },
      {
        id: "6",
        employeeId: "3",
        employeeName: "Mike Johnson",
        type: "outbound",
        amount: 2500,
        reference: "EXP-003",
        description: "Service payment",
        date: new Date().toISOString(),
        status: "pending",
      },
    ]
    setTransactions(mockTransactions)
    setFilteredTransactions(mockTransactions)
    updateStats(mockTransactions)
  }, [])

  const updateStats = (txns: Transaction[]) => {
    const totalInbound = txns.filter((t) => t.type === "inbound").reduce((sum, t) => sum + t.amount, 0)
    const totalOutbound = txns.filter((t) => t.type === "outbound").reduce((sum, t) => sum + t.amount, 0)
    setStats({
      totalInbound,
      totalOutbound,
      employeeCount: new Set(txns.map((t) => t.employeeId)).size,
      transactionCount: txns.length,
    })
  }

  const applyFilters = () => {
    let filtered = transactions

    if (selectedEmployee !== "all") {
      filtered = filtered.filter((t) => t.employeeId === selectedEmployee)
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((t) => t.type === selectedType)
    }

    if (searchRef) {
      filtered = filtered.filter(
        (t) =>
          t.reference.toLowerCase().includes(searchRef.toLowerCase()) ||
          t.description.toLowerCase().includes(searchRef.toLowerCase()),
      )
    }

    setFilteredTransactions(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [selectedEmployee, selectedType, searchRef])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-foreground">Owner Dashboard</h1>
        <p className="text-muted-foreground">Monitor and analyze all employee transactions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inbound</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalInbound.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All inbound transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outbound</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalOutbound.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All outbound transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employeeCount}</div>
            <p className="text-xs text-muted-foreground">With transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
            <DollarSign className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalInbound - stats.totalOutbound).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Inbound minus outbound</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Account Balance</CardTitle>
          <CardDescription>Current balance for each employee (inbound minus outbound)</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeBalanceCards transactions={transactions} employees={employees} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Filtering & Search</CardTitle>
            <CardDescription>Filter transactions by employee, type, or reference</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Employee</label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Transaction Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Search Reference</label>
                <Input
                  placeholder="INV-001, EXP-001..."
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aggregation By Employee</CardTitle>
          <CardDescription>Total inbound vs outbound per employee</CardDescription>
        </CardHeader>
        <CardContent>
          <AggregationChart transactions={filteredTransactions} employees={employees} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>All transactions ({filteredTransactions.length})</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionTable transactions={filteredTransactions} showEmployee />
        </CardContent>
      </Card>
    </div>
  )
}
