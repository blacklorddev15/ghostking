import { useAuth } from "./useAuth";
import { trpc } from "./main";
import { Button, Card } from "./components";
import { Link } from "wouter";
import { Loader2, Check, ChevronLeft, Server, Zap, Cpu, HardDrive, Database, Cloud } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function Products() {
  const { isAuthenticated, user } = useAuth();
  const { data: productsData, isLoading, error, refetch } = trpc.products.list.useQuery();
  const createOrderMutation = trpc.orders.create.useMutation();
  const [deployingId, setDeployingId] = useState<number | null>(null);

  console.log("Products page - Data:", productsData);
  console.log("Products page - Loading:", isLoading);
  console.log("Products page - Error:", error);

  // Handle error
  if (error) {
    return (
      <div className="min-h-screen text-white p-10" style={{ background: '#0a0a0f' }}>
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Plans</h2>
          <p className="text-gray-400">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              background: '#7c3aed',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: '#7c3aed' }} />
          <p className="mt-4 text-gray-400">Loading available plans...</p>
        </div>
      </div>
    );
  }

  const products = productsData?.products || [];

  // Handle panel deployment
  const handleDeploy = async (productId: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to deploy");
      window.location.href = "/dashboard";
      return;
    }

    setDeployingId(productId);
    
    try {
      const result = await createOrderMutation.mutateAsync({ 
        productId, 
        quantity: 1 
      });
      
      toast.success("Panel deployed successfully!");
      console.log("Deployment result:", result);
      
      // Refresh orders
      await refetch();
      
    } catch (error: any) {
      console.error("Deployment error:", error);
      toast.error(error.message || "Failed to deploy panel");
    } finally {
      setDeployingId(null);
    }
  };

  // Show empty state
  if (products.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
        <nav className="p-5 flex items-center gap-4" style={{ borderBottom: '1px solid #0d1120' }}>
          <Link href="/dashboard">
            <button style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold" style={{ color: '#f0f4ff' }}>Available Plans</h1>
        </nav>
        <div className="container mx-auto px-5 text-center py-20">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#f0f4ff' }}>No Plans Available</h2>
          <p className="text-gray-400">Run <code className="bg-white/10 px-2 py-1 rounded">npm run seed</code> to add products</p>
          <button 
            onClick={() => refetch()}
            style={{
              marginTop: '16px',
              background: '#7c3aed',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Show products with deploy functionality
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <nav className="p-5 flex items-center gap-4" style={{ borderBottom: '1px solid #0d1120' }}>
        <Link href="/dashboard">
          <button style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-xl font-bold" style={{ color: '#f0f4ff' }}>Available Plans</h1>
      </nav>

      <div className="container mx-auto px-5 py-8">
        <p className="text-sm mb-8" style={{ color: '#94a3b8' }}>1 SD = 5 KSH. All deployments are instant.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => {
            const features = JSON.parse(product.features || "[]");
            const isDeploying = deployingId === product.id;
            
            return (
              <div 
                key={product.id}
                className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(145deg, #0f1629, #0a0a0f)',
                  border: '1px solid #1e2d4a',
                }}
              >
                {/* Product Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {product.category === 'panel' ? (
                        <Server className="w-5 h-5" style={{ color: '#7c3aed' }} />
                      ) : product.category === 'bot' ? (
                        <Zap className="w-5 h-5" style={{ color: '#3b82f6' }} />
                      ) : (
                        <Cloud className="w-5 h-5" style={{ color: '#10b981' }} />
                      )}
                      <h3 className="text-lg font-bold" style={{ color: '#f0f4ff' }}>{product.name}</h3>
                    </div>
                    <p className="text-xs uppercase tracking-widest" style={{ color: '#475569' }}>{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: '#c084fc' }}>{parseFloat(product.price).toFixed(0)} SD</p>
                    <p className="text-[10px]" style={{ color: '#475569' }}>per month</p>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>{product.description}</p>
                )}

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {features.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#7c3aed' }} />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Resource Specs */}
                {(product.memory || product.disk || product.cpu) && (
                  <div className="flex flex-wrap gap-3 mb-6 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    {product.cpu && (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94a3b8' }}>
                        <Cpu className="w-3.5 h-3.5" style={{ color: '#3b82f6' }} />
                        <span>{product.cpu}% CPU</span>
                      </div>
                    )}
                    {product.memory && (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94a3b8' }}>
                        <HardDrive className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                        <span>{product.memory >= 1024 ? `${product.memory/1024}GB` : `${product.memory}MB`} RAM</span>
                      </div>
                    )}
                    {product.disk && (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94a3b8' }}>
                        <Database className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                        <span>{product.disk >= 1024 ? `${product.disk/1024}GB` : `${product.disk}MB`} Disk</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Deploy Button */}
                <button
                  onClick={() => handleDeploy(product.id)}
                  disabled={isDeploying}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  {isDeploying ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    '🚀 Deploy Panel'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}