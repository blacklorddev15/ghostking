import { useAuth } from "./useAuth";
import { trpc } from "./main";
import { Button, Card } from "./components";
import { Link } from "wouter";
import { Loader2, Wallet, Package, TrendingUp, Plus } from "lucide-react";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: balanceData, isLoading: balanceLoading } = trpc.wallet.getBalance.useQuery(undefined, { enabled: !!user });
  const { data: ordersData, isLoading: ordersLoading } = trpc.orders.list.useQuery(undefined, { enabled: !!user });

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

  const balance = balanceData?.balance || "0.00";
  const orders = ordersData?.orders || [];
  const activeOrders = orders.filter(o => o.status === "active");

  return (
    <div className="min-h-screen text-white pb-20">
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50 px-5 py-4 flex justify-between items-center">
        <Link href="/"><a className="font-bold text-cyan-400">BLACKLORD</a></Link>
        <Link href="/wallet"><Button className="bg-white/10 text-xs px-3 py-1.5 border border-white/10"><Wallet className="w-3 h-3 mr-1 inline" /> {parseFloat(balance).toFixed(0)} SD</Button></Link>
      </nav>

      <div className="container mx-auto px-5 py-8 flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold">Hello, {user?.name}</h1>
          <p className="text-gray-400 text-sm">Your services are running smoothly.</p>
        </header>

        {/* Vertical Stats on Mobile */}
        <div className="flex flex-col gap-4">
          <Card className="bg-gradient-to-br from-cyan-600/20 to-black/40 border-cyan-500/30 p-5">
            <p className="text-xs text-cyan-400 font-medium mb-1 uppercase tracking-wider">Wallet Balance</p>
            <h2 className="text-3xl font-bold">{parseFloat(balance).toLocaleString()} SD</h2>
            <Link href="/wallet"><Button className="w-full mt-4 bg-cyan-600 text-sm h-10">Add Funds</Button></Link>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-black/40 border-white/10 p-4">
              <Package className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-[10px] text-gray-500 uppercase">Services</p>
              <p className="text-xl font-bold">{activeOrders.length}</p>
            </Card>
            <Card className="bg-black/40 border-white/10 p-4">
              <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
              <p className="text-[10px] text-gray-500 uppercase">Spent</p>
              <p className="text-xl font-bold">{orders.reduce((s, o) => s + parseFloat(o.totalPrice as any), 0).toFixed(0)}</p>
            </Card>
          </div>
        </div>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Services</h2>
            <Link href="/products"><Button className="bg-white/10 text-xs py-1 px-3"><Plus className="w-3 h-3 mr-1 inline" /> New</Button></Link>
          </div>

          {ordersLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
            <div className="flex flex-col gap-3">
              {activeOrders.length > 0 ? activeOrders.map(order => (
                <Card key={order.id} className="bg-black/60 border-white/10 p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">Panel #{order.id}</p>
                    <p className="text-[10px] text-gray-500">{order.serviceId?.slice(0, 8) || 'Provisioning...'}</p>
                  </div>
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded uppercase font-bold">Active</span>
                </Card>
              )) : (
                <div className="text-center py-10 text-gray-500 text-sm border-2 border-dashed border-white/5 rounded-2xl">
                  No active services yet.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
