export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || "/api";

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const method = (options.method || "GET").toUpperCase();
  const cacheBustPath =
    method === "GET"
      ? `${path}${path.includes("?") ? "&" : "?"}_=${Date.now()}`
      : path;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const { headers: _omit, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${cacheBustPath}`, {
    credentials: "include",
    cache: method === "GET" ? "no-store" : undefined,
    headers: requestHeaders,
    ...restOptions,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({} as { message?: string }));
    throw new Error(body.message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
