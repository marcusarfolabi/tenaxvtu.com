"use client";
import { useState } from "react";
import { Phone, Zap, Hash, Wallet, Smartphone, XCircle } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { TransactionList } from "../components/TransactionList";
import { Modal } from "../components/ui/Modal";
import FormInput from "@/components/common/FormInput";
import SubmitButton from "@/components/common/SubmitButton";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { airtimeApi } from "@/lib/api/airtime";
import { toast } from "react-hot-toast";
import {
  canAffordTransaction,
  getInadequateBalanceMessage,
} from "@/util/wallet-helper";

export default function AirtimePage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { balance, stats, refreshWallet } = useWallet({
    limit: 10,
    type: "AIRTIME",
  });

  type NetworkType = "MTN" | "GLO" | "AIRTEL" | "9MOBILE";

  const [formData, setFormData] = useState<{
    phone: string;
    amount: string;
    network: NetworkType;
  }>({
    phone: "",
    amount: "",
    network: "MTN",
  });
 
  const canAfford = canAffordTransaction(balance, formData.amount, user?.role);

  const isFormValid =
    formData.phone.length >= 11 && formData.amount && canAfford;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (!canAfford) {
      toast.error(getInadequateBalanceMessage(user?.role));
      return;
    }

    setIsPurchasing(true);
    try {
      await airtimeApi.buy({
        ...formData,
        amount: parseFloat(formData.amount),
        network: formData.network as any,
      });

      toast.success("Airtime purchase successful!");
      setIsModalOpen(false);
      setFormData({ phone: "", amount: "", network: "MTN" });
      refreshWallet();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process airtime");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="relative overflow-hidden bg-brand-black rounded-[2.5rem] p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Total Airtime Purchase
          </p>
          <h2 className="text-4xl font-black mt-1 tracking-tighter">
            {balance?.currency || "₦"}
            {(stats?.total_amount || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 flex items-center gap-2 bg-brand-gold text-brand-black px-6 py-3 rounded-2xl font-black text-xs uppercase active:scale-95 transition-all shadow-lg shadow-brand-gold/20"
          >
            <Smartphone size={16} /> Buy Airtime
          </button>
        </div>
        <Zap className="absolute -right-4 -bottom-4 text-white/5 w-40 h-40 rotate-12" />
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h3 className="font-black text-foreground/40 px-1 uppercase text-[10px] tracking-[0.2em]">
          Airtime History
        </h3>
        <TransactionList limit={10} showTitle={false} type="AIRTIME" />
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Purchase Airtime"
      >
        <form onSubmit={handlePurchase} className="p-6 space-y-6">
          {/* Network Selector */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            {(["MTN", "GLO", "AIRTEL", "9MOBILE"] as NetworkType[]).map(
              (net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setFormData({ ...formData, network: net })}
                  className={`py-3 rounded-2xl flex flex-col items-center gap-2 border transition-all active:scale-95 ${
                    formData.network === net
                      ? "bg-brand-gold/10 border-brand-gold text-foreground shadow-sm"
                      : "bg-foreground/5 border-transparent text-foreground/40 grayscale opacity-50 hover:opacity-100 hover:grayscale-0"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center border border-foreground/5 shadow-inner">
                    <Image
                      src={`/providers/${net.toLowerCase()}.png`}
                      alt={net}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover p-1"
                    />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tighter">
                    {net}
                  </span>
                </button>
              ),
            )}
          </div>

          {/* Phone Number Input */}
          <div className="relative">
            <div className="flex justify-between items-center px-1 mb-1">
              <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                Phone Number
              </label>
              {user?.phone && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, phone: user.phone })
                  }
                  className="text-[9px] font-black text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-lg active:scale-90 transition-all uppercase"
                >
                  Buy for Self
                </button>
              )}
            </div>
            <FormInput
              name="phone"
              type="tel"
              inputMode="tel"
              maxLength={11}
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              icon={Phone}
              placeholder="080..."
            />
          </div>

          <FormInput
            label="Amount"
            name="amount"
            type="number"
            min={50}
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            icon={Hash}
            placeholder="Min ₦50"
          />

          {/* Wallet Balance Display */}
          <div className="bg-foreground/5 p-4 rounded-2xl flex justify-between items-center border border-foreground/5">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-foreground/40" />
              <span className="text-[10px] font-bold text-foreground/40 uppercase">
                Wallet Balance
              </span>
            </div>
            <span
              className={`text-xs font-black ${!canAfford ? "text-red-500" : "text-foreground"}`}
            >
              {balance?.currency}
              {balance?.balance}
            </span>
          </div>

          {!canAfford && formData.amount && (
            <p className="text-[10px] font-bold text-red-500 text-center animate-pulse">
              <XCircle size={12} /> Insufficient wallet balance
            </p>
          )}

          <SubmitButton
            disabled={!isFormValid || isPurchasing}
            isLoading={isPurchasing}
            idleText={`Buy ${formData.network} Airtime`}
            loadingText="Processing..."
            className="h-14 rounded-2xl shadow-lg shadow-brand-gold/20"
          />
        </form>
      </Modal>
    </div>
  );
}
