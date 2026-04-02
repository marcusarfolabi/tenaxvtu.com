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
  const [selectedTx, setSelectedTx] = useState<any>(null); // State for modal

  const { transactions, pagination, isLoading, balance } = useWallet({
    page,
    limit,
    type,
  });
  const currency = balance?.currency || "₦";

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(limit || 3)].map((_, i) => (
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
                  {/* Logo Container with adaptive theme */}
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
                        ? `${tx.network} Airtime`
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
        <div className="flex items-center justify-between bg-background p-2 rounded-2xl border border-foreground/5 shadow-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="p-2 rounded-xl cursor-pointer hover:bg-brand-red/80 bg-brand-red text-brand-burgundy disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={20} className="font-black" />
          </button>

          <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">
            Page {page} of {pagination.last_page}
          </span>

          <button
            onClick={() =>
              setPage((p) => Math.min(pagination.last_page, p + 1))
            }
            disabled={page === pagination.last_page || isLoading}
            className="p-2 rounded-xl cursor-pointer hover:bg-brand-red/80 bg-brand-red text-brand-burgundy disabled:opacity-20 transition-all"
          >
            <ChevronRight size={20} className="font-black" />
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
