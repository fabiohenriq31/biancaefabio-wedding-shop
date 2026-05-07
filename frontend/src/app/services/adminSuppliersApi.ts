import type { Supplier } from '../types';
import { adminRequest } from './adminApi';

export type CreateSupplierPayload = {
  name: string;
  category?: string;
  contact?: string;
  notes?: string;
  staffCount?: number;
  totalCost: number;
  initialPayment?: number;
  initialPaidAt?: string;
  initialPaymentNote?: string;
};

export type UpdateSupplierPayload = {
  name: string;
  category?: string;
  contact?: string;
  notes?: string;
  staffCount?: number;
  totalCost: number;
};

export function getAdminSuppliers(token: string) {
  return adminRequest<Supplier[]>(token, '/api/admin/suppliers');
}

export function createSupplier(token: string, payload: CreateSupplierPayload) {
  return adminRequest<Supplier>(token, '/api/admin/suppliers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function updateSupplier(token: string, id: string, payload: UpdateSupplierPayload) {
  return adminRequest<Supplier>(token, `/api/admin/suppliers/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function addSupplierPayment(
  token: string,
  id: string,
  payload: { amount: number; paidAt?: string; note?: string }
) {
  return adminRequest<Supplier>(token, `/api/admin/suppliers/${id}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function deleteSupplier(token: string, id: string) {
  return adminRequest<void>(token, `/api/admin/suppliers/${id}`, {
    method: 'DELETE',
  });
}
