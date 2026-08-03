import { useAuth } from "./useAuth";
import { trpc } from "./main";
import { Link } from "wouter";
import { 
  Loader2, 
  Wallet, 
  Package, 
  TrendingUp, 
  Plus, 
  LogOut,
  Users,
  Bot,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  PlayCircle,
  BookOpen,
  Rocket,
  Coins,
  ShoppingBag,
  BarChart3,
  UserPlus
} from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const { data: balanceData, isLoading: balanceLoading } = trpc.wallet.getBalance.useQuery(undefined, { enabled: !!user });
  const { data: ordersData, isLoading: ordersLoading } = trpc.orders.list.useQuery(undefined, { enabled: !!user });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#7c3aed' }} />
      </div>
    );
  }

  const balance = parseFloat(balanceData?.balance || "0");
  const orders = ordersData?.orders || [];
  const activeOrders = orders.filter((o: any) => o.status === "active");
  
  // Mock stats for display
  const totalBots = activeOrders.length;
  const activeBots = activeOrders.filter((o: any) => o.status === "active").length;
  const smmOrders = Math.floor(Math.random() * 50) + 10;
  const referrals = Math.floor(Math.random() * 20) + 1;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  // Quick Action Buttons
  const quickActions = [
    { icon: Bot, label: 'Deploy Bot', href: '/products', color: '#7c3aed' },
    { icon: Wallet, label: 'Top Up', href: '/wallet', color: '#3b82f6' },
    { icon: Users, label: 'Referral', href: '/referral', color: '#10b981' },
    { icon: Package, label: 'Get Panel', href: '/products', color: '#f59e0b' },
  ];

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#f0f4ff' }}>
      
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-6" style={{ borderBottom: '1px solid #0d1120' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: '#f0f4ff' }}>
              Welcome back, {user?.name || user?.openId || 'Guest'}
            </h1>
            <p className="text-sm" style={{ color: '#64748b' }}>
              Your dashboard is ready. Enter code to unlock it!
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div 
              className="flex-1 sm:flex-none flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: '#0f1629', border: '1px solid #1e2d4a' }}
            >
              <input 
                type="text"
                placeholder="Enter voucher code..."
                className="bg-transparent outline-none text-sm w-full sm:w-40"
                style={{ color: '#94a3b8' }}
              />
              <button 
                className="text-xs font-bold px-3 py-1 rounded-lg"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: 'white' }}
              >
                Redeem
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl transition-colors"
              style={{ background: '#0f1629', border: '1px solid #1e2d4a', color: '#64748b' }}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 sm:gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: 'white' }}
          >
            <Bot className="w-4 h-4" /> Deploy Bots
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ background: '#0f1629', border: '1px solid #1e2d4a', color: '#94a3b8' }}
          >
            <PlayCircle className="w-4 h-4" /> Watch Tutorials
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ background: '#0f1629', border: '1px solid #1e2d4a', color: '#94a3b8' }}
          >
            <Rocket className="w-4 h-4" /> SMM Boost
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Bots */}
          <div 
            className="rounded-xl p-4"
            style={{ background: '#0f1629', border: '1px solid #1e2d4a' }}
          >
            <div className="flex items-center justify-between mb-2">
              <Bot className="w-5 h-5" style={{ color: '#7c3aed' }} />
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>
                ↑ 12%
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#f0f4ff' }}>{totalBots}</p>
            <p className="text-xs" style={{ color: '#475569' }}>TOTAL BOTS</p>
          </div>

          {/* Active Bots */}
          <div 
            className="rounded-xl p-4"
            style={{ background: '#0f1629', border: '1px solid #1e2d4a' }}
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5" style={{ color: '#3b82f6' }} />
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>
                ↑ 8
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#f0f4ff' }}>{activeBots}</p>
            <p className="text-xs" style={{ color: '#475569' }}>ACTIVE BOTS</p>
          </div>

          {/* SMM Orders */}
          <div 
            className="rounded-xl p-4"
            style={{ background: '#0f1629', border: '1px solid #1e2d4a' }}
          >
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-5 h-5" style={{ color: '#f59e0b' }} />
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>
                ↑ 23%
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#f0f4ff' }}>{smmOrders}</p>
            <p className="text-xs" style={{ color: '#475569' }}>SMM ORDERS</p>
          </div>

          {/* Referrals */}
          <div 
            className="rounded-xl p-4"
            style={{ background: '#0f1629', border: '1px solid #1e2d4a' }}
          >
            <div className="flex items-center justify-between mb-2">
              <UserPlus className="w-5 h-5" style={{ color: '#10b981' }} />
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>
                ↑ 5
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#f0f4ff' }}>{referrals}</p>
            <p className="text-xs" style={{ color: '#475569' }}>REFERRALS</p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div 
            className="rounded-2xl p-5 sm:p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.1))',
              border: '1px solid rgba(124,58,237,0.2)'
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Wallet className="w-6 h-6" style={{ color: '#c084fc' }} />
                  <p className="text-sm" style={{ color: '#94a3b8' }}>TOTAL BALANCE</p>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-bold" style={{ color: '#f0f4ff' }}>
                    {balance.toFixed(0)}
                  </span>
                  <span className="text-xl font-bold" style={{ color: '#c084fc' }}>XD</span>
                </div>
                <p className="text-sm mt-1" style={{ color: '#64748b' }}>
                  {balance * 5} KSH
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
                  ↓ 16.0% this week
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Link href="/wallet">
                <button 
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: 'white' }}
                >
                  <Coins className="w-4 h-4" /> App
                </button>
              </Link>
              <button 
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 flex items-center gap-2"
                style={{ background: '#0f1629', border: '1px solid #1e2d4a', color: '#94a3b8' }}
              >
                <TrendingUp className="w-4 h-4" /> Sell XD
              </button>
              <Link href="/wallet">
                <button 
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 flex items-center gap-2"
                  style={{ background: '#0f1629', border: '1px solid #1e2d4a', color: '#94a3b8' }}
                >
                  <ArrowUpRight className="w-4 h-4" /> Top Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-medium mb-3" style={{ color: '#94a3b8' }}>QUICK ACCESS</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div 
                  className="rounded-xl p-4 text-center transition-all hover:scale-105 cursor-pointer"
                  style={{ background: '#0f1629', border: '1px solid #1e2d4a' }}
                >
                  <action.icon className="w-6 h-6 mx-auto mb-2" style={{ color: action.color }} />
                  <p className="text-xs font-medium" style={{ color: '#f0f4ff' }}>{action.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 sm:px-6 py-4 mt-4">
        <div className="max-w-7xl mx-auto">
          <div 
            className="rounded-2xl p-4 flex justify-around"
            style={{ background: '#0f1629', border: '1px solid #1e2d4a' }}
          >
            {[
              { icon: Bot, label: 'Mu Canjar', href: '/products' },
              { icon: Award, label: 'Farn Mannar', href: '/referral' },
              { icon: BarChart3, label: 'Admin Danal', href: '/admin' },
              { icon: Users, label: 'Cunnart', href: '/community' },
            ].map((item, index) => (
              <Link key={index} href={item.href}>
                <div className="flex flex-col items-center gap-1 cursor-pointer transition-all hover:scale-105">
                  <item.icon className="w-5 h-5" style={{ color: '#64748b' }} />
                  <span className="text-[10px]" style={{ color: '#475569' }}>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}