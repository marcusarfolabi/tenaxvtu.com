"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Copy, Check, Info, Landmark, Share2, Wallet } from "lucide-react";
import { walletApi } from "@/lib/api/wallet";
import { toast } from "react-hot-toast";

export default function VirtualAccountPage() {
  const router = useRouter();
  const [accountData, setAccountData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await walletApi.virtualAccount();
        setAccountData(res.data.data);
      } catch (error) {
        toast.error("Unable to load account details");
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, []);

  const activeAccount = accountData?.provider_details?.accounts?.[0];

  const handleCopy = () => {
    if (!activeAccount?.accountNumber) return;
    navigator.clipboard.writeText(activeAccount.accountNumber);
    setCopied(true);
    toast.success("Account number copied");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-4 py-6 flex items-center justify-between sticky top-0 z-20 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ChevronLeft size={24} className="text-brand-black" />
        </button>
        <h1 className="text-sm font-black text-brand-black uppercase tracking-[0.2em]">
          Top-up Wallet
        </h1>
        <button className="p-2 text-gray-400">
          <Share2 size={20} />
        </button>
      </div>

      <main className="p-5 max-w-md mx-auto space-y-6">
        {/* Info Banner */}
        <div className="flex gap-3 bg-brand-gold/5 p-4 rounded-2xl border border-brand-gold/10">
          <Info className="text-brand-gold shrink-0" size={18} />
          <p className="text-[11px] font-bold text-gray-600 leading-tight">
            Funds sent to this account will reflect in your <span className="text-brand-black underline decoration-brand-gold">Main Balance</span> automatically.
          </p>
        </div>

        {/* The "Banking Slip" UI */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-gold/5 overflow-hidden border border-gray-100">
          {/* Slip Header */}
          <div className="bg-brand-black p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-brand-gold rounded-lg p-2">
                <Landmark size={20} className="text-brand-black" />
              </div>
              <div>
                <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Receiving Bank</p>
                <p className="text-white font-black text-sm uppercase">
                  {activeAccount?.bankName || "Digital Bank"}
                </p>
              </div>
            </div>
            <Wallet className="text-white/10" size={40} />
          </div>

          <div className="p-8 space-y-8">
            {/* Account Number Section */}
            <div className="text-center space-y-2">
              <label className="label-primary">Account Number</label>
              <div 
                onClick={handleCopy}
                className="relative py-2 cursor-pointer group active:scale-95 transition-transform"
              >
                <span className="text-5xl font-black text-brand-black tracking-tighter block">
                  {activeAccount?.accountNumber}
                </span>
                <div className="flex justify-center mt-3">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full">
                    {copied ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} className="text-brand-gold" />
                    )}
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {copied ? "Copied" : "Tap to copy"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200" />

            {/* Account Name Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="label-primary">Account Name</label>
                <p className="text-sm font-black text-brand-black uppercase wrap-break-words">
                  {activeAccount?.accountName || accountData?.account_name}
                </p>
              </div>
              <div className="text-right space-y-1">
                <label className="label-primary">Status</label>
                <div className="flex justify-end items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <p className="text-xs font-black text-green-600 uppercase">
                    {accountData?.status || "Active"}
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action */}
        <button 
          onClick={handleCopy}
          className="w-full bg-brand-black text-white h-16 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-black/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-b-4 border-brand-gold"
        >
          {copied ? <Check size={20} /> : <Copy size={20} className="text-brand-gold" />}
          {copied ? "Copied to Clipboard" : "Copy Account Details"}
        </button>
 
      </main>
    </div>
  );
}