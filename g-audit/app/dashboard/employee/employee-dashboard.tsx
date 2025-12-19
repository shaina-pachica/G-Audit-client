'use client';

import { useState, useEffect } from 'react';
import { Upload, Edit3 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { DashboardHeader } from '@/components/header';
import { TransactionTable } from '@/components/transaction-table';
import { TransactionFilterSearch } from '@/components/transaction-filter-search';
import { BalanceSummaryCards } from '@/components/balance-summary-cards';

import { CSVUploadModal } from '@/components/csv-upload-modal';
import { EnterDataModal } from '@/components/enter-data-modal';

import { useTransactionFilters } from '@/hooks/use-transaction-filters';
import { useTransactionStats } from '@/hooks/use-transaction-stats';
import { DashboardPageHeader } from '@/components/dashboard-page-header';

//import { EmployeeTransaction } from '@/transaction/transaction';

const STARTING_BALANCE = 10000;

export function EmployeeDashboard() {
  const [transactions, setTransactions] = useState<EmployeeTransaction[]>([]);
  const [user, setUser] = useState<any>(null);

  const [selectedType, setSelectedType] = useState('all');
  const [searchRef, setSearchRef] = useState('');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEnterDataModal, setShowEnterDataModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));

    setTransactions([
      {
        id: '1',
        type: 'inbound',
        amount: 5000,
        reference: 'INV-001',
        description: 'Client payment',
        date: new Date().toISOString(),
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
    ]);
  }, []);

  const filteredTransactions = useTransactionFilters({
    transactions,
    selectedType,
    searchRef,
    getType: (t) => t.type,
    getSearchableText: (t) => `${t.reference} ${t.description}`,
  });

  const stats = useTransactionStats(
    filteredTransactions,
    (t) => t.type,
    (t) => t.amount
  );

  return (
    <div className="pt-16 pb-8 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardPageHeader
  title={`${user?.username || 'Employee'}'s Dashboard`}
  actions={
    <>
      <Button
        variant="secondary"
        onClick={() => setShowUploadModal(true)}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        Upload PDF
      </Button>
      <Button
        variant="outline"
        onClick={() => setShowEnterDataModal(true)}
        className="gap-2"
      >
        <Edit3 className="w-4 h-4" />
        Enter Data
      </Button>
    </>
  }
/>

        <BalanceSummaryCards
          currency="₱"
          startingBalance={STARTING_BALANCE}
          inbound={stats.inbound}
          outbound={stats.outbound}
          transactionCount={stats.transactionCount}
        />

        <TransactionFilterSearch
          title="Filter Transactions"
          description="Filter your transactions by type or reference"
          showEmployeeFilter={false}
          selectedEmployee="all"
          onEmployeeChange={() => {}}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          searchRef={searchRef}
          onSearchRefChange={setSearchRef}
        />

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your GCash transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionTable
              transactions={filteredTransactions}
              userType="employee"
            />
          </CardContent>
        </Card>
      </div>

      <CSVUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={(txns) => setTransactions((prev) => [...prev, ...txns])}
      />

      <EnterDataModal
        isOpen={showEnterDataModal}
        onClose={() => setShowEnterDataModal(false)}
        onSubmit={(txn) => setTransactions((prev) => [...prev, txn])}
      />
    </div>
  );
}
