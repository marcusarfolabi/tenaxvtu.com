"use client";
import { useState } from "react";
import FormInput from "@/components/common/FormInput";
import SubmitButton from "@/components/common/SubmitButton";
import {
  Fingerprint,
  CreditCard,
  Calendar,
  User,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { profileApi } from "@/lib/api/profile";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function VerifyIdentity() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    bvn: "",
    nin: "",
    first_name: "",
    last_name: "",
    dob: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Logic Check: Ensure either BVN or NIN is present
    if (!formData.bvn && !formData.nin) {
      return toast.error("Please provide either your BVN or NIN");
    }

    // 2. Standard Validation
    if (!formData.first_name || !formData.last_name || !formData.dob) {
      return toast.error("Please fill in all required legal information");
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        mobile_phone: user?.phone || "",
      };

      await profileApi.verifyIdentity(payload);

      toast.success("Identity verification submitted successfully!");

      if (refreshUser) {
        await refreshUser();
      }

      setTimeout(() => {
        toast.success("Virtual account is now provisioned!");
        router.push("/account/virtual-accounts");
      }, 2000);
    } catch (error: any) {
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 pb-20">
      <div className="text-center space-y-3">
        {/* Shield icon for trust */}
        <div className="mx-auto w-16 h-16 bg-brand-red/10 rounded-3xl flex items-center justify-center mb-4">
          <ShieldCheck size={32} className="text-brand-red" />
        </div>
        <h1 className="text-2xl font-black text-foreground tracking-tight">
          Identity Verification
        </h1>
        <p className="text-foreground/50 text-xs font-medium max-w-70 mx-auto leading-relaxed">
          To comply with{" "}
          <span className="text-foreground font-bold">CBN regulations</span> and
          secure your account, please verify your details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-background p-6 rounded-[2.5rem] border border-foreground/5 shadow-2xl space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Legal First Name"
            icon={User}
            required
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
          />
          <FormInput
            label="Legal Last Name"
            icon={User}
            required
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
          />
        </div>

        <FormInput
          label="Date of Birth"
          type="date"
          icon={Calendar}
          required
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        />

        <div className="pt-4 border-t border-foreground/5">
          <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-6">
            Identity Documents
          </p>

          <FormInput
            label="Bank Verification Number (BVN)"
            placeholder="222********"
            icon={Fingerprint}
            value={formData.bvn}
            maxLength={11}
            required={false}
            inputMode="numeric"
            onChange={(e) => setFormData({ ...formData, bvn: e.target.value })}
          />

          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-foreground/5"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-background px-4 text-foreground/20 font-black tracking-widest">
                Official Alternate
              </span>
            </div>
          </div>

          <FormInput
            label="National Identity Number (NIN)"
            placeholder="Enter 11-digit NIN"
            icon={CreditCard}
            value={formData.nin}
            inputMode="numeric"
            maxLength={11}
            required={false}
            onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
          />
        </div>

        <div className="pt-2">
          <SubmitButton
            isLoading={loading}
            loadingText="Verifying..."
            idleText="Securely Submit Details"
            className="h-14 rounded-2xl w-full shadow-lg shadow-brand-red/10"
          />
          <p className="mt-4 text-center text-[9px] text-foreground/30 font-bold uppercase tracking-tighter">
            🔒 Your data is encrypted and never stored in plain text
          </p>
        </div>
      </form>
    </div>
  );
}
