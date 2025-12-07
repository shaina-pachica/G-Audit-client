"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Calendar, BarChart3, Plus, UserPlus, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface SidebarNavProps {
  userRole?: "owner" | "employee"
  onAddTransaction?: () => void
  onAddEmployee?: () => void
  onNavigate?: (view: "daily" | "weekly" | "monthly") => void
  currentView?: "daily" | "weekly" | "monthly"
}

export function SidebarNav({
  userRole = "employee",
  onAddTransaction,
  onAddEmployee,
  onNavigate,
  currentView = "daily",
}: SidebarNavProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  const handleNavigate = (view: "daily" | "weekly" | "monthly") => {
    onNavigate?.(view)
    setIsOpen(false)
  }

  const handleAddTransaction = () => {
    onAddTransaction?.()
    setIsOpen(false)
  }

  const handleAddEmployee = () => {
    onAddEmployee?.()
    setIsOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
    setIsOpen(false)
  }

  const isActive = (view: string) => currentView === view

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed md:hidden top-4 left-4 z-50 p-2 rounded-md bg-accent hover:bg-accent/90 text-accent-foreground transition-colors"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <nav
        className={`
          fixed md:relative top-0 left-0 h-screen w-60 bg-sidebar border-r border-sidebar-border
          transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col overflow-y-auto
        `}
      >
        {/* Header */}
        <div className="px-5 py-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-sidebar-foreground">G-Audit</h2>
              <p className="text-xs text-muted-foreground">{userRole === "owner" ? "Owner" : "Employee"}</p>
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 px-3 py-6 space-y-6">
          {/* Data Views Section */}
          <div className="space-y-2">
            <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Views</p>
            <div className="space-y-1">
              {["daily", "weekly", "monthly"].map((view) => (
                <button
                  key={view}
                  onClick={() => handleNavigate(view as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(view)
                      ? "bg-sidebar-accent text-sidebar-primary font-medium"
                      : "text-sidebar-foreground hover:bg-muted/30"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="capitalize">{view}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-2">
            <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</p>
            <div className="space-y-1">
              <Button
                onClick={handleAddTransaction}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-muted/30 hover:text-sidebar-primary h-9"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </Button>

              {userRole === "owner" && (
                <Button
                  onClick={handleAddEmployee}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-muted/30 hover:text-sidebar-primary h-9"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Employee</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-3 py-4 border-t border-sidebar-border">
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 h-9"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </nav>
    </>
  )
}
