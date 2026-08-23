import { getToken, clearAuth } from '../lib/tokenHelper';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

class APIClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE;
  }

  private getHeaders(hasBody = true) {
    const headers: Record<string, string> = {};
    if (hasBody) {
      headers['Content-Type'] = 'application/json';
    }
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    const res = await fetch(url, options);

    if (res.status === 401) {
      clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please log in again.');
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error (${res.status}): ${errorText}`);
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await res.json()) as T;
    }
    return (await res.text()) as T;
  }

  get<T = any>(path: string, options: { params?: Record<string, any> } = {}): Promise<T> {
    let query = '';
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const qStr = searchParams.toString();
      if (qStr) query = `?${qStr}`;
    }
    return this.request<T>(`${path}${query}`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });
  }

  post<T = any>(path: string, data?: any): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      headers: this.getHeaders(!!data),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T = any>(path: string, data?: any): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      headers: this.getHeaders(!!data),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T = any>(path: string): Promise<T> {
    return this.request<T>(path, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
  }
}

const api = new APIClient();
export default api;
