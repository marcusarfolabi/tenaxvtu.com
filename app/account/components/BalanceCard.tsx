"use client";
import { useState } from "react";
import { EyeOff, Eye, Plus, ArrowRightLeft } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { TransferModal } from "./modals/TransferModal";

interface BalanceCardProps {
  onTopup?: () => void;
}

export function BalanceCard({ onTopup }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const { balance, isLoading, transferCommission } = useWallet();
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const format = (value: string | number = "0.00") => {
    return `${balance?.currency || "₦"}${value}`;
  };

  const handleTransfer = (type: "commission") => {
    transferCommission.mutate(type, {
      onSuccess: () => {
        setIsTransferOpen(false);
      },
    });
  };

return (
    <div className="relative overflow-hidden bg-brand-black rounded-4xl p-6 shadow-2xl transition-all duration-500 hover:shadow-brand-gold/10 border border-white/5">
      {/* Decorative Background Elements - Kept for that premium glassmorphism feel */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full -mr-16 -mt-16 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-gold/5 rounded-full -ml-12 -mb-12 blur-2xl" />

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
            Available Balance
          </p>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tighter">
              {isLoading ? (
                <span className="animate-pulse text-white/20">
                  {balance?.currency || "₦"}0.00
                </span>
              ) : showBalance ? (
                format(balance?.balance)
              ) : (
                "••••••••"
              )}
            </h1>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 bg-white/5 rounded-full text-white/40 hover:text-brand-gold hover:bg-white/10 transition-all active:scale-90 outline-none"
              aria-label="Toggle Balance Visibility"
            >
              {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Secondary Balance: Commission Only */}
          <div className="flex gap-4 mt-3">
            <div className="flex flex-col border-l-2 border-brand-gold/30 pl-3">
              <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">
                Commission
              </span>
              <span className="text-brand-gold text-sm font-black">
                {showBalance ? format(balance?.commission) : "•••"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onTopup}
            className="bg-brand-gold cursor-pointer text-brand-black p-3 rounded-2xl flex flex-col items-center gap-1 group active:scale-95 transition-all shadow-lg shadow-brand-gold/20"
          >
            <Plus size={20} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase">Topup</span>
          </button>

          <button
            onClick={() => setIsTransferOpen(true)}
            className="bg-white/5 text-white p-3 cursor-pointer rounded-2xl flex flex-col items-center gap-1 group active:scale-95 transition-all border border-white/10 hover:bg-white/10"
          >
            <ArrowRightLeft size={20} className="text-brand-gold" />
            <span className="text-[10px] font-black uppercase">Transfer</span>
          </button>
        </div>
      </div>

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
    </div>
  );
}
