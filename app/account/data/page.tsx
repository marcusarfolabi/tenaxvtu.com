"use client";
import { useState, useEffect } from "react";
import { Phone, Wallet, Database, List, XCircle } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { TransactionList } from "../components/TransactionList";
import { Modal } from "../components/ui/Modal";
import FormInput from "@/components/common/FormInput";
import Image from "next/image";
import { dataApi } from "@/lib/api/data";
import { toast } from "react-hot-toast";
import SubmitButton from "@/components/common/SubmitButton";
import FormSelect from "@/components/common/FormSelect";

export default function DataPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // State for plans from backend
  const [allPlans, setAllPlans] = useState<any[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<any[]>([]);

  const { balance, stats, refreshWallet } = useWallet({
    limit: 10,
    type: "DATA",
  });

  type NetworkType = "MTN" | "GLO" | "AIRTEL" | "9MOBILE";

  const [formData, setFormData] = useState({
    phone: "",
    network: "MTN" as NetworkType,
    selectedPlanId: "",
    amount: 0,
    planName: "",
  });

  // 1. Fetch plans on mount
  useEffect(() => {
    dataApi
      .getPlans()
      .then((res) => {
        const plansArray = Array.isArray(res.data) ? res.data : res.data.data;

        if (Array.isArray(plansArray)) {
          setAllPlans(plansArray);
        } else {
          console.error("Data received is not an array:", res.data);
          setAllPlans([]);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load data plans");
        setAllPlans([]);
      });
  }, []);
 
  useEffect(() => {
    if (Array.isArray(allPlans)) {
      const filtered = allPlans.filter(
        (p) => p.network?.toUpperCase() === formData.network,
      );
      setFilteredPlans(filtered);
    }
 
    setFormData((prev) => ({
      ...prev,
      selectedPlanId: "",
      amount: 0,
      planName: "",
    }));
  }, [formData.network, allPlans]);

  const canAfford = parseFloat(balance?.balance || "0") >= formData.amount;
  const isFormValid =
    formData.phone.length >= 11 && formData.selectedPlanId && canAfford;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsPurchasing(true);
    try {
      await dataApi.buy({
        network: formData.network,
        planId: formData.selectedPlanId,
        phone: formData.phone,
        amount: formData.amount,
        plan_name: formData.planName,
      });

      toast.success("Data subscription successful!");
      setIsModalOpen(false);
      setFormData((prev) => ({
        ...prev,
        phone: "",
        selectedPlanId: "",
        amount: 0,
      }));
      refreshWallet();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process data");
    } finally {
      setIsPurchasing(false);
    }
  };

return (
    <div className="space-y-6 pb-20">
      {/* Dynamic Balance Card - Fixed Brand Black */}
      <div className="relative overflow-hidden bg-brand-black rounded-[2.5rem] p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Total Data Purchase
          </p>
          <h2 className="text-4xl font-black mt-1 tracking-tighter">
            {balance?.currency || "₦"}
            {(stats?.total_amount || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 flex items-center gap-2 bg-brand-gold text-brand-black px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all active:scale-95 shadow-lg shadow-brand-gold/20"
          >
            <Database size={16} /> Buy Data
          </button>
        </div>
        <Database className="absolute -right-4 -bottom-4 text-white/5 w-40 h-40 rotate-12" />
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h3 className="font-black text-foreground/40 px-1 uppercase text-[10px] tracking-[0.2em]">
          Data History
        </h3>
        <TransactionList limit={10} showTitle={false} type="DATA" />
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Purchase Data"
      >
        <form onSubmit={handlePurchase} className="p-6 space-y-6">
          {/* Network Selection Grid */}
          <div className="grid grid-cols-4 gap-2">
            {["MTN", "GLO", "AIRTEL", "9MOBILE"].map((net) => (
              <button
                key={net}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, network: net as NetworkType })
                }
                className={`py-3 rounded-2xl flex flex-col items-center gap-2 border transition-all active:scale-95 ${
                  formData.network === net 
                    ? "bg-brand-gold/10 border-brand-gold text-foreground shadow-sm" 
                    : "bg-foreground/5 border-transparent text-foreground/40 grayscale opacity-60 hover:opacity-100 hover:grayscale-0"
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-foreground/5 shadow-inner flex items-center justify-center p-0.5">
                  <Image
                    src={`/providers/${net.toLowerCase()}.png`}
                    alt={net}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <span className="text-[9px] font-black uppercase tracking-tighter">{net}</span>
              </button>
            ))}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <FormInput
              label="Phone Number"
              name="phone"
              type="tel" 
              inputMode="numeric"
              maxLength={11}
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              icon={Phone}
              placeholder="080..."
            />
          </div>

          {/* Data Plan Selection */}
          <FormSelect
            label="Select Plan"
            icon={List}
            options={filteredPlans.map(p => ({
              code: p.code,
              name: `${p.name} - ₦${parseFloat(p.reseller_price).toLocaleString()}`
            }))}
            selectedCode={formData.selectedPlanId}
            onChange={(code) => {
              const plan = filteredPlans.find(
                (p) => String(p.code) === String(code),
              );

              setFormData({
                ...formData,
                selectedPlanId: String(code),
                amount: parseFloat(plan?.reseller_price || "0"),
                planName: plan?.name || "",
              });
            }}
          />

          {/* Balance Display - Themed Container */}
          <div className="bg-foreground/5 p-4 rounded-2xl flex justify-between items-center border border-foreground/5">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-foreground/40" />
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                Available Balance
              </span>
            </div>
            <span
              className={`text-xs font-black ${!canAfford ? "text-red-500" : "text-foreground"}`}
            >
              {balance?.currency}
              {balance?.balance?.toLocaleString()}
            </span>
          </div>

          {!canAfford && formData.amount > 0 && (
            <p className="text-[10px] font-bold text-red-500 text-center animate-pulse">
              <XCircle size={12} /> Insufficient wallet balance
            </p>
          )}

          <SubmitButton
            loadingText="Processing..."
            disabled={!isFormValid || isPurchasing}
            isLoading={isPurchasing}
            idleText={formData.amount > 0 ? `Pay ₦${formData.amount.toLocaleString()}` : `Buy ${formData.network} Data`}
            className="h-14 rounded-2xl shadow-lg shadow-brand-gold/10"
          />
        </form>
      </Modal>
    </div>
  );
}
