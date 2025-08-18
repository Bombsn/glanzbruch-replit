import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { authUtils } from "./auth";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any
) {
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authUtils.getAuthHeaders(),
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    // If unauthorized and we have a token, it might be expired
    if (response.status === 401 && authUtils.isAuthenticated()) {
      authUtils.removeToken();
      // Redirect to login if we're on an admin page
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin') {
        window.location.href = '/admin';
      }
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }: { queryKey: readonly unknown[] }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
      headers: {
        ...authUtils.getAuthHeaders(),
      },
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
