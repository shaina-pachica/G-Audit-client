'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransactionTable } from '../../../components/transaction-table';
import { AggregationChart } from './aggregation-chart';
import { DeveloperCredit } from '../../../components/devcredit';
import { BalanceSummaryCards } from '../../../components/balance-summary-cards';

const startingBalance = 50000;

interface Transaction {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'inbound' | 'outbound';
  amount: number;
  reference: string;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  transferFrom?: string;
  transferTo?: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
}

export function OwnerDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchRef, setSearchRef] = useState('');
  const [stats, setStats] = useState({
    totalInbound: 0,
    totalOutbound: 0,
    employeeCount: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    // Mock employees
    const mockEmployees: Employee[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
    ];
    setEmployees(mockEmployees);

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        employeeId: '1',
        employeeName: 'John Doe',
        type: 'inbound',
        amount: 5000,
        reference: 'INV-001',
        description: 'Client payment',
        date: new Date(Date.now() - 259200000).toISOString(),
        status: 'completed',
        transferFrom: 'GCash 09171234567',
        transferTo: 'GCash 09201111111',
      },
      {
        id: '2',
        employeeId: '1',
        employeeName: 'John Doe',
        type: 'outbound',
        amount: 1200,
        reference: 'EXP-001',
        description: 'Vendor payment',
        date: new Date(Date.now() - 172800000).toISOString(),
        status: 'completed',
        transferFrom: 'BDO Credit Card ending in 5408',
        transferTo: 'GCash 09209876543',
      },
      {
        id: '3',
        employeeId: '2',
        employeeName: 'Jane Smith',
        type: 'inbound',
        amount: 8500,
        reference: 'INV-002',
        description: 'Project payment',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        transferFrom: 'GCash 09189876543',
        transferTo: 'GCash 09201111111',
      },
    ];
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
    updateStats(mockTransactions);
  }, []);

  const updateStats = (txns: Transaction[]) => {
    const totalInbound = txns
      .filter((t) => t.type === 'inbound')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalOutbound = txns
      .filter((t) => t.type === 'outbound')
      .reduce((sum, t) => sum + t.amount, 0);
    setStats({
      totalInbound,
      totalOutbound,
      employeeCount: new Set(txns.map((t) => t.employeeId)).size,
      transactionCount: txns.length,
    });
  };

  const applyFilters = () => {
    let filtered = transactions;

    if (selectedEmployee !== 'all') {
      filtered = filtered.filter((t) => t.employeeId === selectedEmployee);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    if (searchRef) {
      filtered = filtered.filter(
        (t) =>
          t.reference.toLowerCase().includes(searchRef.toLowerCase()) ||
          t.description.toLowerCase().includes(searchRef.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedEmployee, selectedType, searchRef]);

  return (
    <div className="pt-20 pb-8 px-4 sm:px-6 min-h-screen">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top section with buttons and user info */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left: Action Buttons */}
          <div className="text-left">
            <h1 className="text-3xl font-bold text-black/70">
              Owner Dashboard
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

          {/* Right: User Info */}
          <div className="flex flex-col gap-3">
            <Button variant="secondary" className="gap-2 w-full md:w-auto">
              <Upload className="w-4 h-4" />
              Upload PDF
            </Button>
            <Button
              variant="outline"
              className="gap-2 w-full md:w-auto"
            >
              <UserPlus className="w-4 h-4" />
              Add Employee
            </Button>
          </div>
        </div>

        <BalanceSummaryCards
          currency="$"
          startingBalance={startingBalance}
          inbound={stats.totalInbound}
          outbound={stats.totalOutbound}
          transactionCount={stats.transactionCount}
        />

        {/* Filtering & Search */}
        <div className="grid gap-4 lg:grid-cols-3 mt-8">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Filtering & Search</CardTitle>
              <CardDescription>
                Filter transactions by employee, type, or reference
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee</label>
                  <Select
                    value={selectedEmployee}
                    onValueChange={setSelectedEmployee}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Transaction Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="inbound">Inbound</SelectItem>
                      <SelectItem value="outbound">Outbound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Search Reference
                  </label>
                  <Input
                    placeholder="INV-001, EXP-001..."
                    value={searchRef}
                    onChange={(e) => setSearchRef(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aggregation By Employee */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Aggregation By Employee</CardTitle>
            <CardDescription>
              Total inbound vs outbound per employee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AggregationChart
              transactions={filteredTransactions}
              employees={employees}
            />
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card className="mt-8">
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
