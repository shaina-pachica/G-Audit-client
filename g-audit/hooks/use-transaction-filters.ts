import { useMemo } from 'react';

interface FilterOptions<T> {
  transactions: T[];
  selectedEmployee?: string;
  selectedType?: string;
  searchRef?: string;
  getEmployeeId?: (t: T) => string;
  getType: (t: T) => string;
  getSearchableText: (t: T) => string;
}

export function useTransactionFilters<T>({
  transactions,
  selectedEmployee = 'all',
  selectedType = 'all',
  searchRef = '',
  getEmployeeId,
  getType,
  getSearchableText,
}: FilterOptions<T>) {
  return useMemo(() => {
    return transactions.filter((t) => {
      if (
        selectedEmployee !== 'all' &&
        getEmployeeId &&
        getEmployeeId(t) !== selectedEmployee
      ) {
        return false;
      }

      if (selectedType !== 'all' && getType(t) !== selectedType) {
        return false;
      }

      if (
        searchRef &&
        !getSearchableText(t).toLowerCase().includes(searchRef.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [transactions, selectedEmployee, selectedType, searchRef]);
}
