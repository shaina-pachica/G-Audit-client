'use client';
import { Button } from '@/components/ui/button';
import { Upload, Download, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  title: string;
  currentView: 'daily' | 'weekly' | 'monthly';
  onViewChange: (view: 'daily' | 'weekly' | 'monthly') => void;
  onUpload: () => void;
  onExport: () => void;
}

export function DashboardHeader({
  title,
  currentView,
  onViewChange,
  onUpload,
  onExport,
}: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="sticky top-0 z-40 backdrop-blur-md bg-white/50">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 sm:p-6">
        {/* Right side: Title and user info */}
        <div className="flex flex-col order-1 md:order-1">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        </div>

        {/* Center: View dropdown */}
        <div className="order-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                {currentView.charAt(0).toUpperCase() + currentView.slice(1)}{' '}
                View
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewChange('daily')}>
                Daily
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange('weekly')}>
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange('monthly')}>
                Monthly
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Left side: Upload and Export buttons */}
        <div className="flex gap-2 order-2 md:order-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="gap-2 bg-transparent"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
