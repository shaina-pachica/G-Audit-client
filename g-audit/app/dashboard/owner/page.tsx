"use client"

import { OwnerDashboard } from "@/components/owner-dashboard"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "../../../components/header"

export default function OwnerDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState<"daily" | "weekly" | "monthly">("daily")
  const [ShowUploadModal, setShowUploadModal] = useState(false)
  const [user, setUser] = useState<any>(null)

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
    <div className="min-h-screen gradient-blue-bg flex flex-col">
      <DashboardHeader
        title="Dashboard"
        currentView={currentView}
        onViewChange={setCurrentView}
        onUpload={() => setShowUploadModal(true)}
        onExport={() => console.log('Export data')}
      />

      <main className="flex-1 animate-fade-in">
        <div className="p-4 sm:p-6 md:p-8 pt-4">
          <OwnerDashboard/>
        </div>
      </main>
    </div>
  );
}
