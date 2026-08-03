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
    if (!username.trim()) { toast.error("Please enter a username"); return; }
    setIsLoggingIn(true);
    try {
      await login(username.trim());
      toast.success("Welcome back!");
    } catch (err) {
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

      <Card className="bg-black/60 border-white/10 p-8 rounded-3xl backdrop-blur-xl">
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                value={username}
                onChange={(e: any) => setUsername(e.target.value)}
                placeholder="Enter handle"
                className="pl-12"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoggingIn}
            className="h-14 bg-gradient-to-r from-cyan-500 to-purple-600 text-lg font-bold rounded-2xl"
          >
            {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Enter Dashboard"}
          </Button>
        </form>
      </Card>
      
      <p className="text-center text-[10px] text-gray-600 mt-10 uppercase tracking-widest">
        Powered by Blacklord Tech Inc
      </p>
    </div>
  );
}
