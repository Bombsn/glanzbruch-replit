import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`🌐 Making ${method} request to ${url}`);
  console.log('📋 Request headers:', data ? { "Content-Type": "application/json" } : {});
  console.log('📦 Request body:', data ? JSON.stringify(data) : 'none');
  
  try {
    console.log('🔍 About to call fetch...');
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    
    console.log('📡 Fetch completed, response status:', res.status);
    console.log('📊 Response headers:', Object.fromEntries(res.headers.entries()));
    
    await throwIfResNotOk(res);
    console.log('✅ Response validation passed');
    return res;
  } catch (error) {
    console.error('🚨 Fetch error occurred:', error);
    console.error('🔍 Error type:', typeof error);
    console.error('🔍 Error constructor:', (error as any)?.constructor?.name);
    console.error('🔍 Is TypeError?', error instanceof TypeError);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
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
