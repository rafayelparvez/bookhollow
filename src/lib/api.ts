import { authClient } from "./auth-client";

// NEXT_PUBLIC_API_URL is optional; default matches the Express server.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { data } = await authClient.token();
  if (!data?.token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${data.token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.message || err.error || `Request failed (${res.status})`,
    );
  }

  return (res.status === 204 ? null : await res.json()) as T;
}