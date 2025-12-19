export type TransactionType = 'inbound' | 'outbound';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface BaseTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  reference: string;
  description: string;
  date: string;
  status: TransactionStatus;
}
