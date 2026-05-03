import type { GuestPhoto } from '../types';
import { adminRequest } from './adminApi';

export type GuestPhotoFilter = 'all' | 'approved' | 'hidden';

export function getAdminGuestPhotos(token: string, filter: GuestPhotoFilter) {
  const query = filter === 'all' ? '' : `?status=${filter}`;
  return adminRequest<GuestPhoto[]>(token, `/api/admin/guest-photos${query}`);
}

export function hideGuestPhoto(token: string, id: string) {
  return adminRequest<GuestPhoto>(token, `/api/admin/guest-photos/${id}/hide`, {
    method: 'PATCH',
  });
}

export function showGuestPhoto(token: string, id: string) {
  return adminRequest<GuestPhoto>(token, `/api/admin/guest-photos/${id}/show`, {
    method: 'PATCH',
  });
}

export function deleteGuestPhoto(token: string, id: string) {
  return adminRequest<void>(token, `/api/admin/guest-photos/${id}`, {
    method: 'DELETE',
  });
}
