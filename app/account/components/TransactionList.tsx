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
          <h2 className="font-black text-gray-900 tracking-tight text-lg">
            Recent Activity
          </h2>
          <Link
            href="/account/transactions"
            className="text-brand-gold text-xs font-black flex items-center gap-1 active:opacity-70"
          >
            SEE ALL <ChevronRight size={14} strokeWidth={3} />
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {transactions?.length > 0 ? (
          transactions.map((tx: any) => {
            // Determine the image path based on the network name
            const providerIcon = tx.network
              ? `/providers/${tx.network.toLowerCase()}.png`
              : null;

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="bg-white p-4 rounded-3xl flex items-center justify-between border border-gray-50 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {/* Logo Container */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
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
                      <PhoneForwarded className="text-brand-gold" size={20} />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-black text-gray-900 line-clamp-1">
                      {tx.network
                        ? `${tx.network} Airtime`
                        : tx.remark || "Wallet Transaction"}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {formatActivityDate(tx.created_at)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-black ${
                      tx.type === "debit" ? "text-gray-900" : "text-green-600"
                    }`}
                  >
                    {tx.type === "debit" ? "-" : "+"}
                    {currency}
                    {parseFloat(tx.amount).toLocaleString()}
                  </p>
                  <span
                    className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase ${
                      tx.status === "success" || tx.status === "1"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {tx.status === "1" || tx.status === "success"
                      ? "Completed"
                      : "Failed"}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-4xl border-2 border-dashed border-gray-200">
            <ReceiptText size={40} className="text-gray-300 mb-2" />
            <p className="text-gray-500 font-bold text-sm">
              No transactions yet
            </p>
            <p className="text-gray-400 text-xs">
              Your activity will appear here.
            </p>
          </div>
        )}
      </div>
      {/* Pagination Controls */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="p-2 rounded-xl cursor-pointer hover:bg-brand-gold/50 bg-brand-gold disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={20} className="font-black" />
          </button>

          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Page {page} of {pagination.last_page}
          </span>

          <button
            onClick={() =>
              setPage((p) => Math.min(pagination.last_page, p + 1))
            }
            disabled={page === pagination.last_page || isLoading}
            className="p-2 rounded-xl cursor-pointer hover:bg-brand-gold/50 bg-brand-gold disabled:opacity-30 transition-all"
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
