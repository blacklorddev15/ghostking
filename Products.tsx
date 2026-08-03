import { useAuth } from "./useAuth";
import { trpc } from "./main";
import { Button, Card } from "./components";
import { Link } from "wouter";
import { Loader2, Check, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export default function Products() {
  const { isAuthenticated } = useAuth();
  const { data: productsData, isLoading, error, refetch } = trpc.products.list.useQuery();

  console.log("Products page - Data:", productsData);
  console.log("Products page - Loading:", isLoading);
  console.log("Products page - Error:", error);

  // Handle error
  if (error) {
    return (
      <div className="min-h-screen text-white p-10">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Plans</h2>
          <p className="text-gray-400">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              background: '#06b6d4',
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
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
          <p className="mt-4 text-gray-400">Loading available plans...</p>
        </div>
      </div>
    );
  }

  const products = productsData?.products || [];

  // Show empty state with seed button
  if (products.length === 0) {
    return (
      <div className="min-h-screen text-white pb-10">
        <nav className="p-5 flex items-center gap-4">
          <Link href="/dashboard">
            <button style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold">Available Plans</h1>
        </nav>
        <div className="container mx-auto px-5 text-center py-20">
          <h2 className="text-2xl font-bold mb-4">No Plans Available</h2>
          <p className="text-gray-400">Run <code className="bg-white/10 px-2 py-1 rounded">npm run seed</code> to add products</p>
          <button 
            onClick={() => refetch()}
            style={{
              marginTop: '16px',
              background: '#06b6d4',
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

  // Show products
  return (
    <div className="min-h-screen text-white pb-10">
      <nav className="p-5 flex items-center gap-4">
        <Link href="/dashboard">
          <button style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-xl font-bold">Available Plans</h1>
      </nav>

      <div className="container mx-auto px-5">
        <p className="text-gray-400 text-sm mb-8">1 SD = 5 KSH. All deployments are instant.</p>

        <div className="flex flex-col gap-6">
          {products.map((product: any) => (
            <Card 
              key={product.id} 
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '24px',
                borderRadius: '16px'
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-400">{parseFloat(product.price).toFixed(0)} SD</p>
                  <p className="text-[10px] text-gray-500">per month</p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                {JSON.parse(product.features || "[]").map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-cyan-500" /> {f}
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error("Please login to purchase");
                    window.location.href = "/login";
                    return;
                  }
                  toast.info("Purchase feature coming soon!");
                }}
                style={{
                  width: '100%',
                  height: '48px',
                  marginTop: '16px',
                  background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Deploy Now
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}