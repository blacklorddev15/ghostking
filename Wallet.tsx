import { useState } from "react";
import { trpc } from "./main";
import { Button, Card, Input } from "./components";
import { Link } from "wouter";
import { Loader2, ChevronLeft, CreditCard, Smartphone } from "lucide-react";
import { toast } from "sonner";

export default function Wallet() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"mpesa" | "paystack">("mpesa");
  const { data: balanceData, refetch } = trpc.wallet.getBalance.useQuery();
  const depositMutation = trpc.wallet.deposit.useMutation();
  const confirmMutation = trpc.wallet.confirmDeposit.useMutation();

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) { toast.error("Enter a valid amount"); return; }
    try {
      const ref = `GK-${Math.random().toString(36).substring(7).toUpperCase()}`;
      await depositMutation.mutateAsync({ amount, paymentMethod: method, reference: ref });
      toast.loading("Simulating payment...", { duration: 2000 });
      setTimeout(async () => {
        await confirmMutation.mutateAsync({ reference: ref, amount });
        toast.success("Deposit successful!");
        refetch();
        setAmount("");
      }, 2000);
    } catch (e) { toast.error("Deposit failed"); }
  };

  return (
    <div className="min-h-screen text-white pb-10">
      <nav className="p-5 flex items-center gap-4">
        <Link href="/dashboard"><a className="p-2 bg-white/5 rounded-lg"><ChevronLeft className="w-5 h-5" /></a></Link>
        <h1 className="text-xl font-bold">Wallet</h1>
      </nav>

      <div className="container mx-auto px-5 flex flex-col gap-6">
        <Card className="bg-gradient-to-br from-cyan-600 to-purple-700 p-8 text-center rounded-3xl">
          <p className="text-white/70 text-sm mb-1">Current Balance</p>
          <h2 className="text-5xl font-bold">{parseFloat(balanceData?.balance || "0").toFixed(0)} <span className="text-2xl">SD</span></h2>
          <p className="text-white/50 text-[10px] mt-2 uppercase tracking-tighter">1 SD = 5 KSH</p>
        </Card>

        <section className="flex flex-col gap-4">
          <h3 className="font-bold text-lg">Add Funds (KSH)</h3>
          <Input 
            type="number" 
            placeholder="Amount in KSH (e.g. 500)" 
            value={amount} 
            onChange={(e: any) => setAmount(e.target.value)}
            className="h-14 text-lg"
          />
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setMethod("mpesa")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition ${method === 'mpesa' ? 'border-green-500 bg-green-500/10' : 'border-white/10 bg-black/40'}`}
            >
              <Smartphone className={`w-6 h-6 mb-2 ${method === 'mpesa' ? 'text-green-500' : 'text-gray-500'}`} />
              <span className="text-xs font-bold">M-PESA</span>
            </button>
            <button 
              onClick={() => setMethod("paystack")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition ${method === 'paystack' ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 bg-black/40'}`}
            >
              <CreditCard className={`w-6 h-6 mb-2 ${method === 'paystack' ? 'text-cyan-500' : 'text-gray-500'}`} />
              <span className="text-xs font-bold">CARD</span>
            </button>
          </div>

          <Button 
            onClick={handleDeposit}
            disabled={depositMutation.isPending || confirmMutation.isPending}
            className="h-14 bg-white text-black font-bold text-lg rounded-2xl mt-2"
          >
            {(depositMutation.isPending || confirmMutation.isPending) ? <Loader2 className="w-6 h-6 animate-spin" /> : "Deposit Now"}
          </Button>
        </section>
      </div>
    </div>
  );
}
