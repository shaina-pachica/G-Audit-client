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
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/40 py-2 ">
      <div className="flex items-center justify-between h-16 px-4 md:px-8 lg:px-12">
        {/* Right side: Title */}
        <div className="flex flex-col order-1 md:order-1">
          <h1 className="text-3xl font-bold text-secondary">G-audit</h1>
        </div>

        {/* Center: View tabs */}
        <div className="flex gap-1 sm:gap-2 rounded-lg order-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onViewChange(tab.value)}
              className={`px-3 sm:px-4 py-2 text-xl font-medium rounded-md transition-all duration-200 ${
                currentView === tab.value
                  ? 'bg-black/5 text-black/70 mt-10'
                  : 'text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Left side: Upload and Export buttons */}
        <div className="flex gap-2 order-2 md:order-3">
          <Button
            variant="default"
            size="lg"
            onClick={handleLogout}
            className="gap-2 text-primary"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
