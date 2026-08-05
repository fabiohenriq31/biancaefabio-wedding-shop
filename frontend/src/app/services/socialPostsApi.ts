import { API_URL } from './api';
import { authorizedJsonRequest } from './authSession';
import type { SocialPost } from '../types';

export function getSocialPosts(token: string) {
  return authorizedJsonRequest<SocialPost[]>(`${API_URL}/api/social-posts`, {}, token);
}

export async function createSocialPost({
  token,
  message,
  images,
}: {
  token: string;
  message: string;
  images?: File[];
}) {
  const formData = new FormData();
  formData.append('message', message);

  for (const image of images || []) {
    formData.append('images', image);
  }

  return authorizedJsonRequest<{ message: string; post: SocialPost }>(
    `${API_URL}/api/social-posts`,
    {
      method: 'POST',
      body: formData,
    },
    token
  );
}

export function likeSocialPost(token: string, id: string) {
  return authorizedJsonRequest<SocialPost>(
    `${API_URL}/api/social-posts/${id}/like`,
    { method: 'PATCH' },
    token
  );
}

export function repostSocialPost(token: string, id: string) {
  return authorizedJsonRequest<SocialPost>(
    `${API_URL}/api/social-posts/${id}/repost`,
    { method: 'PATCH' },
    token
  );
}

export function commentSocialPost(token: string, id: string, message: string) {
  return authorizedJsonRequest<SocialPost>(
    `${API_URL}/api/social-posts/${id}/comments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    },
    token
  );
}

export function updateSocialPost(token: string, id: string, message: string) {
  return authorizedJsonRequest<SocialPost>(
    `${API_URL}/api/social-posts/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    },
    token
  );
}

export function deleteSocialPost(token: string, id: string) {
  return authorizedJsonRequest<void>(
    `${API_URL}/api/social-posts/${id}`,
    { method: 'DELETE' },
    token
  );
}
