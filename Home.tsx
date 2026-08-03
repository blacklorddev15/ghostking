import { useAuth } from "./useAuth";
import { Button, Card } from "./components";
import { Link } from "wouter";
import { Zap, Bot, Wallet, ChevronRight } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen text-white">
      <div className="relative z-10">
        {/* Mobile-First Navigation */}
        <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/">
              <a className="flex items-center gap-2 text-xl font-bold">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  BLACKLORD TECH
                </span>
              </a>
            </Link>
            
            <div className="flex gap-3 w-full sm:w-auto justify-center">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard"><a className="text-sm text-gray-300 px-3 py-2">Dashboard</a></Link>
                  <Link href="/wallet">
                    <Button className="bg-cyan-600 text-xs px-4 py-2">Wallet</Button>
                  </Link>
                </>
              ) : (
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-sm w-full sm:w-32">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section - Centered & Vertical */}
        <section className="container mx-auto px-5 py-16 text-center flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight max-w-4xl">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              THE FUTURE STARTS AT
            </span>
            <br />
            <span className="text-white">BLACKLORD TECH INC</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
            Instant Pterodactyl hosting, automation bots, and secure payments. Built for the next generation of gamers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
            <Link href={isAuthenticated ? "/dashboard" : "/login"}>
              <Button className="w-full sm:w-auto px-10 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 text-lg">
                Get Started <ChevronRight className="ml-2 w-5 h-5 inline" />
              </Button>
            </Link>
            <Link href="/products">
              <Button className="w-full sm:w-auto px-10 h-14 border border-cyan-500/50 text-cyan-400 text-lg">
                View Plans
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section - Vertical Stacking on Mobile */}
        <section className="container mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/40 border-white/10 p-6 rounded-2xl">
            <Zap className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Pterodactyl Panels</h3>
            <p className="text-gray-400 text-sm">Deploy high-performance game servers instantly with full console access.</p>
          </Card>
          
          <Card className="bg-black/40 border-white/10 p-6 rounded-2xl">
            <Bot className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Automation Bots</h3>
            <p className="text-gray-400 text-sm">24/7 WhatsApp & Telegram bots to automate your workflows and engagement.</p>
          </Card>
          
          <Card className="bg-black/40 border-white/10 p-6 rounded-2xl">
            <Wallet className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Smart Wallet</h3>
            <p className="text-gray-400 text-sm">Deposit KSH and pay in SD. Instant verification via Paystack & M-Pesa.</p>
          </Card>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-white/10 text-center text-gray-500 text-xs">
          <p>&copy; 2026 BLACKLORD TECH INC</p>
        </footer>
      </div>
    </div>
  );
}
