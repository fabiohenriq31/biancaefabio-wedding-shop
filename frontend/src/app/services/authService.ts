import { API_URL } from "./api";

type GoogleLoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
};

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