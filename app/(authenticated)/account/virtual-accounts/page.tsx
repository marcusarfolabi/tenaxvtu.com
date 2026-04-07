"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Info, Landmark, Wallet } from "lucide-react";
import { walletApi } from "@/lib/api/wallet";
import { toast } from "react-hot-toast";

const AccountSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-12 bg-foreground/5 rounded-2xl border border-foreground/5" />

    <div className="bg-background rounded-[2.5rem] border border-foreground/5 overflow-hidden shadow-sm">
      <div className="bg-foreground/5 p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-foreground/10 rounded-lg" />
        <div className="space-y-2">
          <div className="h-2 w-16 bg-foreground/10 rounded" />
          <div className="h-4 w-32 bg-foreground/10 rounded" />
        </div>
      </div>
      <div className="p-8 space-y-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-3 w-24 bg-foreground/5 rounded" />
          <div className="h-12 w-full max-w-50 bg-foreground/10 rounded-xl" />
          <div className="h-8 w-32 bg-foreground/5 rounded-full" />
        </div>
        <div className="border-t border-dashed border-foreground/10" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-2 w-20 bg-foreground/5 rounded" />
            <div className="h-4 w-full bg-foreground/10 rounded" />
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <div className="h-2 w-12 bg-foreground/5 rounded" />
            <div className="h-4 w-16 bg-foreground/10 rounded" />
          </div>
        </div>
      </div>
    </div>
    <div className="h-16 bg-foreground/10 rounded-2xl w-full" />
  </div>
);

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
      } catch (error: any) {
        const apiMessage = error.response?.data?.message || "Unable to load account details";
        toast.error(apiMessage);
        router.replace("/account/identity-verification");
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, []);

  const activeAccount = accountData?.provider_details?.accounts?.[0];

  const handleCopy = () => {
    const number = activeAccount?.accountNumber;
    if (!number) return;
    navigator.clipboard.writeText(number);
    setCopied(true);
    toast.success("Account number copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">

      <div className="space-y-6 pb-20">
        {loading ? (
          <AccountSkeleton />
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Info Banner */}
            <div className="flex gap-3 bg-brand-red/5 p-4 rounded-2xl border border-brand-red/10">
              <Info className="text-brand-red shrink-0" size={18} />
              <p className="text-[11px] font-bold text-foreground/60 leading-tight">
                Funds sent to this account reflect in your <span className="text-foreground underline decoration-brand-red">Main Balance</span> automatically.
              </p>
            </div>

            <div className="bg-background rounded-[2.5rem] shadow-2xl shadow-brand-red/5 overflow-hidden border border-foreground/5">
              <div className="bg-brand-black p-6 flex items-center justify-between">
                <div className="flex items-center gap-3 text-foreground/30">
                  <div className="bg-brand-red rounded-lg p-2">
                    <Landmark size={20} className="text-brand-burgundy" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-brand-red uppercase tracking-widest">Receiving Bank</p>
                    <p className="font-black text-sm uppercase">
                      {activeAccount?.bankName || "Digital Bank"}
                    </p>
                  </div>
                </div>
                <Wallet className="text-foreground/10" size={40} />
              </div>

              <div className="p-8 space-y-8">
                <div className="text-center space-y-2">
                  <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Account Number</label>
                  <div onClick={handleCopy} className="relative py-2 cursor-pointer group active:scale-95 transition-transform">
                    <span className="text-5xl font-black text-foreground tracking-tighter block">
                      {activeAccount?.accountNumber}
                    </span>
                    <div className="flex justify-center mt-3">
                      <div className="flex items-center gap-2 bg-foreground/5 border border-foreground/5 px-4 py-1.5 rounded-full">
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-brand-red" />}
                        <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                          {copied ? "Copied" : "Tap to copy"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-foreground/10" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Account Name</label>
                    <p className="text-sm font-black text-foreground uppercase wrap-break-words leading-tight">
                      {activeAccount?.accountName || accountData?.account_name}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Status</label>
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

            <button
              onClick={handleCopy}
              className="w-full bg-brand-black text-foreground/30 h-16 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 border-b-4 border-brand-red active:translate-y-1 active:border-b-0"
            >
              {copied ? <Check size={20} /> : <Copy size={20} className="text-brand-red" />}
              {copied ? "Copied" : "Copy Account Details"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}