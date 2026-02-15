"use client";
import {
  X,
  Download,
  Share2,
  CheckCircle2,
  Landmark,
  Calendar,
  Hash,
  Tag,
  Network,
  XCircle,
  Zap,
  Copy,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import toast from "react-hot-toast";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tx: any;
  currency: string;
}

export function TransactionDetailModal({
  isOpen,
  onClose,
  tx,
  currency,
}: TransactionDetailModalProps) {
  if (!tx) return null;

  const handleShare = async () => {
    const text = `Transaction Receipt\nAmount: ${currency}${tx.amount}\nRef: ${tx.reference}\nStatus: ${tx.status}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Transaction Receipt",
          text,
          url: window.location.href,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Receipt details copied to clipboard!");
    }
  };

return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details">
      <div id="receipt-content" className="p-6 bg-background">
        <div className="flex flex-col items-center justify-center space-y-3 pb-8 border-b border-dashed border-foreground/10">
                    <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              tx.status === "success" || tx.status === "1"
                ? "bg-green-500/10"
                : "bg-red-500/10"
            }`}
          >
            {tx.status === "success" || tx.status === "1" ? (
              <CheckCircle2 className="text-green-500" size={32} />
            ) : (
              <XCircle className="text-red-500" size={32} />
            )}
          </div>

          <div className="text-center">
            <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
              Transaction Amount
            </p>
            <h2 className="text-4xl font-black text-foreground tracking-tighter">
              {currency}
              {parseFloat(tx.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h2>
          </div>

          {/* Conditional Status Badge */}
          <span
            className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-wider ${
              tx.status === "success" 
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {tx.status === "success"
              ? "Successful"
              : "Failed"}
          </span>
        </div>

        {/* Details Grid */}
        <div className="py-6 space-y-5">
          <DetailRow
            label="Reference"
            value={tx.reference}
            icon={<Hash size={14} />}
            isCopyable
          />
          <DetailRow
            label="Service Provider"
            value={`${tx.network} (${tx.type})`}
            icon={<Network size={14} className="text-foreground/40" />}
          />

          {tx.token && (
            <DetailRow
              label="Token"
              value={tx.token}
              icon={<Hash size={14} className="text-brand-gold" />}
              isCopyable
            />
          )}

          {tx.unit && (
            <DetailRow
              label="Units"
              value={`${tx.unit} kWh`}
              icon={<Zap size={14} className="text-brand-gold" />}
            />
          )}

          <DetailRow
            label="Date & Time"
            value={new Date(tx.created_at).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
            icon={<Calendar size={14} />}
          />
          <DetailRow
            label="Beneficiary"
            value={tx.destination || "WEB"}
            icon={<Landmark size={14} />}
          />
        </div>

        {/* Footer Brand */}
        <div className="space-y-4">
           <p className="text-foreground/60 text-center italic text-xs px-4">{tx.remark}</p>
           <div className="pt-6 border-t border-foreground/5 flex justify-center">
            <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">
              Kakalinks Official Receipt
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons - Always visible and themed */}
      <div className="p-4 grid grid-cols-2 gap-3 bg-foreground/5 rounded-b-3xl">
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 h-12 bg-background border border-foreground/10 rounded-xl text-xs font-black uppercase text-foreground hover:bg-foreground/5 active:scale-95 transition-all"
        >
          <Download size={16} /> Download
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 h-12 bg-brand-gold text-brand-black rounded-xl text-xs font-black uppercase active:scale-95 transition-all shadow-lg shadow-brand-gold/20"
        >
          <Share2 size={16} /> Share
        </button>
      </div>
    </Modal>
  );
}

function DetailRow({
  label,
  value,
  icon,
  isCopyable,
}: {
  label: string;
  value: string;
  icon: any;
  isCopyable?: boolean;
}) {
  const handleCopy = () => {
    if (!isCopyable) return;
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied!`);
  };

  return (
    <div
      className={`flex justify-between items-start group ${isCopyable ? "cursor-pointer" : ""}`}
      onClick={handleCopy}
    >
      <div className="flex items-center gap-2 text-foreground/40">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1.5 justify-end max-w-[60%]">
        <p
          className={`text-xs font-black text-foreground text-right break-all transition-colors ${isCopyable ? "group-active:text-brand-gold" : ""}`}
        >
          {value}
        </p>
        {isCopyable && (
          <Copy
            size={12}
            className="text-foreground/20 group-hover:text-brand-gold transition-colors shrink-0"
          />
        )}
      </div>
    </div>
  );
}
