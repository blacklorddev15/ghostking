import { useAuth } from "./useAuth";
import { Button } from "./components";
import { Card } from "./components";
import { Link } from "wouter";
import { Zap, Bot, Wallet } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background with fire/coal image */}
      <div 
        className="fixed inset-0 z-0 opacity-60"
        style={{
          backgroundImage: "url('./background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 z-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-cyan-500/30 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/">
              <a className="flex items-center gap-2 text-2xl font-bold">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  BLACKLORD TECH
                </span>
              </a>
            </Link>
            <div className="flex gap-4 items-center">
              <Link href="/products">
                <a className="hover:text-cyan-400 transition">Products</a>
              </Link>
              <Link href="/about">
                <a className="hover:text-cyan-400 transition">About</a>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <a className="hover:text-cyan-400 transition">Dashboard</a>
                  </Link>
                  <Link href="/wallet">
                    <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                      Wallet
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              THE FUTURE STARTS AT
            </span>
            <br />
            <span className="text-white drop-shadow-lg">BLACKLORD TECH INC</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Deploy Pterodactyl hosting panels, manage automation bots, and scale your business with our cyberpunk-powered platform. Instant deployment. Secure payments. 24/7 support.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg px-8">
                🚀 Get Started
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 text-lg px-8">
                📦 View Products
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-black/50 border-cyan-500/30 hover:border-cyan-500/60 transition backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-cyan-400" />
                <h3 className="text-xl font-bold">Pterodactyl Panels</h3>
              </div>
              <p className="text-gray-400">
                Deploy game servers instantly with full panel access. High performance, low latency, 99.9% uptime.
              </p>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-8 h-8 text-purple-400" />
                <h3 className="text-xl font-bold">Automation Bots</h3>
              </div>
              <p className="text-gray-400">
                WhatsApp & Telegram bots for 24/7 automation. Engage your audience and automate workflows.
              </p>
            </Card>

            <Card className="bg-black/50 border-cyan-500/30 hover:border-cyan-500/60 transition backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-8 h-8 text-cyan-400" />
                <h3 className="text-xl font-bold">Wallet System</h3>
              </div>
              <p className="text-gray-400">
                Top up via Paystack, M-Pesa, or Pesapal. Instant deployment after payment verification.
              </p>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-20 border-t border-cyan-500/30">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">500+</div>
              <p className="text-gray-400">Active Servers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
              <p className="text-gray-400">Uptime</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">24/7</div>
              <p className="text-gray-400">Support</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">1,000+</div>
              <p className="text-gray-400">Happy Clients</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center border-t border-cyan-500/30">
          <h2 className="text-4xl font-bold mb-6">Ready to Level Up?</h2>
          <p className="text-xl text-gray-400 mb-8">Join thousands of developers and businesses using BLACKLORD TECH</p>
          <Link href={isAuthenticated ? "/dashboard" : "/login"}>
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg px-8">
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            </Button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-cyan-500/30 bg-black/80 py-8 mt-20">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>&copy; 2026 BLACKLORD TECH INC. All rights reserved.</p>
            <div className="mt-4 flex gap-6 justify-center">
              <a href="#" className="hover:text-cyan-400 transition">Privacy</a>
              <a href="#" className="hover:text-cyan-400 transition">Terms</a>
              <a href="#" className="hover:text-cyan-400 transition">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
