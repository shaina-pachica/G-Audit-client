"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, CheckCircle, TrendingUp, TrendingDown } from "lucide-react"
import { TransactionTable } from "./transaction-table"
import { CSVUploadModal } from "./csv-upload-modal"

interface Transaction {
  id: string
  type: "inbound" | "outbound"
  amount: number
  reference: string
  description: string
  date: string
  status: "pending" | "completed" | "failed"
}

export function EmployeeDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [user, setUser] = useState<any>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [stats, setStats] = useState({ inbound: 0, outbound: 0, total: 0 })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) setUser(JSON.parse(userData))

    // Load mock transactions
    setTransactions([
      {
        id: "1",
        type: "inbound",
        amount: 5000,
        reference: "INV-001",
        description: "Client payment",
        date: new Date(Date.now() - 86400000).toISOString(),
        status: "completed",
      },
      {
        id: "2",
        type: "outbound",
        amount: 1200,
        reference: "EXP-001",
        description: "Vendor payment",
        date: new Date().toISOString(),
        status: "completed",
      },
    ])

    updateStats([
      {
        id: "1",
        type: "inbound",
        amount: 5000,
        reference: "INV-001",
        description: "Client payment",
        date: new Date(Date.now() - 86400000).toISOString(),
        status: "completed",
      },
      {
        id: "2",
        type: "outbound",
        amount: 1200,
        reference: "EXP-001",
        description: "Vendor payment",
        date: new Date().toISOString(),
        status: "completed",
      },
    ])
  }, [])

  const updateStats = (txns: Transaction[]) => {
    const inbound = txns.filter((t) => t.type === "inbound").reduce((sum, t) => sum + t.amount, 0)
    const outbound = txns.filter((t) => t.type === "outbound").reduce((sum, t) => sum + t.amount, 0)
    setStats({ inbound, outbound, total: txns.length })
  }

  const handleUpload = (newTransactions: Transaction[]) => {
    setTransactions([...transactions, ...newTransactions])
    updateStats([...transactions, ...newTransactions])
    setShowUploadModal(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-foreground">Daily Records</h1>
        
        <p 
        className="text-muted-foreground">Welcome, {user?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inbound Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.inbound.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outbound Transactions</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.outbound.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Transactions uploaded</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button size="lg" onClick={() => setShowUploadModal(true)} className="gap-2">
          <Upload className="w-4 h-4" />
          Upload CSV
        </Button>
        <Button variant="outline" size="lg">
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All your uploaded transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionTable transactions={transactions} />
        </CardContent>
      </Card>

      <CSVUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUpload={handleUpload} />
    </div>
  )
}
