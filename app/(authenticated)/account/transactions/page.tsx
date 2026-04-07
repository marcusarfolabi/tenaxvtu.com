"use client";

import { useRouter } from "next/navigation";
import { TransactionList } from "@/app/(authenticated)/account/components/TransactionList";

export default function TransactionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pb-20 transition-colors duration-300">
      <div className="space-y-6 pb-20">

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

        <p className="text-center text-[10px] font-bold text-foreground/20 uppercase tracking-widest py-4">
          End of recent activity
        </p>
      </div>
    </div>
  );
}