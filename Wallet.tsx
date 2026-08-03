import { useAuth } from "./useAuth";
import { trpc } from "./main";
import { Button } from "./components";
import { Card } from "./components";
import { Input } from "./components";
import { useState } from "react";
import { Loader2, Wallet, CreditCard, Smartphone, Globe } from "lucide-react";
import { toast } from "sonner";

export default function WalletPage() {
  const { user, loading: authLoading } = useAuth();
  const [amount, setAmount] = useState("100");
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "mpesa" | "pesapal">("mpesa");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: balanceData, refetch: refetchBalance } = trpc.wallet.getBalance.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: historyData } = trpc.wallet.getHistory.useQuery(undefined, {
    enabled: !!user,
  });

  const depositMutation = trpc.wallet.deposit.useMutation();
  const confirmMutation = trpc.wallet.confirmDeposit.useMutation();

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (paymentMethod === "mpesa" && !phone) {
      toast.error("Please enter your M-Pesa phone number");
      return;
    }

    setIsProcessing(true);

    try {
      // Initiate deposit
      const reference = `BL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await depositMutation.mutateAsync({
        amount,
        paymentMethod,
        reference,
      });

      // Simulate payment processing
      toast.success(`${paymentMethod.toUpperCase()} payment initiated...`);

      // In a real app, you'd wait for the payment gateway callback
      // For now, simulate confirmation after 3 seconds
      setTimeout(async () => {
        try {
          await confirmMutation.mutateAsync({
            reference,
            amount,
          });
          toast.success("Deposit confirmed! Balance updated.");
          setAmount("100");
          refetchBalance();
        } catch (error) {
          toast.error("Failed to confirm deposit");
        }
      }, 3000);
    } catch (error) {
      toast.error("Failed to initiate deposit");
    } finally {
      setIsProcessing(false);
    }
  };

  const balance = balanceData?.balance || "0.00";
  const transactions = historyData?.transactions || [];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-cyan-500/30 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            BLACKLORD TECH
          </a>
          <div className="flex gap-4">
            <a href="/dashboard" className="hover:text-cyan-400 transition">Dashboard</a>
            <a href="/products" className="hover:text-cyan-400 transition">Products</a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Wallet Management</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Deposit Form */}
          <div className="lg:col-span-2">
            <Card className="bg-black/50 border-cyan-500/30 p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Deposit Funds</h2>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Amount (KSH)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100"
                  min="10"
                  className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-600"
                />
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Payment Method</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {/* M-Pesa STK Push */}
                  <button
                    onClick={() => setPaymentMethod("mpesa")}
                    className={`p-4 rounded-lg border-2 transition ${
                      paymentMethod === "mpesa"
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-cyan-500/30 bg-black/30 hover:border-cyan-500/60"
                    }`}
                  >
                    <Smartphone className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                    <div className="font-semibold">M-Pesa</div>
                    <div className="text-xs text-gray-400">STK Push</div>
                  </button>

                  {/* Paystack */}
                  <button
                    onClick={() => setPaymentMethod("paystack")}
                    className={`p-4 rounded-lg border-2 transition ${
                      paymentMethod === "paystack"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-cyan-500/30 bg-black/30 hover:border-cyan-500/60"
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                    <div className="font-semibold">Paystack</div>
                    <div className="text-xs text-gray-400">Card/Bank</div>
                  </button>

                  {/* Pesapal */}
                  <button
                    onClick={() => setPaymentMethod("pesapal")}
                    className={`p-4 rounded-lg border-2 transition ${
                      paymentMethod === "pesapal"
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-cyan-500/30 bg-black/30 hover:border-cyan-500/60"
                    }`}
                  >
                    <Globe className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                    <div className="font-semibold">Pesapal</div>
                    <div className="text-xs text-gray-400">Multiple</div>
                  </button>
                </div>
              </div>

              {/* M-Pesa Phone Number */}
              {paymentMethod === "mpesa" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">M-Pesa Phone Number</label>
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="254712345678"
                    className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-600"
                  />
                </div>
              )}

              {/* Deposit Button */}
              <Button
                onClick={handleDeposit}
                disabled={isProcessing || depositMutation.isPending}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 h-12 text-lg"
              >
                {isProcessing || depositMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Deposit KSH ${parseFloat(amount || "0").toLocaleString("en-KE")} (~${(parseFloat(amount || "0") / 5).toFixed(2)} SD)`
                )}
              </Button>
            </Card>

            {/* Quick Amounts */}
            <Card className="bg-black/50 border-cyan-500/30 p-6">
              <h3 className="font-semibold mb-4">Quick Amounts</h3>
              <div className="grid grid-cols-4 gap-2">
                {["100", "500", "1000", "5000"].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className="p-3 rounded border border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10 transition text-sm font-medium"
                  >
                    KSH {amt}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Balance & History */}
          <div>
            {/* Current Balance */}
            <Card className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-500/30 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-8 h-8 text-cyan-400" />
                <h3 className="text-lg font-semibold">Current Balance</h3>
              </div>
              <div className="text-4xl font-bold text-cyan-400">
                {parseFloat(balance).toLocaleString("en-KE", { minimumFractionDigits: 2 })} SD
              </div>
              <div className="text-sm text-gray-400 mt-2">
                1 SD = 5 KSH
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="bg-black/50 border-cyan-500/30 p-6">
              <h3 className="font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.length > 0 ? (
                  transactions.slice(0, 10).map(tx => (
                    <div key={tx.id} className="pb-3 border-b border-cyan-500/20 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium capitalize">{tx.type}</div>
                          <div className="text-xs text-gray-400">{tx.paymentMethod || "System"}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${tx.type === "deposit" ? "text-green-400" : "text-red-400"}`}>
                            {tx.type === "deposit" ? "+" : "-"}{parseFloat(tx.amount as any).toLocaleString("en-KE", { minimumFractionDigits: 2 })} SD
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
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">No transactions yet</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
