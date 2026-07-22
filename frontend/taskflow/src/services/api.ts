import type { Task, TaskFormData, TaskFilters } from "../types/task";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message ?? "Something went wrong", response.status);
  }

  return data as T;
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const authApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

function buildTaskQuery(filters?: TaskFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.sort) params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const tasksApi = {
  getAll: (token: string, filters?: TaskFilters) =>
    request<Task[]>(`/api/tasks${buildTaskQuery(filters)}`, {
      headers: authHeaders(token),
    }),

  getById: (token: string, id: number) =>
    request<Task>(`/api/tasks/${id}`, {
      headers: authHeaders(token),
    }),

  create: (token: string, data: TaskFormData) =>
    request<{ message: string; taskId: number }>("/api/tasks/create", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    }),

  update: (token: string, id: number, data: TaskFormData) =>
    request<{ message: string }>(`/api/tasks/update/${id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    }),

  delete: (token: string, id: number) =>
    request<{ message: string }>(`/api/tasks/delete/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    }),
};
