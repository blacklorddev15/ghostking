import { useAuth } from "./useAuth";
import { trpc } from "./main";
import { Button } from "./components";
import { Card } from "./components";
import { Link } from "wouter";
import { Loader2, Wallet, Package, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: balanceData, isLoading: balanceLoading } = trpc.wallet.getBalance.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: ordersData, isLoading: ordersLoading } = trpc.orders.list.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  const balance = balanceData?.balance || "0.00";
  const orders = ordersData?.orders || [];
  const activeOrders = orders.filter(o => o.status === "active");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-cyan-500/30 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              BLACKLORD TECH
            </a>
          </Link>
          <div className="flex gap-4">
            <Link href="/wallet">
              <Button size="sm" variant="outline" className="border-cyan-500 text-cyan-400">
                <Wallet className="w-4 h-4 mr-2" />
                Wallet
              </Button>
            </Link>
            <Link href="/products">
              <Button size="sm" variant="outline" className="border-cyan-500 text-cyan-400">
                Products
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-400">Manage your services, wallet, and deployments from here.</p>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Wallet Balance */}
          <Card className="bg-black/50 border-cyan-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Wallet Balance</h3>
              <Wallet className="w-6 h-6 text-cyan-400" />
            </div>
            {balanceLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            ) : (
              <>
                <div className="text-4xl font-bold text-cyan-400 mb-2">
                  {parseFloat(balance).toLocaleString("en-KE", { minimumFractionDigits: 2 })} SD
                </div>
                <Link href="/wallet">
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 w-full mt-4">
                    Top Up Balance
                  </Button>
                </Link>
              </>
            )}
          </Card>

          {/* Active Services */}
          <Card className="bg-black/50 border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Services</h3>
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            {ordersLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            ) : (
              <>
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {activeOrders.length}
                </div>
                <p className="text-gray-400 text-sm">Running services</p>
              </>
            )}
          </Card>

          {/* Total Spent */}
          <Card className="bg-black/50 border-cyan-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Spent</h3>
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            {ordersLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            ) : (
              <>
                <div className="text-4xl font-bold text-cyan-400 mb-2">
                  {orders.reduce((sum, o) => sum + parseFloat(o.totalPrice as any), 0).toLocaleString("en-KE", { minimumFractionDigits: 2 })} SD
                </div>
                <p className="text-gray-400 text-sm">Lifetime purchases</p>
              </>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/products">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 h-12">
                🚀 Deploy New Service
              </Button>
            </Link>
            <Link href="/wallet">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 h-12">
                💳 Deposit Funds
              </Button>
            </Link>
          </div>
        </div>

        {/* Active Services List */}
        {activeOrders.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Active Services</h2>
            <div className="space-y-4">
              {activeOrders.map(order => (
                <Card key={order.id} className="bg-black/50 border-cyan-500/30 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">Service #{order.id}</h3>
                      <p className="text-gray-400 text-sm">Product ID: {order.productId}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">
                        {parseFloat(order.totalPrice as any).toLocaleString("en-KE", { minimumFractionDigits: 2 })} SD
                      </div>
                      <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm mt-2">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeOrders.length === 0 && (
          <Card className="bg-black/50 border-cyan-500/30 p-8 text-center">
            <p className="text-gray-400 mb-4">No active services yet</p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600">
                Browse Products
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
