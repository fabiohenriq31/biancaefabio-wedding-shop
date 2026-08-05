export const AUTH_STORAGE_KEY = 'wedding_auth';
const AUTH_NOTICE_KEY = 'wedding_auth_notice';

let isHandlingUnauthorized = false;

export function getStoredAuthToken() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

export function buildRedirectPath() {
  if (typeof window === 'undefined') {
    return '/shopping';
  }

  const path = `${window.location.pathname}${window.location.search}${window.location.hash}`.trim();
  return path || '/shopping';
}

export function setAuthNotice(message: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(AUTH_NOTICE_KEY, message);
}

export function consumeAuthNotice() {
  if (typeof window === 'undefined') return '';

  const notice = sessionStorage.getItem(AUTH_NOTICE_KEY) || '';
  if (notice) {
    sessionStorage.removeItem(AUTH_NOTICE_KEY);
  }

  return notice;
}

export function handleUnauthorizedSession(customRedirect?: string) {
  if (typeof window === 'undefined' || isHandlingUnauthorized) {
    return;
  }

  isHandlingUnauthorized = true;

  const redirect = customRedirect || buildRedirectPath();
  const params = new URLSearchParams({
    redirect,
    session: 'expired',
  });

  localStorage.removeItem(AUTH_STORAGE_KEY);
  setAuthNotice('Sua sessao expirou. Entre novamente para continuar.');
  window.location.assign(`/shopping/login?${params.toString()}`);
}

export async function parseJsonResponse(response: Response) {
  return response.json().catch(() => null);
}

export async function authorizedJsonRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 401) {
    handleUnauthorizedSession();
    throw new Error('Sua sessao expirou. Entre novamente para continuar.');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || 'Erro na requisicao.');
  }

  return data as T;
}
