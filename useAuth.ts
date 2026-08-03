import { trpc } from "./main";

export function useAuth() {
  const { data: user, isLoading, refetch } = trpc.auth.me.useQuery();
  
  const login = async (username: string): Promise<boolean> => {
    try {
      console.log("Login called with:", username);
      
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      
      console.log("Login response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Login response data:", data);
        
        // Wait a moment for cookie to be set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Refetch user data
        await refetch();
        return true;
      } else {
        console.error("Login failed with status:", res.status);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
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