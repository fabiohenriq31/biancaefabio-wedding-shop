import { API_URL } from "./api";

type GoogleLoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: 'user' | 'admin';
  };
};

type AuthResponse = GoogleLoginResponse;

export async function loginWithGoogle(
  credential: string
): Promise<GoogleLoginResponse> {
  const response = await fetch(`${API_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ credential }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao autenticar com Google");
  }

  return data;
}

export async function loginWithPassword(
  email: string,
  password: string
): Promise<GoogleLoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao autenticar");
  }

  return data;
}

export async function registerWithPassword(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao criar conta");
  }

  return data;
}

export async function updateProfile(
  token: string,
  { name, avatar }: { name: string; avatar?: File | null }
): Promise<{ user: AuthResponse["user"] }> {
  const formData = new FormData();
  formData.append("name", name);

  if (avatar) {
    formData.append("avatar", avatar);
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao atualizar perfil");
  }

  return data;
}
