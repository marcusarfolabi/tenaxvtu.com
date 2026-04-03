"use client";
import { useState } from "react";
import FormInput from "@/components/common/FormInput";
import SubmitButton from "@/components/common/SubmitButton";
import { Fingerprint, CreditCard, Calendar, User, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { profileApi } from "@/lib/api/profile";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function VerifyIdentity() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"BVN" | "NIN">("BVN"); // State to toggle method

  const [formData, setFormData] = useState({
    bvn: "",
    nin: "",
    first_name: "",
    last_name: "",
    dob: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Logic Check based on selected method
    const identifier = method === "BVN" ? formData.bvn : formData.nin;
    if (!identifier || identifier.length < 11) {
      return toast.error(`Please provide a valid 11-digit ${method}`);
    }

    if (!formData.first_name || !formData.last_name || !formData.dob) {
      return toast.error("Please fill in all legal information");
    }

    setLoading(true);
    try {
      // Create payload ensuring only the chosen identifier is sent clearly
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        dob: formData.dob,
        bvn: method === "BVN" ? formData.bvn : "",
        nin: method === "NIN" ? formData.nin : "",
        mobile_phone: user?.phone || "",
      };

      await profileApi.verifyIdentity(payload);
      toast.success("Identity verified!");

      if (refreshUser) await refreshUser();

      setTimeout(() => {
        router.push("/account/virtual-accounts");
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 bg-brand-red/10 rounded-[1.5rem] flex items-center justify-center mb-2">
          <ShieldCheck size={28} className="text-brand-red" />
        </div>
        <h1 className="text-xl font-black text-foreground uppercase tracking-tight">
          Verify Identity
        </h1>
        <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
          Choose <span className="text-brand-red">ONE</span> method to verify your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-background p-6 rounded-[2.5rem] border border-foreground/5 shadow-2xl space-y-6">

        {/* METHOD TOGGLE - Brief & Direct */}
        <div className="flex p-1 bg-foreground/5 rounded-2xl border border-foreground/5">
          {(["BVN", "NIN"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${method === m
                  ? "bg-foreground text-background shadow-lg"
                  : "text-foreground/40 hover:text-foreground"
                }`}
            >
              USE {m}
            </button>
          ))}
        </div>

        {/* Conditional Identifier Input */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {method === "BVN" ? (
            <FormInput
              label="Bank Verification Number (BVN)"
              placeholder="222********"
              icon={Fingerprint}
              value={formData.bvn}
              maxLength={11}
              inputMode="numeric"
              onChange={(e) => setFormData({ ...formData, bvn: e.target.value, nin: "" })}
            />
          ) : (
            <FormInput
              label="National Identity Number (NIN)"
                placeholder="111********"
              icon={CreditCard}
              value={formData.nin}
              maxLength={11}
              inputMode="numeric"
              onChange={(e) => setFormData({ ...formData, nin: e.target.value, bvn: "" })}
            />
          )}
        </div>

        <div className="pt-4 border-t border-foreground/5 space-y-4">
          <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Legal Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              icon={User}
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
            <FormInput
              label="Last Name"
              icon={User}
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
          <FormInput
            label="Date of Birth"
            type="date"
            icon={Calendar}
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
        </div>

        <SubmitButton
          isLoading={loading}
          loadingText="Verifying..."
          idleText={`Verify with ${method}`}
          className="h-14 rounded-2xl w-full shadow-lg shadow-brand-red/10"
        />
      </form>
    </div>
  );
}