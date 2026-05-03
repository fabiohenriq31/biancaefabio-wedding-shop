import type { Guest } from '../types';
import { adminRequest } from './adminApi';

export type GuestFilter = 'all' | 'confirmed' | 'not_confirmed';

export type CreateGuestPayload = {
  name: string;
  email?: string;
  companions?: string;
  message?: string;
  status: 'confirmed' | 'not_confirmed';
};

export function getAdminGuests(token: string, filter: GuestFilter) {
  const query = filter === 'all' ? '' : `?status=${filter}`;
  return adminRequest<Guest[]>(token, `/api/admin/guests${query}`);
}

export function createAdminGuest(token: string, payload: CreateGuestPayload) {
  return adminRequest<Guest>(token, '/api/admin/guests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function confirmGuest(token: string, id: string) {
  return adminRequest<Guest>(token, `/api/admin/guests/${id}/confirm`, {
    method: 'PATCH',
  });
}

export function unconfirmGuest(token: string, id: string) {
  return adminRequest<Guest>(token, `/api/admin/guests/${id}/unconfirm`, {
    method: 'PATCH',
  });
}
