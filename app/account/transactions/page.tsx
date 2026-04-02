"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Filter, Download } from "lucide-react";
import { TransactionList } from "@/app/account/components/TransactionList";

export default function TransactionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pb-20 transition-colors duration-300">
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-foreground/5 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-foreground/5 rounded-2xl transition-all active:scale-90 text-foreground"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-black text-foreground tracking-tight">
              Activity
            </h1>
          </div>

        </div>
      </div>

      {/* --- CONTENT --- */}
      <main className="max-w-md mx-auto p-4 space-y-6">

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background p-5 rounded-4xl border border-foreground/5 shadow-xl shadow-black/5">
            <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">Inflow</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-green-500">₦</span>
              <p className="text-xl font-black text-green-500 tracking-tighter">Credits</p>
            </div>
          </div>

          <div className="bg-background p-5 rounded-4xl border border-foreground/5 shadow-xl shadow-black/5">
            <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">Outflow</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-foreground/60">₦</span>
              <p className="text-xl font-black text-foreground tracking-tighter">Debits</p>
            </div>
          </div>
        </div>

        {/* Transaction List Container */}
        <div className="bg-background/40 rounded-[2.5rem] border border-foreground/5 overflow-hidden">
          <div className="px-5 py-6 border-b border-foreground/5 flex justify-between items-center bg-foreground/2">
            <h2 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Transaction Logs</h2>
            <span className="text-[9px] font-bold bg-brand-red/10 text-brand-red px-2 py-1 rounded-lg">LIVE</span>
          </div>
          <div className="p-2">
            <TransactionList
              limit={20}
              showTitle={false}
            />
          </div>
        </div>

        {/* Load More Hint */}
        <p className="text-center text-[10px] font-bold text-foreground/20 uppercase tracking-widest py-4">
          End of recent activity
        </p>
      </main>
    </div>
  );
}