"use client";
import { useState } from "react";
import {
  EyeOff,
  Eye,
  Plus,
  ArrowRightLeft,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { TransferModal } from "./modals/TransferModal";
import { useAuth } from "@/context/AuthContext";

interface BalanceCardProps {
  onTopup?: () => void;
}

export function BalanceCard({ onTopup }: BalanceCardProps) {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const {
    balance,
    hwProviderBalance,
    isLoading,
    refreshWallet,
    transferCommission,
  } = useWallet({
    role: user?.role,
  });
  const isAgent = user?.role === "agent";


  // Inside BalanceCard component
  const format = (value: string | number = "0.00") => {
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    return `${balance?.currency || "₦"}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleTransfer = (type: "commission") => {
    transferCommission.mutate(type, {
      onSuccess: () => {
        setIsTransferOpen(false);
      },
    });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transition-all duration-700 border border-white/10 group
      ${isAgent
          ? "bg-linear-to-br from-slate-900 via-brand-black to-slate-900"
          : "bg-brand-black hover:shadow-brand-red/20"
        }`}
    >
      {/* Premium Glassmorphism Backgrounds */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-red/15 rounded-full -mr-20 -mt-20 blur-[80px] group-hover:bg-brand-red/25 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-red/5 rounded-full -ml-20 -mb-20 blur-[60px]" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            {/* Role-based Title */}
            <div className="flex items-center gap-2">
              <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em]">
                {isAgent ? "HonourWorld Master Balance" : "Personal Wallet"}
              </p>
              {isAgent && (
                <span className="flex items-center gap-1 bg-brand-red/10 text-brand-red px-2 py-0.5 rounded-full text-[9px] font-bold border border-brand-red/20 uppercase">
                  <ShieldCheck size={10} /> Secure Agent Access
                </span>
              )}
            </div>

            {/* Main Balance */}
            <div className="flex items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter transition-all">
                {isLoading ? (
                  <span className="animate-pulse opacity-20">••••••</span>
                ) : showBalance ? (
                  isAgent ? (
                    format(hwProviderBalance)
                  ) : (
                    format(balance?.balance)
                  )
                ) : (
                  "••••••••"
                )}
              </h1>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2.5 bg-white/5 rounded-xl text-white/30 hover:text-brand-red hover:bg-white/10 transition-all active:scale-90"
              >
                {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Sub-balances / Commission Section */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex flex-col border-l-2 border-brand-red/30 pl-4 py-1">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  Total Commission
                </span>
                <span className="text-brand-red text-lg font-black mt-0.5">
                  {showBalance ? format(balance?.commission) : "•••"}
                </span>
              </div>

              {/* If Agent, show Customer Wallet Balance as a small metric */}
              {isAgent && (
                <div className="flex flex-col border-l-2 border-white/10 pl-4 py-1">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    Local Liquidity
                  </span>
                  <span className="text-white text-lg font-black mt-0.5 opacity-60">
                    {showBalance ? format(balance?.balance) : "•••"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Column (Different for Agent vs Customer) */}
          <div className="flex flex-col gap-3">
            {isAgent ? (
              // Agent only sees Refresh for the HW API Balance
              <button
                onClick={() => refreshWallet()}
                className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-3xl flex flex-col items-center gap-2 transition-all active:rotate-180 duration-500 border border-white/5 group/btn"
              >
                <RefreshCw
                  size={24}
                  className="text-brand-red group-hover/btn:scale-110 transition-transform"
                />
                <span className="text-[9px] font-black uppercase text-white/60">
                  Sync API
                </span>
              </button>
            ) : (
              // Customer sees Topup & Transfer
              <>
                <button
                  onClick={onTopup}
                  className="bg-brand-red hover:bg-yellow-500 text-brand-burgundy p-4 rounded-3xl flex flex-col items-center gap-2 transition-all active:scale-95 shadow-xl shadow-brand-red/20 group/btn"
                >
                  <Plus
                    size={24}
                    strokeWidth={3}
                    className="group-hover/btn:scale-110 transition-transform"
                  />
                  <span className="text-[9px] font-black uppercase">
                    Refill
                  </span>
                </button>

                <button
                  onClick={() => setIsTransferOpen(true)}
                  className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-3xl flex flex-col items-center gap-2 transition-all active:scale-95 border border-white/10 group/btn"
                >
                  <ArrowRightLeft
                    size={24}
                    className="text-brand-red group-hover/btn:rotate-12 transition-transform"
                  />
                  <span className="text-[9px] font-black uppercase">Move</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {!isAgent && (
        <TransferModal
          isOpen={isTransferOpen}
          onClose={() => setIsTransferOpen(false)}
          balances={{
            commission: balance?.commission || 0,
            currency: balance?.currency || "₦",
          }}
          onTransfer={handleTransfer}
          isPending={transferCommission.isPending}
        />
      )}
    </div>
  );
}
