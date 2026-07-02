import { API_URL } from './api';
import type { SocialPost } from '../types';

export async function getSocialPosts(token: string) {
  const response = await fetch(`${API_URL}/api/social-posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar o B&F Social.');
  }

  return response.json() as Promise<SocialPost[]>;
}

export async function createSocialPost({
  token,
  message,
  image,
}: {
  token: string;
  message: string;
  image?: File | null;
}) {
  const formData = new FormData();
  formData.append('message', message);

  if (image) {
    formData.append('image', image);
  }

  const response = await fetch(`${API_URL}/api/social-posts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Nao foi possivel publicar.');
  }

  return data as { message: string; post: SocialPost };
}

export async function likeSocialPost(token: string, id: string) {
  const response = await fetch(`${API_URL}/api/social-posts/${id}/like`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Nao foi possivel curtir.');
  }

  return data as SocialPost;
}

export async function repostSocialPost(token: string, id: string) {
  const response = await fetch(`${API_URL}/api/social-posts/${id}/repost`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Nao foi possivel repostar.');
  }

  return data as SocialPost;
}

export async function commentSocialPost(token: string, id: string, message: string) {
  const response = await fetch(`${API_URL}/api/social-posts/${id}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Nao foi possivel comentar.');
  }

  return data as SocialPost;
}

export async function updateSocialPost(token: string, id: string, message: string) {
  const response = await fetch(`${API_URL}/api/social-posts/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Nao foi possivel editar o post.');
  }

  return data as SocialPost;
}

export async function deleteSocialPost(token: string, id: string) {
  const response = await fetch(`${API_URL}/api/social-posts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || 'Nao foi possivel excluir o post.');
  }
}
