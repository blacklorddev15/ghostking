import { trpc } from "./main";

export function useAuth() {
  const { data: user, isLoading, refetch } = trpc.auth.me.useQuery();
  
  const logout = () => {
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/";
  };

  return {
    user,
    isAuthenticated: !!user,
    loading: isLoading,
    logout,
    refetch,
  };
}