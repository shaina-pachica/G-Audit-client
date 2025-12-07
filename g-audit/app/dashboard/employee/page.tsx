"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { EmployeeDashboard } from "@/components/employee-dashboard"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function EmployeeDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState<"daily" | "weekly" | "monthly">("daily")

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
    <div className="min-h-screen bg-background flex">
      <SidebarNav
        userRole="employee"
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onAddTransaction={() => console.log("Add transaction")}
      />

      <main className="flex-1 pt-16 md:pt-0">
        <div className="p-4 sm:p-6 md:p-8">
          <EmployeeDashboard />
        </div>
      </main>
    </div>
  )
}
