'use client';

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

interface Employee {
  id: string;
  name: string;
}

interface TransactionFilterSearchProps {
  title?: string;
  description?: string;

  employees?: Employee[];
  showEmployeeFilter?: boolean;

  selectedEmployee: string;
  onEmployeeChange: (value: string) => void;

  selectedType: string;
  onTypeChange: (value: string) => void;

  searchRef: string;
  onSearchRefChange: (value: string) => void;
}

export function TransactionFilterSearch({
  title = 'Filtering & Search',
  description = 'Filter transactions by type or reference',
  employees = [],
  showEmployeeFilter = false,

  selectedEmployee,
  onEmployeeChange,

  selectedType,
  onTypeChange,

  searchRef,
  onSearchRefChange,
}: TransactionFilterSearchProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3 mt-8">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Employee Filter (optional) */}
            {showEmployeeFilter && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Employee</label>
                <Select
                  value={selectedEmployee}
                  onValueChange={onEmployeeChange}
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
            )}

            {/* Transaction Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Transaction Type
              </label>
              <Select
                value={selectedType}
                onValueChange={onTypeChange}
              >
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

            {/* Search Reference */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Search Reference
              </label>
              <Input
                placeholder="INV-001, EXP-001..."
                value={searchRef}
                onChange={(e) => onSearchRefChange(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
