import { API_URL } from './api';
import { authorizedJsonRequest } from './authSession';

export async function adminRequest<T>(
  token: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  return authorizedJsonRequest<T>(`${API_URL}${path}`, options, token);
}
