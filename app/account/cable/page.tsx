"use client";
import { useState, useEffect } from "react";
import {
  Wallet,
  Tv,
  List,
  UserCheck,
  CreditCard,
  Activity,
  XCircle,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { TransactionList } from "../components/TransactionList";
import { Modal } from "../components/ui/Modal";
import FormInput from "@/components/common/FormInput";
import { cableApi, CablePackage } from "@/lib/api/cable";
import { toast } from "react-hot-toast";
import SubmitButton from "@/components/common/SubmitButton";
import FormSelect from "@/components/common/FormSelect";
import { canAffordTransaction, getInadequateBalanceMessage } from "@/util/wallet-helper";
import { useAuth } from "@/context/AuthContext";

export default function CablePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState<string | null>(null);
  const [cableTypes, setCableTypes] = useState<any[]>([]);
  const [packages, setPackages] = useState<CablePackage[]>([]);

  const { balance, stats, refreshWallet } = useWallet({
    limit: 10,
    type: "CABLE",
    role: user?.role,

  });

  const [formData, setFormData] = useState({
    type: "",
    smartCardNo: "",
    productsCode: "",
    packagename: "",
    amount: 0,
  });

  // 1. Fetch Providers
  useEffect(() => {
    cableApi
      .getTypes()
      .then((res) => setCableTypes(res.data?.data || []))
      .catch(() => toast.error("Failed to load cable providers"));
  }, []);

  useEffect(() => {
    if (!formData.type) {
      setPackages([]);
      return;
    }

    setIsLoadingPackages(true);
    cableApi
      .getPackages(formData.type)
      .then((res) => setPackages(res.data?.data || []))
      .catch(() => toast.error("Failed to load packages"))
      .finally(() => setIsLoadingPackages(false));
  }, [formData.type]);

  const validateDecoder = async () => {
    if (formData.smartCardNo.length < 5 || !formData.type) return;

    setIsValidating(true);
    setCustomerName(null);

    try {
      const res = await cableApi.validateDecoder({
        type: formData.type,
        smartCardNo: formData.smartCardNo,
      });

      if (res.data?.data) {
        setCustomerName(res.data.data.customerName || res.data.data.name);
        toast.success(`Verified: ${res.data.data.customerName || "Customer"}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Decoder validation failed");
    } finally {
      setIsValidating(false);
    }
  };

  const canAfford = canAffordTransaction(balance, formData.amount, user?.role);

  const isFormValid =
  formData.type !== "" &&
  formData.smartCardNo.length >= 5 &&
  formData.productsCode !== "" &&
  customerName !== null &&
  formData.amount > 0;
  
  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAfford) {
         toast.error(getInadequateBalanceMessage(user?.role));
         return;
       }
   

    if (!isFormValid) return;

    setIsPurchasing(true);
    try {
      await cableApi.buy(formData);
      toast.success("Subscription successful!");
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
      type: "",
      smartCardNo: "",
      productsCode: "",
      packagename: "",
      amount: 0,
    });
    setCustomerName(null);
    setPackages([]);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Spending Card - Fixed Dark Theme */}
      <div className="relative overflow-hidden bg-brand-black rounded-[2.5rem] p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Cable Spending
          </p>
          <h2 className="text-4xl font-black mt-1 tracking-tighter">
            {balance?.currency || "₦"}
            {(stats?.total_amount || 0).toLocaleString()}
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 flex items-center gap-2 bg-brand-gold text-brand-black px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all active:scale-95 shadow-lg shadow-brand-gold/20"
          >
            <Tv size={16} /> Renew Subscription
          </button>
        </div>
        <Tv className="absolute -right-4 -bottom-4 text-white/5 w-40 h-40 rotate-12" />
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h3 className="font-black text-foreground/40 px-1 uppercase text-[10px] tracking-[0.2em]">
          Cable History
        </h3>
        <TransactionList limit={10} showTitle={false} type="CABLE" />
      </div>

      {/* Subscription Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cable TV Subscription"
      >
        <form onSubmit={handlePurchase} className="p-6 space-y-5">
          <FormSelect
            label="Select Provider"
            icon={List}
            options={cableTypes.map((t) => ({
              code: t.name,
              name: t.name,
              image: t.image?.url || t.url,
            }))}
            selectedCode={formData.type}
            onChange={(code) => {
              setFormData({
                type: String(code),
                smartCardNo: "",
                productsCode: "",
                packagename: "",
                amount: 0,
              });
              setPackages([]);
              setCustomerName(null);
            }}
            placeholder="e.g. DSTV, GOTV"
          />

          <FormSelect
            label="Select Package"
            icon={CreditCard}
            disabled={!formData.type || isLoadingPackages}
            options={packages.map((p, idx) => ({
              code: p.productsCode || `${p.name}-${idx}`,
              name: `${p.name} - ₦${Number(p.price).toLocaleString()}`,
            }))}
            selectedCode={formData.productsCode}
            onChange={(code) => {
              const selected = packages.find(
                (p, idx) => (p.productsCode || `${p.name}-${idx}`) === code,
              );
              if (selected) {
                setFormData((prev) => ({
                  ...prev,
                  productsCode: String(code),
                  packagename: selected.name,
                  amount: Number(selected.price),
                }));
              }
            }}
            placeholder={
              isLoadingPackages ? "Loading packages..." : "Choose a plan"
            }
          />

          <div className="space-y-2">
            <FormInput
              label="Smart Card / IUC Number"
              icon={Activity}
              placeholder="Enter Number"
              value={formData.smartCardNo}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  smartCardNo: e.target.value,
                }));
                if (customerName) setCustomerName(null);
              }}
              onBlur={validateDecoder}
            />
            {isValidating && (
              <p className="text-[10px] text-brand-gold font-black uppercase tracking-widest animate-pulse px-2">
                Validating Decoder...
              </p>
            )}
            {customerName && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                <UserCheck size={16} className="text-green-500" />
                <div>
                  <p className="text-[8px] text-green-500/60 font-black uppercase tracking-tighter">
                    Verified Customer
                  </p>
                  <p className="text-xs font-black text-green-500 uppercase">
                    {customerName}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <FormInput
              label="Amount"
              icon={Wallet}
              value={
                formData.amount > 0
                  ? `₦${formData.amount.toLocaleString()}`
                  : ""
              }
              disabled
              placeholder="Package price"
            />
            {formData.amount > 0 && !canAfford && (
              <p className="text-[10px] text-red-500 font-bold px-2 flex items-center gap-1">
                <XCircle size={12} /> Insufficient wallet balance
              </p>
            )}
          </div>

          <SubmitButton
            loadingText="Processing..."
            disabled={!canAfford || !isFormValid || isPurchasing || isValidating}
            isLoading={isPurchasing}
            idleText={
              customerName
                ? `Pay ₦${formData.amount.toLocaleString()}`
                : "Validate Decoder"
            }
            className="h-14 rounded-2xl shadow-lg shadow-brand-gold/10"
          />
        </form>
      </Modal>
    </div>
  );
}
