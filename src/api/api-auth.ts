import api from './API';
import type { LoginPayload, LoginResponse } from '../types/auth';

export const apiLogin = (data: LoginPayload) => api.post<LoginResponse>('/auth/login', data);
export const apiForgotPassword = (email: string) => api.post('/auth/forgot-password', { email });
export const apiResetPassword = (token: string, password: string) => api.post('/auth/reset-password', { token, password });
export const apiLogout = () => api.post('/auth/logout', {});
