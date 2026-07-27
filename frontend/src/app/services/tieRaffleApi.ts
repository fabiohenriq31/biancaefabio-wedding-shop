import { API_URL } from './api';
import type { TieRafflePublicData } from '../types';

export async function getTieRaffleStatus(): Promise<TieRafflePublicData> {
  const response = await fetch(`${API_URL}/api/tie-raffle`);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Nao foi possivel carregar a hora da gravata.');
  }

  return data as TieRafflePublicData;
}
