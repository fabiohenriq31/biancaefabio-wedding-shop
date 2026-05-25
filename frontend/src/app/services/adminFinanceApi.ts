import type { FinancialEntry } from '../types';
import { adminRequest } from './adminApi';

export type CreateFinancialEntryPayload = {
  amount: number;
  note?: string;
  savedAt?: string;
};

export function getAdminFinanceEntries(token: string) {
  return adminRequest<FinancialEntry[]>(token, '/api/admin/finance');
}

export function createAdminFinanceEntry(token: string, payload: CreateFinancialEntryPayload) {
  return adminRequest<FinancialEntry>(token, '/api/admin/finance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function deleteAdminFinanceEntry(token: string, id: string) {
  return adminRequest<void>(token, `/api/admin/finance/${id}`, {
    method: 'DELETE',
  });
}
