import { API_URL } from './api';
import { authorizedJsonRequest } from './authSession';

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

export function getSocialUsers(token: string) {
  return authorizedJsonRequest<SocialUser[]>(`${API_URL}/api/social/users`, {}, token);
}

export function getChatMessages(token: string) {
  return authorizedJsonRequest<ChatMessage[]>(`${API_URL}/api/social/chat/messages`, {}, token);
}

export function sendChatMessage(token: string, message: string) {
  return authorizedJsonRequest<ChatMessage>(
    `${API_URL}/api/social/chat/messages`,
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

export function getSocialNotifications(token: string) {
  return authorizedJsonRequest<SocialNotification[]>(`${API_URL}/api/social/notifications`, {}, token);
}
