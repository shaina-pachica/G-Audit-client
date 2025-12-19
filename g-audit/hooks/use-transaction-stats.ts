export function useTransactionStats<T>(
  transactions: T[],
  getType: (t: T) => 'inbound' | 'outbound',
  getAmount: (t: T) => number,
  getEmployeeId?: (t: T) => string
) {
  const inbound = transactions
    .filter((t) => getType(t) === 'inbound')
    .reduce((sum, t) => sum + getAmount(t), 0);

  const outbound = transactions
    .filter((t) => getType(t) === 'outbound')
    .reduce((sum, t) => sum + getAmount(t), 0);

  return {
    inbound,
    outbound,
    transactionCount: transactions.length,
    employeeCount: getEmployeeId
      ? new Set(transactions.map(getEmployeeId)).size
      : undefined,
  };
}
