import { adminRequest } from './adminApi';
import type { SocialPost } from '../types';

export type SocialPostFilter = 'all' | 'approved' | 'hidden';

export function getAdminSocialPosts(token: string, status: SocialPostFilter = 'all') {
  return adminRequest<SocialPost[]>(token, `/api/admin/social-posts?status=${status}`);
}

export function hideSocialPost(token: string, id: string) {
  return adminRequest<SocialPost>(token, `/api/admin/social-posts/${id}/hide`, {
    method: 'PATCH',
  });
}

export function showSocialPost(token: string, id: string) {
  return adminRequest<SocialPost>(token, `/api/admin/social-posts/${id}/show`, {
    method: 'PATCH',
  });
}

export function deleteSocialPost(token: string, id: string) {
  return adminRequest<void>(token, `/api/admin/social-posts/${id}`, {
    method: 'DELETE',
  });
}
