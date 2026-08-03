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
    try {
      await login(username.trim());
      toast.success("Logged in successfully!");
    } catch (err) {
      toast.error("Failed to login");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/80 backdrop-blur-sm border-cyan-500/30 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
            GHOSTKING
          </h1>
          <p className="text-gray-400 text-sm">Enter your username to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                value={username}
                onChange={(e: any) => setUsername(e.target.value)}
                placeholder="Your name or handle"
                className="pl-10 h-12 bg-black/50 border-cyan-500/30"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoggingIn}
            className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Entering...
              </>
            ) : (
              "Enter Dashboard"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          No password required. Your username is your identity.
        </div>
      </Card>
    </div>
  );
}
