"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Upload } from "lucide-react"
import Papa from "papaparse"

interface Transaction {
  id: string
  type: "inbound" | "outbound"
  amount: number
  reference: string
  description: string
  date: string
  status: "pending" | "completed" | "failed"
}

interface CSVUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (transactions: Transaction[]) => void
}

export function CSVUploadModal({ isOpen, onClose, onUpload }: CSVUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError("")
    setParsing(true)

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        try {
          const parsed = results.data.map((row: any, index: number) => ({
            id: `${Date.now()}-${index}`,
            type: row.type?.toLowerCase() === "inbound" ? "inbound" : "outbound",
            amount: Number.parseFloat(row.amount) || 0,
            reference: row.reference || `TXN-${index}`,
            description: row.description || "Transaction",
            date: row.date ? new Date(row.date).toISOString() : new Date().toISOString(),
            status: "completed" as const,
          }))

          setPreview(parsed)
          setParsing(false)
        } catch (err: any) {
          setError(`Failed to parse CSV: ${err.message}`)
          setParsing(false)
        }
      },
      error: (error: any) => {
        setError(`CSV parsing error: ${error.message}`)
        setParsing(false)
      },
    })
  }

  const handleUpload = () => {
    if (preview.length === 0) {
      setError("No valid transactions to upload")
      return
    }

    onUpload(preview)
    setFile(null)
    setPreview([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Upload Transactions CSV</CardTitle>
          <CardDescription>
            Import transactions from a CSV file. Format: reference, type, amount, description, date
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="font-medium">Click to select CSV file or drag and drop</p>
            <p className="text-sm text-muted-foreground">
              Supports CSV format with columns: reference, type, amount, description, date
            </p>
            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          </div>

          {error && (
            <div className="flex gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {preview.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-primary">
                <CheckCircle className="w-4 h-4" />
                {preview.length} transactions ready to upload
              </div>

              <div className="max-h-48 overflow-y-auto border border-border rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left p-2">Reference</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-right p-2">Amount</th>
                      <th className="text-left p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 10).map((tx, idx) => (
                      <tr key={idx} className="border-t border-border">
                        <td className="p-2 text-primary">{tx.reference}</td>
                        <td className="p-2 capitalize">{tx.type}</td>
                        <td className="p-2 text-right">${tx.amount.toLocaleString()}</td>
                        <td className="p-2">{tx.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {preview.length > 10 && (
                <p className="text-xs text-muted-foreground">+ {preview.length - 10} more transactions</p>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={preview.length === 0 || parsing}>
              {parsing ? "Parsing..." : `Upload ${preview.length} Transactions`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
