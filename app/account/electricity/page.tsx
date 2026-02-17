"use client";
import { useState, useEffect } from "react";
import { Phone, Wallet, Zap, List, UserCheck, Hash } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { TransactionList } from "../components/TransactionList";
import { Modal } from "../components/ui/Modal";
import FormInput from "@/components/common/FormInput";
import { electricityApi } from "@/lib/api/electricity";
import { toast } from "react-hot-toast";
import SubmitButton from "@/components/common/SubmitButton";
import FormSelect from "@/components/common/FormSelect";
import {
  canAffordTransaction,
  getInadequateBalanceMessage,
} from "@/util/wallet-helper";
import { useAuth } from "@/context/AuthContext";

export default function ElectricityPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [discos, setDiscos] = useState<any[]>([]);
  const [minAmount, setMinAmount] = useState(1000);
  const { balance, stats, refreshWallet } = useWallet({
    limit: 10,
    type: "ELECTRICITY",
  });
  const [formData, setFormData] = useState({
    meterNo: "",
    disco: "",
    type: "PREPAID" as "PREPAID" | "POSTPAID",
    amount: 0,
    phoneNumber: "",
  });

  useEffect(() => {
    electricityApi
      .getCategories()
      .then((res) => {
        const actualData = res.data?.data;

        if (Array.isArray(actualData)) {
          setDiscos(actualData);
        } else {
          console.error("Payload structure mismatch:", res.data);
          setDiscos([]);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load electricity providers");
      });
  }, []);

  const validateMeter = async () => {
    if (formData.meterNo.length < 5 || !formData.disco) return;

    setIsValidating(true);
    setCustomerName(null);

    try {
      const res = await electricityApi.validateMeter({
        disco: formData.disco,
        meterNo: formData.meterNo,
        type: formData.type,
      });

      const data = res.data?.data;

      if (data) {
        setCustomerName(data.customerName);

        const min = data.minimumPayable || 1000;
        setMinAmount(min);

        setFormData((prev) => ({
          ...prev,
          phoneNumber: prev.phoneNumber || data.phoneNumber || "",
          amount: prev.amount === 0 ? min : prev.amount,
        }));

        toast.success(`Validated: ${data.customerName}`);
      }
    } catch (error: any) {
      setCustomerName(null);
      toast.error(error.response?.data?.message || "Meter validation failed");
    } finally {
      setIsValidating(false);
    }
  };

  const canAfford = canAffordTransaction(balance, formData.amount, user?.role);
 
  const amountNum = Number(formData.amount) || 0;
  const minNum = Number(minAmount) || 0;

  const isFormValid =
    formData.meterNo.length >= 5 &&
    formData.disco !== "" &&
    amountNum >= minNum &&
    formData.phoneNumber.length >= 10 &&
    customerName !== null;
  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canAfford) {
      toast.error(getInadequateBalanceMessage(user?.role));
      return;
    }

    if (!isFormValid) return;

    setIsPurchasing(true);
    try {
      await electricityApi.buy({
        disco: formData.disco,
        meterNo: formData.meterNo,
        type: formData.type,
        amount: formData.amount,
        phoneNumber: formData.phoneNumber,
      });

      toast.success("Electricity token purchased successfully!");
      setIsModalOpen(false);
      resetForm();
      refreshWallet();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Purchase failed");
    } finally {
      setIsPurchasing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      meterNo: "",
      disco: "",
      type: "PREPAID",
      amount: 0,
      phoneNumber: "",
    });
    setCustomerName(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Power Stats Card - Locked to Brand Black */}
      <div className="relative overflow-hidden bg-brand-black rounded-[2.5rem] p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Total Power Units
          </p>
          <h2 className="text-4xl font-black mt-1 tracking-tighter">
            {balance?.currency || "₦"}
            {(stats?.total_amount || 0).toLocaleString()}
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 flex items-center gap-2 bg-brand-gold text-brand-black px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all active:scale-95 shadow-lg shadow-brand-gold/20"
          >
            <Zap size={16} /> Pay Electricity
          </button>
        </div>
        <Zap className="absolute -right-4 -bottom-4 text-white/5 w-40 h-40 rotate-12" />
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h3 className="font-black text-foreground/40 px-1 uppercase text-[10px] tracking-[0.2em]">
          Power History
        </h3>
        <TransactionList limit={10} showTitle={false} type="ELECTRICITY" />
      </div>

      {/* Electricity Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pay Electricity"
      >
        <form onSubmit={handlePurchase} className="p-6 space-y-5">
          {/* Disco Selection */}
          <FormSelect
            label="Select Provider (Disco)"
            icon={List}
            options={discos.map((d) => ({
              code: d.disco,
              name: d.disco,
              fullname: d.fullname,
              image: d.image?.url || d.url,
            }))}
            selectedCode={formData.disco}
            onChange={(code) => {
              setFormData({ ...formData, disco: String(code) });
              setCustomerName(null);
            }}
            placeholder="Select Disco (e.g. IKEDC)"
          />

          {/* Meter Type Segmented Toggle */}
          <div className="flex gap-1 p-1 bg-foreground/5 rounded-2xl border border-foreground/5">
            {["PREPAID", "POSTPAID"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t as any })}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                  formData.type === t
                    ? "bg-background shadow-sm text-foreground"
                    : "text-foreground/40 hover:text-foreground/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <FormInput
              label="Meter Number"
              icon={Hash}
              placeholder="Enter Meter No."
              value={formData.meterNo}
              onChange={(e) =>
                setFormData({ ...formData, meterNo: e.target.value })
              }
              onBlur={validateMeter}
            />

            {isValidating && (
              <p className="text-[10px] text-brand-gold font-black uppercase tracking-widest animate-pulse px-2">
                Verifying Meter...
              </p>
            )}

            {customerName && (
              <div className="flex items-start gap-3 px-4 py-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                <UserCheck size={18} className="text-green-500 mt-0.5" />
                <div className="flex flex-col">
                  <p className="text-[8px] text-green-500/60 font-black uppercase tracking-tighter leading-none mb-1">
                    Verified Owner
                  </p>
                  <p className="text-xs font-black text-green-500 uppercase leading-tight">
                    {customerName}
                  </p>
                  <p className="text-[9px] text-green-500/80 font-bold mt-1.5 bg-green-500/10 self-start px-2 py-0.5 rounded-md">
                    MIN: ₦{minAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Amount"
              type="number"
              icon={Wallet}
              placeholder={`Min ₦${minAmount}`}
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) })
              }
            />

            <FormInput
              label="Recipient Phone"
              icon={Phone}
              type="tel"
              placeholder="For Token Delivery"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
          </div>

          <SubmitButton
            loadingText="Processing..."
            disabled={!isFormValid || isPurchasing || isValidating}
            isLoading={isPurchasing}
            idleText={
              customerName
                ? `Pay ₦${(formData.amount || 0).toLocaleString()}`
                : "Validate Meter to Continue"
            }
            className="h-14 rounded-2xl shadow-lg shadow-brand-gold/10"
          />
        </form>
      </Modal>
    </div>
  );
}
