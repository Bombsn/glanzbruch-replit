const ADMIN_TOKEN_KEY = 'adminToken';

export const authUtils = {
  // Get stored admin token
  getToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  // Store admin token
  setToken(token: string): void {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  },

  // Remove admin token
  removeToken(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Get authorization headers for API requests
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      const token = this.getToken();
      if (token) {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Even if server call fails, remove local token
      console.error("Logout error:", error);
    } finally {
      // Always remove token locally
      this.removeToken();
      // Redirect to login
      window.location.href = '/admin';
    }
  }
};
