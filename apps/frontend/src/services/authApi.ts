import type { AuthUser } from '@/stores/authStore';

import { sendDataStrict } from './apiClient';

export interface AuthPayload {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (email: string, password: string) =>
    sendDataStrict<{ email: string; password: string }, AuthPayload>('/auth/login', {
      email,
      password,
    }),
  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    sendDataStrict<typeof data, AuthPayload>('/auth/register', data),
};
