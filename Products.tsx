import { useAuth } from "./useAuth";
import { trpc } from "./main";
import { Button, Card } from "./components";
import { Link } from "wouter";
import { Loader2, Check, Zap, Bot, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export default function Products() {
  const { isAuthenticated } = useAuth();
  const { data: productsData, isLoading } = trpc.products.list.useQuery();
  const createOrderMutation = trpc.orders.create.useMutation();

  const handlePurchase = async (productId: number) => {
    if (!isAuthenticated) { toast.error("Please login to purchase"); return; }
    try {
      await createOrderMutation.mutateAsync({ productId, quantity: 1 });
      toast.success("Service activated! Check your dashboard.");
    } catch (error: any) {
      toast.error(error.message || "Failed to purchase service");
    }
  };

  const products = productsData?.products || [];

  return (
    <div className="min-h-screen text-white pb-10">
      <nav className="p-5 flex items-center gap-4">
        <Link href="/dashboard"><a className="p-2 bg-white/5 rounded-lg"><ChevronLeft className="w-5 h-5" /></a></Link>
        <h1 className="text-xl font-bold">Available Plans</h1>
      </nav>

      <div className="container mx-auto px-5">
        <p className="text-gray-400 text-sm mb-8">1 SD = 5 KSH. All deployments are instant.</p>

        {isLoading ? <Loader2 className="w-8 h-8 animate-spin mx-auto mt-10" /> : (
          <div className="flex flex-col gap-6">
            {products.map(product => (
              <Card key={product.id} className="bg-black/60 border-white/10 p-6 flex flex-col gap-4 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">{parseFloat(product.price as any).toFixed(0)} SD</p>
                    <p className="text-[10px] text-gray-500">per month</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {JSON.parse(product.features || "[]").map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-cyan-500" /> {f}
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handlePurchase(product.id)}
                  disabled={createOrderMutation.isPending}
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 mt-2"
                >
                  {createOrderMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deploy Now"}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
