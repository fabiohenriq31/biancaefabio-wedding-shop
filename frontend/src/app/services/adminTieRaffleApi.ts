import type { TieRaffleAdminData, TieRaffleEntry, TieRaffleUserLookup, TieRaffleWinner } from '../types';
import { adminRequest } from './adminApi';

export type CreateTieRaffleEntryPayload = {
  fullName: string;
  amount: number;
  note?: string;
  userId?: string | null;
};

export function getAdminTieRaffle(token: string, query = '') {
  const suffix = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
  return adminRequest<TieRaffleAdminData>(token, `/api/admin/tie-raffle${suffix}`);
}

export function searchTieRaffleUsers(token: string, query: string) {
  return adminRequest<TieRaffleUserLookup[]>(
    token,
    `/api/admin/tie-raffle/users/search?q=${encodeURIComponent(query)}`
  );
}

export function createTieRaffleEntry(token: string, payload: CreateTieRaffleEntryPayload) {
  return adminRequest<TieRaffleEntry>(token, '/api/admin/tie-raffle/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function deleteTieRaffleEntry(token: string, id: string) {
  return adminRequest<void>(token, `/api/admin/tie-raffle/entries/${id}`, {
    method: 'DELETE',
  });
}

export function drawTieRaffleWinner(token: string) {
  return adminRequest<{ winner: TieRaffleWinner | null }>(token, '/api/admin/tie-raffle/draw', {
    method: 'POST',
  });
}

export function resetTieRaffleWinner(token: string) {
  return adminRequest<{ winner: TieRaffleWinner | null }>(token, '/api/admin/tie-raffle/reset', {
    method: 'POST',
  });
}
