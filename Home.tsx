import { useAuth } from "./useAuth";
import { Button, Card } from "./components";
import { Link } from "wouter";
import { Zap, Bot, Wallet, ChevronRight, Check } from "lucide-react";
import { trpc } from "./main";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: productsData } = trpc.products.list.useQuery();

  const products = productsData?.products || [];

  return (
    <div className="min-h-screen text-white">
      <div className="relative z-10">
        {/* Navigation */}
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
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-sm">Dashboard</Button>
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
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
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto px-10 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 text-lg">
                Get Started <ChevronRight className="ml-2 w-5 h-5 inline" />
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="w-full sm:w-auto px-10 h-14 text-lg">
                View Plans
              </Button>
            </Link>
          </div>
        </section>

        {/* Products Section on Home */}
        <section className="container mx-auto px-5 py-10">
          <h2 className="text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Popular Plans
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product: any) => (
              <Card key={product.id} className="bg-black/60 border-white/10 p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">{product.category}</p>
                </div>
                <p className="text-3xl font-bold text-cyan-400">{parseFloat(product.price).toFixed(0)} SD</p>
                <div className="space-y-2">
                  {JSON.parse(product.features || "[]").slice(0, 3).map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-cyan-500" /> {f}
                    </div>
                  ))}
                </div>
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600">
                    Get Started
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
          
          {products.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              <p>Loading plans...</p>
            </div>
          )}
        </section>

        {/* Features Section */}
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