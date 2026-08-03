import { useAuth } from "./useAuth";
import { trpc } from "./main";
import { Button } from "./components";
import { Card } from "./components";
import { Link } from "wouter";
import { Loader2, Users, TrendingUp, Package, BarChart3, Settings, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./components";
import { toast } from "sonner";

export default function Admin() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { data: usersData } = trpc.admin.users.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const { data: transactionsData } = trpc.admin.transactions.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
    const { data: ordersData } = trpc.admin.orders.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const { data: productsData, refetch: refetchProducts } = trpc.admin.products.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const { data: settingsData, refetch: refetchSettings } = trpc.admin.settings.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const updateSettingMutation = trpc.admin.updateSetting.useMutation();
  const updateProductMutation = trpc.admin.updateProduct.useMutation();

  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    if (settingsData) {
      const s: Record<string, string> = {};
      settingsData.forEach((item: any) => {
        s[item.key] = item.value;
      });
      setSettings(s);
    }
  }, [settingsData]);

  const handleSaveSetting = async (key: string) => {
    setIsSaving(true);
    try {
      await updateSettingMutation.mutateAsync({ key, value: settings[key] || "" });
      toast.success(`Setting ${key} updated`);
      refetchSettings();
    } catch (err) {
      toast.error("Failed to update setting");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    setIsSaving(true);
    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        data: {
          name: editingProduct.name,
          price: editingProduct.price,
          description: editingProduct.description,
          eggId: parseInt(editingProduct.eggId) || null,
          nestId: parseInt(editingProduct.nestId) || null,
          memory: parseInt(editingProduct.memory) || null,
          disk: parseInt(editingProduct.disk) || null,
          cpu: parseInt(editingProduct.cpu) || 100,
        }
      });
      toast.success("Product updated successfully");
      setEditingProduct(null);
      refetchProducts();
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      window.location.href = "/";
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

    const users = usersData?.users || [];
  const transactions = transactionsData?.transactions || [];
  const orders = ordersData?.orders || [];
  const products = productsData || [];
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + parseFloat(o.totalPrice), 0);
  const totalDeposits = transactions
    .filter((t: any) => t.type === "deposit" && t.status === "completed")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

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
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-cyan-500 text-cyan-400">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-cyan-400" />
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/50 border-cyan-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-2">Total Users</div>
                <div className="text-3xl font-bold text-cyan-400">{users.length}</div>
              </div>
              <Users className="w-8 h-8 text-cyan-400/50" />
            </div>
          </Card>

          <Card className="bg-black/50 border-purple-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-2">Total Orders</div>
                <div className="text-3xl font-bold text-purple-400">{orders.length}</div>
              </div>
              <Package className="w-8 h-8 text-purple-400/50" />
            </div>
          </Card>

          <Card className="bg-black/50 border-cyan-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-2">Total Revenue</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {(totalRevenue / 1000).toFixed(1)}k SD
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-400/50" />
            </div>
          </Card>

          <Card className="bg-black/50 border-purple-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-2">Total Deposits</div>
                <div className="text-2xl font-bold text-purple-400">
                  {(totalDeposits / 1000).toFixed(1)}k SD
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400/50" />
            </div>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/users">
            <Card className="bg-black/50 border-cyan-500/30 hover:border-cyan-500/60 transition p-6 cursor-pointer">
              <div className="flex items-center gap-4">
                <Users className="w-12 h-12 text-cyan-400" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Users</h3>
                  <p className="text-gray-400 text-sm">{users.length} registered users</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/transactions">
            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition p-6 cursor-pointer">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-12 h-12 text-purple-400" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Transactions</h3>
                  <p className="text-gray-400 text-sm">{transactions.length} total transactions</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="bg-black/50 border-cyan-500/30 hover:border-cyan-500/60 transition p-6 cursor-pointer">
              <div className="flex items-center gap-4">
                <Package className="w-12 h-12 text-cyan-400" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Orders</h3>
                  <p className="text-gray-400 text-sm">{orders.length} total orders</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Pterodactyl Settings */}
        <Card className="bg-black/50 border-cyan-500/30 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold">Pterodactyl & System Settings</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Pterodactyl URL</label>
                <div className="flex gap-2">
                  <Input 
                    value={settings['pterodactyl_url'] || ''} 
                    onChange={(e) => setSettings({...settings, pterodactyl_url: e.target.value})}
                    placeholder="https://panel.yourdomain.com"
                    className="bg-black/50 border-cyan-500/30"
                  />
                  <Button size="icon" onClick={() => handleSaveSetting('pterodactyl_url')} disabled={isSaving}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Pterodactyl API Key</label>
                <div className="flex gap-2">
                  <Input 
                    type="password"
                    value={settings['pterodactyl_api_key'] || ''} 
                    onChange={(e) => setSettings({...settings, pterodactyl_api_key: e.target.value})}
                    placeholder="ptla_..."
                    className="bg-black/50 border-cyan-500/30"
                  />
                  <Button size="icon" onClick={() => handleSaveSetting('pterodactyl_api_key')} disabled={isSaving}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Default Location ID</label>
                <div className="flex gap-2">
                  <Input 
                    value={settings['default_location_id'] || ''} 
                    onChange={(e) => setSettings({...settings, default_location_id: e.target.value})}
                    placeholder="1"
                    className="bg-black/50 border-cyan-500/30"
                  />
                  <Button size="icon" onClick={() => handleSaveSetting('default_location_id')} disabled={isSaving}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Conversion Rate (1 SD = ? KSH)</label>
                <div className="flex gap-2">
                  <Input 
                    value={settings['conversion_rate'] || ''} 
                    onChange={(e) => setSettings({...settings, conversion_rate: e.target.value})}
                    placeholder="5"
                    className="bg-black/50 border-cyan-500/30"
                  />
                  <Button size="icon" onClick={() => handleSaveSetting('conversion_rate')} disabled={isSaving}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Product Management */}
        <Card className="bg-black/50 border-purple-500/30 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Product & Price Management</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-500/20 text-gray-400 text-sm">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Price (SD)</th>
                  <th className="pb-3">Egg/Nest ID</th>
                  <th className="pb-3">Resources</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {products.map((product: any) => (
                  <tr key={product.id} className="text-sm">
                    <td className="py-4">
                      {editingProduct?.id === product.id ? (
                        <Input 
                          value={editingProduct.name} 
                          onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                          className="bg-black/50 border-purple-500/30 h-8 text-xs"
                        />
                      ) : product.name}
                    </td>
                    <td className="py-4">
                      {editingProduct?.id === product.id ? (
                        <Input 
                          type="number"
                          value={editingProduct.price} 
                          onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                          className="bg-black/50 border-purple-500/30 h-8 text-xs w-20"
                        />
                      ) : `${product.price} SD`}
                    </td>
                    <td className="py-4">
                      {editingProduct?.id === product.id ? (
                        <div className="flex gap-1">
                          <Input 
                            placeholder="Egg"
                            value={editingProduct.eggId || ''} 
                            onChange={(e) => setEditingProduct({...editingProduct, eggId: e.target.value})}
                            className="bg-black/50 border-purple-500/30 h-8 text-xs w-12"
                          />
                          <Input 
                            placeholder="Nest"
                            value={editingProduct.nestId || ''} 
                            onChange={(e) => setEditingProduct({...editingProduct, nestId: e.target.value})}
                            className="bg-black/50 border-purple-500/30 h-8 text-xs w-12"
                          />
                        </div>
                      ) : `E:${product.eggId} / N:${product.nestId}`}
                    </td>
                    <td className="py-4">
                      {editingProduct?.id === product.id ? (
                        <div className="flex gap-1">
                          <Input 
                            placeholder="RAM"
                            value={editingProduct.memory || ''} 
                            onChange={(e) => setEditingProduct({...editingProduct, memory: e.target.value})}
                            className="bg-black/50 border-purple-500/30 h-8 text-xs w-16"
                          />
                          <Input 
                            placeholder="Disk"
                            value={editingProduct.disk || ''} 
                            onChange={(e) => setEditingProduct({...editingProduct, disk: e.target.value})}
                            className="bg-black/50 border-purple-500/30 h-8 text-xs w-16"
                          />
                        </div>
                      ) : `${product.memory}MB / ${product.disk}MB`}
                    </td>
                    <td className="py-4 text-right">
                      {editingProduct?.id === product.id ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={handleUpdateProduct} disabled={isSaving}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingProduct(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" className="border-purple-500/30" onClick={() => setEditingProduct(product)}>
                          Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="bg-black/50 border-cyan-500/30 p-6">
            <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="pb-3 border-b border-cyan-500/20 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Order #{order.id}</div>
                      <div className="text-xs text-gray-400">User #{order.userId}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">
                        {parseFloat(order.totalPrice).toLocaleString("en-KE", { minimumFractionDigits: 2 })} SD
                      </div>
                      <div className="text-xs text-gray-400">{order.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-black/50 border-purple-500/30 p-6">
            <h3 className="text-xl font-bold mb-4">Recent Deposits</h3>
            <div className="space-y-3">
              {transactions
                .filter((t: any) => t.type === "deposit")
                .slice(0, 5)
                .map((tx: any) => (
                  <div key={tx.id} className="pb-3 border-b border-purple-500/20 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Deposit #{tx.id}</div>
                        <div className="text-xs text-gray-400">{tx.paymentMethod || "System"}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">
                          +{parseFloat(tx.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })} SD
                        </div>
                        <div className={`text-xs ${
                          tx.status === "completed" ? "text-green-400" :
                          tx.status === "pending" ? "text-yellow-400" :
                          "text-red-400"
                        }`}>
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
