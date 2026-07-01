import { API_URL } from './api';

export type SocialUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role?: 'user' | 'admin';
  createdAt?: string;
};

export type ChatMessage = {
  _id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string | null;
  message: string;
  createdAt: string;
};

export type SocialNotification = {
  id: string;
  type: 'post' | 'chat' | 'user';
  title: string;
  message: string;
  createdAt: string;
};

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function getSocialUsers(token: string) {
  const response = await fetch(`${API_URL}/api/social/users`, {
    headers: authHeaders(token),
  });

  if (!response.ok) throw new Error('Nao foi possivel carregar convidados.');
  return response.json() as Promise<SocialUser[]>;
}

export async function getChatMessages(token: string) {
  const response = await fetch(`${API_URL}/api/social/chat/messages`, {
    headers: authHeaders(token),
  });

  if (!response.ok) throw new Error('Nao foi possivel carregar o bate-papo.');
  return response.json() as Promise<ChatMessage[]>;
}

export async function sendChatMessage(token: string, message: string) {
  const response = await fetch(`${API_URL}/api/social/chat/messages`, {
    method: 'POST',
    headers: {
      ...authHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || 'Nao foi possivel enviar mensagem.');
  return data as ChatMessage;
}

export async function getSocialNotifications(token: string) {
  const response = await fetch(`${API_URL}/api/social/notifications`, {
    headers: authHeaders(token),
  });

  if (!response.ok) throw new Error('Nao foi possivel carregar notificacoes.');
  return response.json() as Promise<SocialNotification[]>;
}
