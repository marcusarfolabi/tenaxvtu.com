"use client";
import Link from "next/link";
import {
  ChevronRight,
  ReceiptText,
  ChevronLeft,
  PhoneForwarded,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
import { TransactionDetailModal } from "./modals/TransactionDetailModal";
import { formatActivityDate } from "@/util/date";
import Image from "next/image";

interface TransactionListProps {
  limit?: number;
  showTitle?: boolean;
  type?: string;
}

export function TransactionList({
  limit,
  showTitle = true,
  type,
}: TransactionListProps) {
  const [page, setPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<any>(null);  

  const { transactions, pagination, isLoading, balance } = useWallet({
    page,
    limit,
    type,
  });
  const currency = balance?.currency || "₦";

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex justify-between items-center px-1">
          <h2 className="font-black text-foreground tracking-tight text-lg">
            Recent Activity
          </h2>
          <Link
            href="/account/transactions"
            className="text-brand-red text-xs font-black flex items-center gap-1 active:opacity-70 transition-opacity"
          >
            SEE ALL <ChevronRight size={14} strokeWidth={3} />
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {transactions?.length > 0 ? (
          transactions.map((tx: any) => {
            const providerIcon = tx.network
              ? `/providers/${tx.network.toLowerCase()}.png`
              : null;

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="bg-background p-4 rounded-3xl flex items-center justify-between border border-foreground/5 shadow-sm active:scale-[0.98] transition-all cursor-pointer hover:border-brand-red/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-foreground/5 border border-foreground/10 overflow-hidden shrink-0">
                    {providerIcon ? (
                      <Image
                        src={providerIcon}
                        alt={tx.network || "Provider"}
                        width={160}
                        height={160}
                        className="w-full h-full object-contain p-1.5"
                        priority={true}
                      />
                    ) : (
                      <PhoneForwarded className="text-brand-red" size={20} />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-black text-foreground line-clamp-1">
                      {tx.network
                        ? `${tx.network} ${tx.type === "DATA" ? "Data Purchase" :
                          tx.type === "AIRTIME" ? "Airtime Top-up" :
                            tx.type === "CABLE" ? "Cable Subscription" :
                              tx.type === "ELECTRICITY" ? "Electricity Token" :
                                "Transaction"
                        }`
                        : tx.remark || "Wallet Transaction"}
                    </p>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                      {formatActivityDate(tx.created_at)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase ${tx.status === "success"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                      }`}
                  >
                    {tx.status === "success" ? "Completed" : "Failed"}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 text-center bg-foreground/5 rounded-4xl border-2 border-dashed border-foreground/10">
            <ReceiptText size={40} className="text-foreground/10 mb-2" />
            <p className="text-foreground/60 font-bold text-sm">
              No transactions yet
            </p>
            <p className="text-foreground/40 text-xs">
              Your activity will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.last_page > 1 && (
        <div className="mt-8 flex items-center justify-between p-1.5 rounded-4xl bg-foreground/3 border border-foreground/10 backdrop-blur-md shadow-2xl">

          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="group relative flex items-center gap-2 px-6 py-3 rounded-3xl overflow-hidden transition-all duration-300 disabled:opacity-20 active:scale-95 cursor-pointer"
          >
            <div className={`absolute inset-0 transition-colors duration-300 ${page === 1 ? 'bg-foreground/5' : 'bg-brand-red shadow-[0_0_20px_rgba(255,69,69,0.2)] group-hover:bg-brand-red/90'}`} />
            <span className="relative text-[11px] font-black text-brand-burgundy uppercase tracking-[0.15em] transition-transform group-hover:-translate-x-1">
              Less
            </span>
          </button>

          {/* PAGE INDICATOR */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-0.5">
              Interval
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-foreground">{page}</span>
              <span className="text-[10px] font-bold text-foreground/20">/</span>
              <span className="text-[10px] font-bold text-foreground/40">{pagination.last_page}</span>
            </div>
          </div>

          {/* NEXT BUTTON (More) */}
          <button
            onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
            disabled={page === pagination.last_page || isLoading}
            className="group relative flex items-center gap-2 px-6 py-3 rounded-3xl overflow-hidden transition-all duration-300 disabled:opacity-20 active:scale-95 cursor-pointer"
          >
            <div className={`absolute inset-0 transition-colors duration-300 ${page === pagination.last_page ? 'bg-foreground/5' : 'bg-brand-red shadow-[0_0_20px_rgba(255,69,69,0.2)] group-hover:bg-brand-red/90'}`} />
            <span className="relative text-[11px] font-black text-brand-burgundy uppercase tracking-[0.15em] transition-transform group-hover:translate-x-1">
              More 
            </span>
          </button>

        </div>
      )}

      <TransactionDetailModal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        tx={selectedTx}
        currency={currency}
      />
    </div>
  );
}
