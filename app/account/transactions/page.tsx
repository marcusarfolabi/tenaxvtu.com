"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Filter, Download } from "lucide-react";
import { TransactionList } from "@/app/account/components/TransactionList";

export default function TransactionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors active:scale-90"
            >
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Activity
            </h1>
          </div>

          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-brand-gold transition-colors">
              <Download size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-brand-gold transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Quick Stats Summary (Optional) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inflow</p>
            <p className="text-lg font-black text-green-600">Total Credits</p>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Outflow</p>
            <p className="text-lg font-black text-gray-900">Total Debits</p>
          </div>
        </div>

        {/* The Reusable List Component */}
        <div className="bg-white/50 rounded-4xl">
          <TransactionList 
            limit={10} 
            showTitle={false}  
          />
        </div>
      </main>
    </div>
  );
}