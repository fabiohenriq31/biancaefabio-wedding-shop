import type { Guest } from '../types';
import { adminRequest } from './adminApi';

export type GuestFilter = 'all' | 'confirmed' | 'not_confirmed';

export function getAdminGuests(token: string, filter: GuestFilter) {
  const query = filter === 'all' ? '' : `?status=${filter}`;
  return adminRequest<Guest[]>(token, `/api/admin/guests${query}`);
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
