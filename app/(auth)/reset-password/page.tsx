"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, X, ShieldCheck, ArrowLeft } from "lucide-react";
import AuthSidebar from "@/components/AuthSidebar";
import { PasswordInput } from "@/components/common/PasswordInput";
import SubmitButton from "@/components/common/SubmitButton";
import { authApi } from "@/lib/api/auth";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    token: "", // This will be the OTP verified in the previous step
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    // Retrieve the email and the verified OTP from session
    const recoveryEmail = sessionStorage.getItem("recovery_email");
    const verifiedOtp = sessionStorage.getItem("verified_otp");

    if (!recoveryEmail) {
      toast.error("Session expired. Please start over.");
      router.push("/forgot-password");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      email: recoveryEmail,
      token: verifiedOtp || "",
    }));
  }, [router]);

  const strengthRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(formData.password) },
    {
      label: "Special character (@$!%*?)",
      met: /[@$!%*?&]/.test(formData.password),
    },
  ];

  const strengthScore = strengthRequirements.filter((req) => req.met).length;

  const getStrengthColor = () => {
    if (strengthScore === 1) return "bg-red-500";
    if (strengthScore === 2) return "bg-brand-red";
    if (strengthScore === 3) return "bg-emerald-500";
    return "bg-gray-200";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        email: formData.email,
        password: formData.password,
      });

      toast.success("Password updated successfully!");

      // Cleanup session
      sessionStorage.removeItem("recovery_email");

      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row bg-grid-pattern">
      <AuthSidebar title="Secure your" subtitle="new credentials." />

      <div className="flex-1 flex flex-col px-6 py-12 lg:p-20 justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto w-full"
        >
          {/* Success Icon - Emerald stays, but background becomes themed */}
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
            <ShieldCheck size={32} />
          </div>

          <h1 className="text-3xl font-black text-foreground mb-2">
            New Password
          </h1>
          <p className="text-foreground/60 mb-8 font-medium">
            Set a new password for{" "}
            <span className="text-brand-red font-bold">{formData.email}</span>
          </p>

          <form className="space-y-6" onSubmit={handleResetSubmit}>
            <PasswordInput
              label="New Password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
            >
              {/* Strength Indicators */}
              <div className="space-y-4 pt-2">
                <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-full w-1/3 transition-all duration-500 ${strengthScore >= step
                        ? getStrengthColor() // Ensure this function returns Tailwind classes like 'bg-emerald-500'
                        : "bg-foreground/10"
                        }`}
                    />
                  ))}
                </div>

                {/* Requirements List */}
                <div className="space-y-2.5">
                  {strengthRequirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${req.met
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-foreground/5 text-foreground/30"
                          }`}
                      >
                        {req.met ? (
                          <Check size={12} strokeWidth={4} />
                        ) : (
                          <X size={12} strokeWidth={4} />
                        )}
                      </div>
                      <span
                        className={`text-sm font-bold transition-colors ${req.met ? "text-foreground" : "text-foreground/40"
                          }`}
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </PasswordInput>

            <PasswordInput
              label="Confirm Password"
              name="password_confirmation"
              placeholder="••••••••"
              value={formData.password_confirmation}
              onChange={handleInputChange}
            />

            <SubmitButton
              isLoading={isLoading}
              disabled={strengthScore < 3 || !formData.password_confirmation}
              idleText="Update Password"
              loadingText="Updating..."
            />
          </form>

          <Link
            href="/login"
            className="mt-8 flex items-center justify-center gap-2 text-sm font-black text-foreground/40 hover:text-brand-red transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
