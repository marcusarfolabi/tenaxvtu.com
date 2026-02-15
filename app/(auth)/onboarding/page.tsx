"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Mail, ArrowLeft, ShieldAlert, Phone } from "lucide-react";
import AuthSidebar from "@/components/AuthSidebar";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api/auth";
import SubmitButton from "@/components/common/SubmitButton";
import { PasswordInput } from "@/components/common/PasswordInput";
import FormInput from "@/components/common/FormInput";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminPassword: "",
    domain: "",
    supportEmail: "",
    supportContactPhone: "",
    monnifyApiKey: "",
    monnifySecretKey: "",
    monnifyContractCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < totalSteps) {
      nextStep();
      return;
    }

    setIsLoading(true);
    try {
      await authApi.onboarding({
        email: formData.email,
        domain: formData.domain,
        password: formData.password,
        admin_password: formData.adminPassword,
        support_email: formData.supportEmail,
        support_phone: formData.supportContactPhone,
        monnify_key: formData.monnifyApiKey,
        monnify_secret: formData.monnifySecretKey,
        monnify_contract: formData.monnifyContractCode,
      });

      toast.success("Platform configured successfully!", {
        style: {
          border: "1px solid #D4AF37",
          background: "#0A0A0A",
          color: "#fff",
        },
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Onboarding failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <AuthSidebar title="Set up your" subtitle="business information." />

      <div className="flex-1 flex flex-col px-6 py-12 lg:p-20 justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Progress Indicator */}
          <div className="flex items-center gap-4 mb-12">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className="flex-1 h-2 rounded-full relative bg-gray-100 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: step >= num ? "100%" : "0%" }}
                  className="absolute inset-0 bg-brand-gold"
                />
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Authentication */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-black text-brand-black mb-2">
                      Account Access
                    </h1>
                    <p className="text-gray-500 mb-8">
                      Setup your primary login and secure admin access.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormInput
                      label="System Email"
                      name="email"
                      type="email"
                      icon={Mail}
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="honourworld email"
                    />

                    <PasswordInput
                      label="Primary Password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="honourworld password"
                    />

                    <PasswordInput
                      label="System Admin Password (Root)"
                      name="adminPassword"
                      value={formData.adminPassword}
                      onChange={handleInputChange}
                      icon={ShieldAlert}
                      placeholder="preferred password for admin dashboard"
                      className="border-red-100! focus:border-red-500!"
                    >
                      <p className="text-[10px] text-gray-400 mt-1">
                        This password is used for high-level system
                        configurations.
                      </p>
                    </PasswordInput>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Business Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-black text-brand-black mb-2">
                      Business Details
                    </h1>
                    <p className="text-gray-500 mb-8">
                      Where will your platform be hosted and how can users reach
                      you?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormInput
                      label="Target Domain Name"
                      name="domain"
                      type="url"
                      icon={Globe}
                      value={formData.domain}
                      onChange={handleInputChange}
                      placeholder="https://kakalinks.com"
                    />

                    <FormInput
                      label="Support Email"
                      name="supportEmail"
                      type="email"
                      icon={Mail}
                      value={formData.supportEmail}
                      onChange={handleInputChange}
                      placeholder="support@kakalinks.com"
                    />

                    <FormInput
                      label="Support Phone Number"
                      name="supportContactPhone"
                      type="tel"
                      icon={Phone}
                      value={formData.supportContactPhone}
                      onChange={handleInputChange}
                      placeholder="2349035155129"
                      pattern="^234[0-9]{10}$"
                      title="Format: 234 followed by 10 digits (e.g., 2349035155129)"
                    />
                    <p className="text-[10px] text-gray-400 -mt-2">
                      Must start with 234 followed by 10 digits.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Gateway */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-black text-brand-black">
                        Payment Gateway
                      </h1>
                      <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-1 rounded-full font-bold uppercase">
                        Monnify
                      </span>
                    </div>
                    <p className="text-gray-500 mb-8">
                      Connect your Monnify keys to start processing payments.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Note: Monnify inputs usually don't need icons, but we'll use Globe or Shield as placeholders or pass null if your component allows */}
                    <FormInput
                      label="API Key"
                      name="monnifyApiKey"
                      icon={ShieldAlert}
                      value={formData.monnifyApiKey}
                      onChange={handleInputChange}
                      placeholder="MK_PROD_..."
                      className="font-mono text-sm"
                    />
                    <FormInput
                      label="Secret Key"
                      name="monnifySecretKey"
                      type="password"
                      icon={Lock}
                      value={formData.monnifySecretKey}
                      onChange={handleInputChange}
                      placeholder="••••••••••••"
                      className="font-mono text-sm"
                    />
                    <FormInput
                      label="Contract Code"
                      name="monnifyContractCode"
                      icon={Globe}
                      value={formData.monnifyContractCode}
                      onChange={handleInputChange}
                      placeholder="8273645210"
                      className="font-mono text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ... Navigation buttons remain same ... */}
          </form>
        </div>
      </div>
    </div>
  );
}
