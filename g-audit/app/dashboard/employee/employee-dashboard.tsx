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
import { TransactionTable } from '../../../components/transaction-table';
import { CSVUploadModal } from '../../../components/csv-upload-modal';
import { EnterDataModal } from '../../../components/enter-data-modal';
import { BalanceSummaryCards } from '../../../components/balance-summary-cards';

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
  currentView: 'previous audit' | 'latest audit';
  onViewChange: (view: 'previous audit' | 'latest audit') => void;
  onUpload: () => void;
  onExport: () => void;
}

export function EmployeeDashboard({
}: EmployeeDashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEnterDataModal, setShowEnterDataModal] = useState(false);
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
        reference: '5034222433857',
        description: 'Client payment',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        transferFrom:
          'Received GCash from CARD Bank Inc. with account ending in 5408 and invno:20251111CBMFPHM1XXXB000000024058750',
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
      {
        id: '3',
        type: 'inbound',
        amount: 8500,
        reference: 'INV-002',
        description: 'Project payment',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        transferFrom: 'GCash 09189876543',
        balance: 22300,
      },
      {
        id: '4',
        type: 'inbound',
        amount: 3250,
        reference: 'INV-003',
        description: 'Service fee payment',
        date: new Date(Date.now() - 172800000).toISOString(),
        status: 'completed',
        transferFrom: 'GCash 09156789012',
        balance: 25550,
      },
      {
        id: '5',
        type: 'outbound',
        amount: 2500,
        reference: 'EXP-002',
        description: 'Office supplies',
        date: new Date(Date.now() - 259200000).toISOString(),
        status: 'completed',
        transferFrom: 'BDO Credit Card ending in 4521',
        balance: 19800,
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

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([...transactions, newTransaction]);
    updateStats([...transactions, newTransaction]);
  };

  const startingBalance = 10000;
  const inbound = stats.inbound;
  const outbound = stats.outbound;

  return (
    <div className="pt-15 pb-8 px-4 sm:px-6 min-h-screen">
      <div className="space-y-8 max-w-7xl mx-auto  pt-7">
        {/* Top section with user info and action buttons */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left:  */}
          <div className="text-left">
            <h1 className="text-3xl font-semibold text-black/70">
              {user?.username || 'Employee'}'s Dashboard
            </h1>
            <p className="text-1xl text-muted-foreground mt-1">
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
              variant="secondary"
              className="gap-2 w-full md:w-auto"
            >
              <Upload className="w-4 h-4" />
              Upload PDF
            </Button>
            <Button
              onClick={() => setShowEnterDataModal(true)}
              size='lg'
              variant="outline"
              className="gap-2 w-full md:w-auto"
            >
              <Edit3 className="w-4 h-4" />
              Enter Data
            </Button>
          </div>
        </div>


        <BalanceSummaryCards
          currency="₱"
          startingBalance={startingBalance}
          inbound={inbound}
          outbound={outbound}
          transactionCount={stats.total}
        />

        {/* Transaction History */}
        <Card className="border-white/20">
          <CardHeader>
            <CardTitle className="text-black/70 text-3xl">
              Transaction History
            </CardTitle>
            <CardDescription className='text-muted-foreground'>Your GCash transactions</CardDescription>
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

      <EnterDataModal
        isOpen={showEnterDataModal}
        onClose={() => setShowEnterDataModal(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
}
