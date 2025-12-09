"use client"

import { EmployeeDashboard } from "@/components/employee-dashboard"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "../../../components/header"

export default function EmployeeDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState<"daily" | "weekly" | "monthly">("daily")
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col">
      <DashboardHeader
        title="G-Audit"
        currentView={currentView}
        onViewChange={setCurrentView}
        onUpload={() => setShowUploadModal(true)}
        onExport={() => console.log('Export data')}
      />

      <main className="flex-1 pt-16 md:pt-0">
        <div className="p-4 sm:p-6 md:p-8">
          <EmployeeDashboard />
        </div>
      </main>
    </div>
  );
}
