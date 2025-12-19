'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface BalanceSummaryCardsProps {
  currency?: string;
  startingBalance: number;
  inbound: number;
  outbound: number;
  transactionCount: number;
}

export function BalanceSummaryCards({
  currency = '₱',
  startingBalance,
  inbound,
  outbound,
  transactionCount,
}: BalanceSummaryCardsProps) {
  const netFlow = inbound - outbound;
  const endingBalance = startingBalance + netFlow;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase">
            Starting Balance
          </CardTitle>
          <CardDescription>Opening balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {currency}{startingBalance.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase">
            Ending Balance
          </CardTitle>
          <CardDescription>After all transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {currency}{endingBalance.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase text-green-600">
            Total Inbound
          </CardTitle>
          <CardDescription>Total received</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold text-green-600">
            +{currency}{inbound.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase text-destructive">
            Total Outbound
          </CardTitle>
          <CardDescription>Total sent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold text-destructive">
            -{currency}{outbound.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase">
            Net Flow
          </CardTitle>
          <CardDescription>Inbound minus outbound</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-semibold ${
              netFlow >= 0 ? 'text-foreground' : 'text-destructive'
            }`}
          >
            {netFlow >= 0 ? '+' : '-'}
            {currency}{Math.abs(netFlow).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase">
            Total Transactions
          </CardTitle>
          <CardDescription>Transaction count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {transactionCount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
