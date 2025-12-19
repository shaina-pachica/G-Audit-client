'use client';

import { useState, useEffect } from 'react';
import { Upload, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { DashboardHeader } from '@/components/header';
import { TransactionTable } from '@/components/transaction-table';
import { TransactionFilterSearch } from '@/components/transaction-filter-search';
import { BalanceSummaryCards } from '@/components/balance-summary-cards';
import { AggregationChart } from './aggregation-chart';
import { DeveloperCredit } from '@/components/devcredit';

import { useTransactionFilters } from '@/hooks/use-transaction-filters';
import { useTransactionStats } from '@/hooks/use-transaction-stats';
import { DashboardPageHeader } from '@/components/dashboard-page-header';



const STARTING_BALANCE = 50000;

interface Employee {
  id: string;
  name: string;
  email: string;
}

export function OwnerDashboard() {
  const [transactions, setTransactions] = useState<OwnerTransaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchRef, setSearchRef] = useState('');

  useEffect(() => {
    setEmployees([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ]);

    setTransactions([
      {
        id: '1',
        employeeId: '1',
        employeeName: 'John Doe',
        type: 'inbound',
        amount: 5000,
        reference: 'INV-001',
        description: 'Client payment',
        date: new Date().toISOString(),
        status: 'completed',
      },
    ]);
  }, []);

  const filteredTransactions = useTransactionFilters({
    transactions,
    selectedEmployee,
    selectedType,
    searchRef,
    getEmployeeId: (t) => t.employeeId,
    getType: (t) => t.type,
    getSearchableText: (t) => `${t.reference} ${t.description}`,
  });

  const stats = useTransactionStats(
    filteredTransactions,
    (t) => t.type,
    (t) => t.amount,
    (t) => t.employeeId
  );

  return (
    <div className="pt-20 pb-8 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardPageHeader
          title="Owner Dashboard"
          actions={
            <>
              <Button variant="secondary" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add Employee
              </Button>
            </>
          }
        />


        <BalanceSummaryCards
          currency="$"
          startingBalance={STARTING_BALANCE}
          inbound={stats.inbound}
          outbound={stats.outbound}
          transactionCount={stats.transactionCount}
        />

        <TransactionFilterSearch
          title="Filtering & Search"
          description="Filter transactions by employee, type, or reference"
          showEmployeeFilter
          employees={employees}
          selectedEmployee={selectedEmployee}
          onEmployeeChange={setSelectedEmployee}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          searchRef={searchRef}
          onSearchRefChange={setSearchRef}
        />

        <Card>
          <CardHeader>
            <CardTitle>Aggregation by Employee</CardTitle>
            <CardDescription>Inbound vs outbound totals</CardDescription>
          </CardHeader>
          <CardContent>
            <AggregationChart
              transactions={filteredTransactions}
              employees={employees}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>
              All transactions ({filteredTransactions.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionTable
              transactions={filteredTransactions}
              showEmployee
            />
          </CardContent>
        </Card>
      </div>

      <DeveloperCredit />
    </div>
  );
}
