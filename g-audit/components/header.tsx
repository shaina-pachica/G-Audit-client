'use client'
import { Button } from '@/components/ui/button'
import { LogOut, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/50">
      <div className="flex items-center justify-between h-16 px-4 md:px-8 lg:px-12">
        {/* Right side: Title and user info */}
        <div className="flex flex-col order-1 md:order-1">
          <h1 className="text-3xl font-bold text-foreground">G-audit</h1>
        </div>

        {/* Center: View dropdown */}
        <div className="order-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-white/5 border-white/20 hover:bg-white/10"
              >
                {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                Dashboard
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem onClick={() => onViewChange('daily')}>
                Daily Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange('weekly')}>
                Weekly Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange('monthly')}>
                Monthly Dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
