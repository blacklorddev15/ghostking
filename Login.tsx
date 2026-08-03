import React, { useState } from "react";
import { Link } from "wouter";
import { Card, Input } from "./components";
import { Loader2, User, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error("Username and password required");
      return;
    }
    
    setIsLoading(true);
    console.log("Login attempt with:", { username });
    
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      console.log("Login response:", data);
      
      if (res.ok) {
        toast.success("Welcome back!");
        window.location.href = "/dashboard";
      } else {
        toast.error(data.error || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          GHOSTKING
        </h1>
        <p className="text-gray-500 text-sm mt-2">Welcome back!</p>
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
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Username or Email</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#6b7280' }} />
              <Input
                value={username}
                onChange={(e: any) => setUsername(e.target.value)}
                placeholder="Enter username or email"
                style={{ paddingLeft: '48px' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#6b7280' }} />
              <Input
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ paddingLeft: '48px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '56px',
              marginTop: '8px',
              background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
              borderRadius: '16px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Enter Dashboard"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link href="/register"><a className="text-cyan-400 hover:text-cyan-300">Register</a></Link>
        </p>
      </Card>
      
      <p className="text-center text-[10px] text-gray-600 mt-10 uppercase tracking-widest">
        Powered by Blacklord Tech Inc
      </p>
    </div>
  );
}