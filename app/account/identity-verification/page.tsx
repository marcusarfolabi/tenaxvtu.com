"use client";
import { useState } from "react";
import FormInput from "@/components/common/FormInput";
import SubmitButton from "@/components/common/SubmitButton";
import { Fingerprint, CreditCard, Calendar, User } from "lucide-react";
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
      // Prepare data for API (including mobile_phone from auth user)
      const payload = {
        ...formData,
        mobile_phone: user?.phone || "",
      };

      await profileApi.verifyIdentity(payload);

      toast.success("Identity verification submitted successfully!");

      if (refreshUser) {
        await refreshUser();
      }

      // Redirect to account after a short delay
      setTimeout(() => {
        router.push("/account");
      }, 2000);
    } catch (error: any) {
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-brand-black">
          Identity Verification
        </h1>
        <p className="text-gray-500 text-sm">
          We need to verify your identity to comply with CBN regulations.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 gap-6">
          <FormInput
            label="Legal FirstName"
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

        <div className="pt-2 border-t border-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
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

          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-black">OR</span>
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

        <SubmitButton
          isLoading={loading}
          loadingText="Processing..."
          idleText="Submit for Verification"
          className="h-14 rounded-2xl w-full"
        />
      </form>
    </div>
  );
}
