import type { AuthUser } from '../types/auth';

const TOKEN_KEY = 'smart_exam_token';
const USER_KEY = 'smart_exam_user';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);

export const getUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setUser = (user: AuthUser): void => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeUser = (): void => localStorage.removeItem(USER_KEY);

export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

export const isAuthenticated = (): boolean => !!getToken();
