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
import { formatCurrency } from "@/util/getUserCurrency";

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

  const handleTransfer = (type: "commission") => {
    transferCommission.mutate(type, {
      onSuccess: () => {
        setIsTransferOpen(false);
      },
    });
  };

  return ( 
    <div
      className={`dark relative overflow-hidden rounded-4xl md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl transition-all duration-700 border border-white/10 group
      ${isAgent
          ? "bg-linear-to-br from-brand-black via-brand-black to-brand-burgundy"
          : "bg-brand-black hover:shadow-brand-red/20"
        }`}
    >
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-brand-red/20 rounded-full -mr-16 -mt-16 md:-mr-20 md:-mt-20 blur-[60px] md:blur-[80px] group-hover:bg-brand-red/30 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 w-24 h-24 md:w-40 md:h-40 bg-brand-red/10 rounded-full -ml-12 -mb-12 md:-ml-20 md:-mb-20 blur-[40px] md:blur-[60px]" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0">
          <div className="space-y-3 md:space-y-4 w-full md:w-auto">

            {/* Title Section - Using high-contrast muted text */}
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-gray-400 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
                {isAgent ? "HonourWorld Master Balance" : "Personal Wallet"}
              </p>
              {isAgent && (
                <span className="flex items-center gap-1 bg-brand-red/20 text-brand-red px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-bold border border-brand-red/30 uppercase">
                  <ShieldCheck size={10} /> Secure
                </span>
              )}
            </div>

            {/* Main Balance Row */}
            <div className="flex items-end justify-between md:justify-start gap-3 md:gap-4 mt-2">
              <div className="flex flex-col min-w-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tighter transition-all truncate leading-none">
                  {isLoading ? (
                    <span className="animate-pulse opacity-20">••••••</span>
                  ) : showBalance ? (
                      isAgent ? formatCurrency(hwProviderBalance) : formatCurrency(balance?.balance)
                  ) : (
                    "••••••••"
                  )}
                </h1>
              </div>

              <button
                onClick={() => setShowBalance(!showBalance)}
                className="mb-1 p-2 md:p-2.5 bg-foreground/10 rounded-xl text-foreground/50 hover:text-brand-red hover:bg-foreground/20 transition-all active:scale-90 flex-shrink-0"
                aria-label="Toggle Balance Visibility"
              >
                {showBalance ? <EyeOff size={18} className="md:w-5 md:h-5" /> : <Eye size={18} className="md:w-5 md:h-5" />}
              </button>
            </div>

            {/* Commissions Section */}
            <div className="flex flex-row items-center gap-4 md:gap-6 mt-4 md:mt-6">
              <div className="flex flex-col border-l-2 border-brand-red/40 pl-3 md:pl-4 py-0.5 md:py-1">
                <span className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Commission
                </span>
                <span className="text-brand-red text-sm md:text-lg font-black mt-0.5">
                  {showBalance ? formatCurrency(balance?.commission) : "•••"}
                </span>
              </div>

              {isAgent && (
                <div className="flex flex-col border-l-2 border-white/20 pl-3 md:pl-4 py-0.5 md:py-1">
                  <span className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Liquidity
                  </span>
                  <span className="text-white text-sm md:text-lg font-black mt-0.5 opacity-80">
                    {showBalance ? formatCurrency(balance?.balance) : "•••"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Column */}
          <div className="flex flex-row md:flex-col gap-2 md:gap-3 w-full md:w-auto">
            {isAgent ? (
              /* Agent Sync Button */
              <button
                onClick={() => refreshWallet()}
                className="flex-1 md:flex-none bg-foreground/10 hover:bg-foreground/20 text-foreground p-3 md:p-4 rounded-2xl md:rounded-3xl flex flex-row md:flex-col items-center justify-center gap-2 transition-all active:rotate-180 duration-500 border border-foreground/10 group/btn"
              >
                <RefreshCw size={20} className="text-brand-red transition-transform group-hover/btn:scale-110" />
                <span className="text-[8px] md:text-[9px] font-black uppercase text-foreground/70 tracking-wider">
                  Sync
                </span>
              </button>
            ) : (
              /* Customer Actions */
              <>
                <button
                  onClick={onTopup}
                  className="flex-1 md:flex-none bg-brand-red hover:brightness-110 text-brand-burgundy p-3 md:p-4 rounded-2xl md:rounded-3xl flex flex-row md:flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-brand-red/10"
                >
                  <Plus size={20} strokeWidth={3} className="transition-transform" />
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider">
                    Fund
                  </span>
                </button>

                <button
                  onClick={() => setIsTransferOpen(true)}
                  className="flex-1 md:flex-none bg-foreground/10 hover:bg-foreground/20 text-foreground p-3 md:p-4 rounded-2xl md:rounded-3xl flex flex-row md:flex-col items-center justify-center gap-2 transition-all active:scale-95 border border-foreground/10"
                >
                  <ArrowRightLeft size={20} className="text-brand-red transition-transform" />
                  <span className="text-[8px] md:text-[9px] font-black uppercase text-foreground/70 tracking-wider">
                    Move
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {!isAgent && (
        <TransferModal
          isOpen={isTransferOpen}
          onClose={() => setIsTransferOpen(false)}
          balances={{
            commission: balance?.commission || 0,
            currency: balance?.currency || "NGN",
          }}
          onTransfer={handleTransfer}
          isPending={transferCommission.isPending}
        />
      )}
    </div>
  );
}