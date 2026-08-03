import { trpc } from "./main";

export function useAuth() {
  const { data: user, isLoading, refetch } = trpc.auth.me.useQuery();
  
  const login = async (username: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    if (res.ok) {
      await refetch();
      window.location.href = "/dashboard";
    }
  };

  const logout = () => {
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/";
  };

  return {
    user,
    isAuthenticated: !!user,
    loading: isLoading,
    login,
    logout,
  };
}
