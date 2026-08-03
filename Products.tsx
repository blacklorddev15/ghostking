import { useAuth } from "./useAuth";
import { trpc } from "./main";
import { Button } from "./components";
import { Card } from "./components";
import { Link } from "wouter";
import { Loader2, Check, Zap, Bot } from "lucide-react";
import { toast } from "sonner";

export default function Products() {
  const { user, isAuthenticated } = useAuth();
  const { data: productsData, isLoading } = trpc.products.list.useQuery();
  const createOrderMutation = trpc.orders.create.useMutation();

  const handlePurchase = async (productId: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase");
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        productId,
        quantity: 1,
      });
      toast.success("Service activated! Check your dashboard.");
    } catch (error: any) {
      toast.error(error.message || "Failed to purchase service");
    }
  };

  const products = productsData?.products || [];
  const panels = products.filter(p => p.category === "panel");
  const bots = products.filter(p => p.category === "bot");

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
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <a className="hover:text-cyan-400 transition">Dashboard</a>
                  </Link>
                  <Link href="/wallet">
                    <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-600">
                      Wallet
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="border-cyan-500 text-cyan-400">
                      Login
                    </Button>
                  </Link>
                </>
              )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Our Products</h1>
        <p className="text-gray-400 mb-12">Choose the perfect plan for your needs. All prices in SD (1 SD = 5 KSH).</p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : (
          <>
            {/* Pterodactyl Panels */}
            {panels.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <Zap className="w-8 h-8 text-cyan-400" />
                  <h2 className="text-3xl font-bold">Pterodactyl Hosting Panels</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {panels.map(product => (
                    <Card
                      key={product.id}
                      className="bg-black/50 border-cyan-500/30 hover:border-cyan-500/60 transition p-6 flex flex-col"
                    >
                      <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{product.description}</p>

                      {/* Features */}
                      {product.features && (
                        <ul className="space-y-2 mb-6 flex-grow">
                          {JSON.parse(product.features || "[]").map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-cyan-400" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Price */}
                      <div className="mb-6 border-t border-cyan-500/20 pt-4">
                        <div className="text-3xl font-bold text-cyan-400">
                          {parseFloat(product.price as any).toLocaleString("en-KE", { minimumFractionDigits: 2 })} SD
                        </div>
                        <div className="text-sm text-gray-400">/{product.billingCycle}</div>
                      </div>

                      {/* Purchase Button */}
                      {isAuthenticated ? (
                        <Button
                          onClick={() => handlePurchase(product.id)}
                          disabled={createOrderMutation.isPending}
                          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                        >
                          {createOrderMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Deploy Now"
                          )}
                        </Button>
                      ) : (
                        <Link href="/login">
                          <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600">
                            Login to Purchase
                          </Button>
                        </Link>
                      )}
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Automation Bots */}
            {bots.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Bot className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl font-bold">Automation Bots</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {bots.map(product => (
                    <Card
                      key={product.id}
                      className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition p-6 flex flex-col"
                    >
                      <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{product.description}</p>

                      {/* Features */}
                      {product.features && (
                        <ul className="space-y-2 mb-6 flex-grow">
                          {JSON.parse(product.features || "[]").map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-purple-400" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Price */}
                      <div className="mb-6 border-t border-purple-500/20 pt-4">
                        <div className="text-3xl font-bold text-purple-400">
                          {parseFloat(product.price as any).toLocaleString("en-KE", { minimumFractionDigits: 2 })} SD
                        </div>
                        <div className="text-sm text-gray-400">/{product.billingCycle}</div>
                      </div>

                      {/* Purchase Button */}
                      {isAuthenticated ? (
                        <Button
                          onClick={() => handlePurchase(product.id)}
                          disabled={createOrderMutation.isPending}
                          className="w-full bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700"
                        >
                          {createOrderMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Deploy Now"
                          )}
                        </Button>
                      ) : (
                        <Link href="/login">
                          <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-600">
                            Login to Purchase
                          </Button>
                        </Link>
                      )}
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {products.length === 0 && (
              <Card className="bg-black/50 border-cyan-500/30 p-12 text-center">
                <p className="text-gray-400 text-lg">No products available at the moment</p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
