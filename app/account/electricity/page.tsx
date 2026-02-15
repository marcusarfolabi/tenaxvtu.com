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

export default function ElectricityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [discos, setDiscos] = useState<any[]>([]);
  const [minAmount, setMinAmount] = useState(100); // Default fallback
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

        const min = data.minimumPayable || 100;
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

  const canAfford = parseFloat(balance?.balance || "0") >= formData.amount;

  // Force both to numbers to avoid string comparison bugs
  const amountNum = Number(formData.amount) || 0;
  const minNum = Number(minAmount) || 0;

  const isFormValid =
    formData.meterNo.length >= 5 &&
    formData.disco !== "" &&
    amountNum >= minNum && // Now it's a true numeric "Greater than or equal"
    formData.phoneNumber.length >= 10 &&
    customerName !== null;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAfford) {
      toast.error(
        `Insufficient balance. You need ₦${formData.amount.toLocaleString()} but have ₦${parseFloat(balance?.balance || "0").toLocaleString()}`,
      );
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
      {/* Balance Card */}
      <div className="relative overflow-hidden bg-brand-black rounded-[2.5rem] p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Total Power Units
          </p>
          <h2 className="text-4xl font-black mt-1">
            {balance?.currency || "₦"}
            {(stats?.total_amount || 0).toLocaleString()}
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 flex items-center gap-2 bg-brand-gold text-brand-black px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all active:scale-95"
          >
            <Zap size={16} /> Pay Electricity
          </button>
        </div>
        <Zap className="absolute -right-4 -bottom-4 text-white/5 w-40 h-40 rotate-12" />
      </div>

      {/* History */}
      <div className="space-y-4">
        <h3 className="font-black text-gray-900 px-1 uppercase text-xs tracking-widest">
          Power History
        </h3>
        <TransactionList limit={10} showTitle={false} type="ELECTRICITY" />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pay Electricity"
      >
        <form onSubmit={handlePurchase} className="p-6 space-y-4">
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

          {/* Meter Type */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
            {["PREPAID", "POSTPAID"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t as any })}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${formData.type === t ? "bg-white shadow-sm text-brand-black" : "text-gray-500"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-1">
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
              <p className="text-[10px] text-brand-gold animate-pulse px-2">
                Validating...
              </p>
            )}

            {customerName && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-green-50 rounded-xl border border-green-100">
                  <UserCheck size={14} className="text-green-600" />
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-green-700 uppercase leading-none">
                      {customerName}
                    </p>
                    <p className="text-[8px] text-green-600 font-bold mt-1">
                      MINIMUM PAYABLE: ₦{minAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

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
            placeholder="Token will be sent here"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />

          <SubmitButton
            loadingText="Processing..."
            disabled={!isFormValid || isPurchasing || isValidating}
            isLoading={isPurchasing}
            idleText={
              customerName
                ? `Pay ₦${formData.amount}`
                : "Validate Meter to Continue"
            }
            className="h-14 rounded-2xl"
          />
        </form>
      </Modal>
    </div>
  );
}
