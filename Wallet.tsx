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
        <Link href="/dashboard">
          <button style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-xl font-bold">Wallet</h1>
      </nav>

      <div className="container mx-auto px-5 flex flex-col gap-6">
        <Card 
          style={{
            background: 'linear-gradient(135deg, #0891b2, #7c3aed)',
            padding: '32px',
            textAlign: 'center',
            borderRadius: '24px'
          }}
        >
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
            style={{ height: '56px', fontSize: '18px' }}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setMethod("mpesa")}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                borderRadius: '16px',
                border: method === 'mpesa' ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.1)',
                background: method === 'mpesa' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(0,0,0,0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Smartphone style={{ width: '24px', height: '24px', marginBottom: '8px', color: method === 'mpesa' ? '#22c55e' : '#6b7280' }} />
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>M-PESA</span>
            </button>
            <button 
              onClick={() => setMethod("paystack")}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                borderRadius: '16px',
                border: method === 'paystack' ? '2px solid #06b6d4' : '2px solid rgba(255,255,255,0.1)',
                background: method === 'paystack' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(0,0,0,0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <CreditCard style={{ width: '24px', height: '24px', marginBottom: '8px', color: method === 'paystack' ? '#06b6d4' : '#6b7280' }} />
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>CARD</span>
            </button>
          </div>

          <Button 
            onClick={handleDeposit}
            disabled={depositMutation.isPending || confirmMutation.isPending}
            style={{
              width: '100%',
              height: '56px',
              background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
              borderRadius: '16px',
              marginTop: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {(depositMutation.isPending || confirmMutation.isPending) ? <Loader2 className="w-6 h-6 animate-spin" /> : "Deposit Now"}
          </Button>
        </section>
      </div>
    </div>
  );
}