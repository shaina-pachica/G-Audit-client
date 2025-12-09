'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Upload, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransactionTable } from './transaction-table';
import { CSVUploadModal } from './csv-upload-modal';

interface Transaction {
  id: string;
  type: 'inbound' | 'outbound';
  amount: number;
  reference: string;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  transferFrom?: string;
  balance?: number;
}

interface EmployeeDashboardProps {
  currentView: 'daily' | 'weekly' | 'monthly';
  onViewChange: (view: 'daily' | 'weekly' | 'monthly') => void;
  onUpload: () => void;
  onExport: () => void;
}

export function EmployeeDashboard({
  currentView,
  onViewChange,
  onUpload,
  onExport,
}: EmployeeDashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [stats, setStats] = useState({ inbound: 0, outbound: 0, total: 0 });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));

    // Load mock transactions
    const mockTxns: Transaction[] = [
      {
        id: '1',
        type: 'inbound',
        amount: 5000,
        reference: 'INV-001',
        description: 'Client payment',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        transferFrom: 'GCash 09171234567',
        balance: 15000,
      },
      {
        id: '2',
        type: 'outbound',
        amount: 1200,
        reference: 'EXP-001',
        description: 'Vendor payment',
        date: new Date().toISOString(),
        status: 'completed',
        transferFrom: 'Card ending in 5408',
        balance: 13800,
      },
    ];
    setTransactions(mockTxns);
    updateStats(mockTxns);
  }, []);

  const updateStats = (txns: Transaction[]) => {
    const inbound = txns
      .filter((t) => t.type === 'inbound')
      .reduce((sum, t) => sum + t.amount, 0);
    const outbound = txns
      .filter((t) => t.type === 'outbound')
      .reduce((sum, t) => sum + t.amount, 0);
    setStats({ inbound, outbound, total: txns.length });
  };

  const handleUpload = (newTransactions: Transaction[]) => {
    setTransactions([...transactions, ...newTransactions]);
    updateStats([...transactions, ...newTransactions]);
    setShowUploadModal(false);
  };

  return (
    <div className="pt-20 pb-8 px-4 sm:px-6 min-h-screen">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top section with user info and action buttons */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left:  */}
          <div className="text-left">
            <h1 className="text-3xl font-bold text-foreground">
              {user?.username || 'User'}'s Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Right:*/}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setShowUploadModal(true)}
              className="gap-2 w-full md:w-auto"
            >
              <Upload className="w-4 h-4" />
              Upload PDF
            </Button>
            <Button
              variant="outline"
              className="gap-2 w-full md:w-auto bg-white/5 border-white/20 hover:bg-white/10"
            >
              <Edit3 className="w-4 h-4" />
              Enter Data
            </Button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Starting Balance
              </CardTitle>
              <CardDescription className="text-xs">
                Opening balance for this period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$10,000.00</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Ending Balance
              </CardTitle>
              <CardDescription className="text-xs">
                Balance after all transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(10000 + stats.inbound - stats.outbound).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Net Flow
              </CardTitle>
              <CardDescription className="text-xs">
                Total inbound minus outbound
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  stats.inbound - stats.outbound >= 0
                    ? 'text-primary'
                    : 'text-destructive'
                }`}
              >
                {stats.inbound - stats.outbound >= 0 ? '+' : '-'}$
                {Math.abs(stats.inbound - stats.outbound).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Total Inbound
              </CardTitle>
              <CardDescription className="text-xs">
                Total money received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                +${stats.inbound.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Total Outbound
              </CardTitle>
              <CardDescription className="text-xs">
                Total money sent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                -${stats.outbound.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                Total Transactions
              </CardTitle>
              <CardDescription className="text-xs">
                Number of transactions uploaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="border-white/20">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your GCash transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionTable transactions={transactions} userType="employee" />
          </CardContent>
        </Card>
      </div>

      <CSVUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
