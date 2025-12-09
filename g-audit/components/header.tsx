'use client'
import { Button } from '@/components/ui/button'
import { LogOut, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  currentView: 'daily' | 'weekly' | 'monthly'
  onViewChange: (view: 'daily' | 'weekly' | 'monthly') => void
}

export function DashboardHeader({
  currentView,
  onViewChange,
}: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const tabs = [
    { label: 'Daily', value: 'daily' as const },
    { label: 'Weekly', value: 'weekly' as const},
    { label: 'Monthly', value: 'monthly' as const },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/50">
      <div className="flex items-center justify-between h-16 px-4 md:px-8 lg:px-12">
        {/* Right side: Title and user info */}
        <div className="flex flex-col order-1 md:order-1">
          <h1 className="text-3xl font-bold text-foreground">G-audit</h1>
        </div>

        {/* Center: View dropdown */}
        <div className="flex gap-1 sm:gap-2 bg-white/5 p-1 rounded-lg order-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onViewChange(tab.value)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-300 ${
                currentView === tab.value
                  ? 'bg-transparent text-foreground shadow-lg ring-1 ring-white/20 backdrop-blur-0'
                  : 'text-muted-foreground hover:text-foreground bg-white/5 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Left side: Upload and Export buttons */}
        <div className="flex gap-2 order-2 md:order-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
