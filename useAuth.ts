import { trpc } from "./main";

export function useAuth() {
  const { data: user, isLoading, refetch } = trpc.auth.me.useQuery();
  
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("Login called with:", username);
      
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
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

  const register = async (name: string, username: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log("Register called with:", { name, username, email });
      
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });
      
      console.log("Register response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Register response data:", data);
        
        // Wait a moment for cookie to be set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Refetch user data
        await refetch();
        return true;
      } else {
        console.error("Register failed with status:", res.status);
        return false;
      }
    } catch (error) {
      console.error("Register error:", error);
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
    register,
    logout,
  };
}