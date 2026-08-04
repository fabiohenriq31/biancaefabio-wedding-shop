import type { Accommodation, AccommodationStatus, AccommodationType, AdminAccommodationsData } from '../types';
import { adminRequest } from './adminApi';

export type AccommodationPayload = {
  name: string;
  type: AccommodationType;
  status: AccommodationStatus;
  bedDescription: string;
  fixedBeds: number;
  extraMattresses: number;
  extraPlaces: number;
  notes?: string;
  guestIds: string[];
};

export function getAdminAccommodations(token: string) {
  return adminRequest<AdminAccommodationsData>(token, '/api/admin/accommodations');
}

export function createAccommodation(token: string, payload: AccommodationPayload) {
  return adminRequest<Accommodation>(token, '/api/admin/accommodations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function updateAccommodation(token: string, id: string, payload: AccommodationPayload) {
  return adminRequest<Accommodation>(token, `/api/admin/accommodations/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function deleteAccommodation(token: string, id: string) {
  return adminRequest<void>(token, `/api/admin/accommodations/${id}`, {
    method: 'DELETE',
  });
}
