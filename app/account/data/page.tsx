"use client";
import { useState, useEffect, useMemo } from "react";
import { Phone, Database, List } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { TransactionList } from "../components/TransactionList";
import { Modal } from "../components/ui/Modal";
import FormInput from "@/components/common/FormInput";
import Image from "next/image";
import { dataApi } from "@/lib/api/data";
import { toast } from "react-hot-toast";
import SubmitButton from "@/components/common/SubmitButton";
import FormSelect from "@/components/common/FormSelect";
import { canAffordTransaction } from "@/util/wallet-helper";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/util/getUserCurrency";
import { useNetworkDetection } from "@/hooks/useNetworkDetection";

type NetworkType = "MTN" | "GLO" | "AIRTEL" | "9MOBILE";

export default function DataPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [allPlans, setAllPlans] = useState<any[]>([]);

  // New state for the second filter level
  const [selectedSubType, setSelectedSubType] = useState<string>("");

  const { balance, stats, refreshWallet } = useWallet({
    limit: 10,
    type: "DATA",
    role: user?.role,
  });

  const [formData, setFormData] = useState({
    phone: "",
    network: "MTN" as NetworkType,
    selectedPlanId: "",
    amount: 0,
    planName: "",
  });

  useEffect(() => {
    dataApi.getPlans().then((res) => {
      const plansArray = Array.isArray(res.data) ? res.data : res.data.data;
      if (Array.isArray(plansArray)) setAllPlans(plansArray);
    });
  }, []);

  // 1. Get unique Sub-Types for the selected network (e.g., ["SME", "CG", "DG"])
  const availableSubTypes = useMemo(() => {
    const networkPlans = allPlans.filter(p => p.network?.toUpperCase() === formData.network);
    const types = networkPlans.map(p =>
      p.name.replace(new RegExp(`^${formData.network}\\s*`, "i"), "").split(" ")[0]
    );
    return Array.from(new Set(types)).filter(Boolean);
  }, [allPlans, formData.network]);

  // 2. Filter plans based on BOTH Network and Sub-Type
  const finalFilteredPlans = useMemo(() => {
    return allPlans.filter((p) => {
      const matchesNetwork = p.network?.toUpperCase() === formData.network;
      const cleanName = p.name.replace(new RegExp(`^${p.network}\\s*`, "i"), "");
      const matchesType = selectedSubType ? cleanName.startsWith(selectedSubType) : true;
      return matchesNetwork && matchesType;
    }).map(p => ({
      ...p,
      displayName: p.name.replace(new RegExp(`^${p.network}\\s*`, "i"), "")
    }));
  }, [allPlans, formData.network, selectedSubType]);

  // Reset secondary filters when main network changes
  useEffect(() => {
    setSelectedSubType("");
    setFormData(prev => ({ ...prev, selectedPlanId: "", amount: 0, planName: "" }));
  }, [formData.network]);

  const { handlePhoneChange } = useNetworkDetection(setFormData);
  const canAfford = canAffordTransaction(balance, formData.amount, user?.role);
  const isFormValid = formData.phone.length >= 11 && formData.selectedPlanId && canAfford;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPurchasing(true);
    try {
      await dataApi.buy({
        network: formData.network,
        planId: formData.selectedPlanId,
        phone: formData.phone,
        amount: formData.amount,
        plan_name: formData.planName,
      });
      toast.success("Success!");
      setIsModalOpen(false);
      refreshWallet();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="space-y-6 pb-20"> 
       <div className="relative overflow-hidden bg-brand-black rounded-4xl md:rounded-[2.5rem] p-6 md:p-8 text-foreground shadow-2xl border border-foreground/10">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
            Data Spent
          </p>
          <h2 className="text-3xl md:text-4xl font-black mt-1 tracking-tighter text-foreground">
            {formatCurrency(stats?.total_amount || 0)}
          </h2>
          <button
            title="Buy Data"
            onClick={() => setIsModalOpen(true)}
            className="mt-6 cursor-pointer flex items-center gap-2 bg-brand-red text-brand-burgundy px-6 py-3 rounded-2xl font-black text-xs uppercase active:scale-95 transition-all shadow-lg shadow-brand-red/10"
          >
            <Database size={16} aria-label="Buy Data" /> Buy Data
          </button>
        </div>
        <Database className="absolute -right-4 -bottom-4 text-foreground/5 w-32 h-32 md:w-40 md:h-40 rotate-12" />
      </div>

        {/* History Section */}
      <div className="space-y-4">
        <h3 className="font-black text-foreground/40 px-1 uppercase text-[10px] tracking-[0.2em]">
          Data History
        </h3>
        <TransactionList limit={10} showTitle={false} type="DATA" />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Purchase Data">
        <form onSubmit={handlePurchase} className="p-6 space-y-6">

          {/* STEP 1: Network Selection */}
          <div className="grid grid-cols-4 gap-2">
            {(["MTN", "GLO", "AIRTEL", "9MOBILE"] as NetworkType[]).map((net) => (
              <button
                key={net}
                type="button"
                onClick={() => setFormData({ ...formData, network: net })}
                className={`py-3 rounded-2xl cursor-pointer flex flex-col items-center gap-2 border transition-all ${formData.network === net ? "bg-brand-red/10 border-brand-red" : "bg-foreground/5 border-transparent opacity-40"
                  }`}
              >
                <Image src={`/providers/${net.toLowerCase()}.png`} alt={net} width={24} height={24} />
                <span className="text-[8px] font-black uppercase">{net}</span>
              </button>
            ))}
          </div>

          {/* STEP 2: Sub-Type Selection (Dynamic based on Network) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest px-1">Select Data Type</label>
            <div className="flex flex-wrap gap-2">
              {availableSubTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedSubType(type)}
                  className={`px-4 py-2 cursor-pointer rounded-xl text-[10px] font-black uppercase transition-all border ${selectedSubType === type
                      ? "bg-foreground text-background border-foreground shadow-md"
                      : "bg-foreground/5 text-foreground/60 border-transparent hover:bg-foreground/10"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

         
          {/* STEP 3: Plan Selection (Filtered by both) */}
          <FormSelect
            label="Available Plans"
            icon={List}
            options={finalFilteredPlans.map((p) => ({
              code: p.code,
              name: `${p.allowance} - ${formatCurrency(p.price)}`,
            }))}
            selectedCode={formData.selectedPlanId}
            onChange={(code) => {
              const plan = finalFilteredPlans.find(p => String(p.code) === String(code));
              if (plan) setFormData({ ...formData, selectedPlanId: String(code), amount: parseFloat(plan.price), planName: plan.name });
            }}
          />

          {/* STEP 4: Phone Input */}
          <FormInput
            label="Phone Number"
            value={formData.phone}
            onChange={handlePhoneChange}
            icon={Phone}
            placeholder="080..."
            maxLength={11}
          />

          {/* Balance & Submit */}
          <div className="bg-foreground/5 p-4 rounded-2xl flex justify-between items-center border border-foreground/5">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Balance</span>
            <span className={`text-xs font-black ${!canAfford ? "text-brand-red" : "text-foreground"}`}>{formatCurrency(balance?.balance)}</span>
          </div>

          <SubmitButton
            loadingText="Processing..."
            disabled={!isFormValid || isPurchasing}
            isLoading={isPurchasing}
            idleText={formData.amount > 0 ? `Pay ${formatCurrency(formData.amount)}` : `Complete Selection`}
            className="h-14 rounded-2xl shadow-lg shadow-brand-red/10"
          />
        </form>
      </Modal>
    </div>
  );
}