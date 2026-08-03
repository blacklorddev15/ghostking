import React, { useState } from "react";
import { useAuth } from "./useAuth";
import { Button, Card, Input } from "./components";
import { Loader2, User } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { 
      toast.error("Please enter a username"); 
      return; 
    }
    
    setIsLoggingIn(true);
    console.log("Attempting login with:", username);
    
    try {
      const success = await login(username.trim());
      console.log("Login success:", success);
      if (success) {
        toast.success("Welcome back!");
        // Force navigation
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Failed to login");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          GHOSTKING
        </h1>
        <p className="text-gray-500 text-sm mt-2">Premium Cyberpunk Hosting</p>
      </div>

      <Card 
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '32px',
          borderRadius: '24px'
        }}
      >
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Username</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#6b7280' }} />
              <Input
                value={username}
                onChange={(e: any) => setUsername(e.target.value)}
                placeholder="Enter handle"
                style={{ paddingLeft: '48px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            style={{
              width: '100%',
              height: '56px',
              background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
              borderRadius: '16px',
              border: 'none',
              cursor: isLoggingIn ? 'not-allowed' : 'pointer',
              opacity: isLoggingIn ? 0.5 : 1,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!isLoggingIn) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(6, 182, 212, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Enter Dashboard"}
          </button>
        </form>
      </Card>
      
      <p className="text-center text-[10px] text-gray-600 mt-10 uppercase tracking-widest">
        Powered by Blacklord Tech Inc
      </p>
    </div>
  );
}