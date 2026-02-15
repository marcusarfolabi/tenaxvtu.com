"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Lock,
  Mail,
  ChevronRight,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import AuthSidebar from "@/components/AuthSidebar";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api/auth";
import SubmitButton from "@/components/common/SubmitButton";
import { PasswordInput } from "@/components/common/PasswordInput";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 3;

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminPassword: "",
    domain: "",
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
                    <div className="space-y-2">
                      <label className="label-primary">System Email</label>
                      <div className="relative">
                        <input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="honourworld email"
                          className="input-primary pl-12"
                        />
                        <Mail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                    </div>
                    {/* HonourWorld Password */}
                    <PasswordInput
                      label="Primary Password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="honourworld password"
                    />

                    {/* Admin Root Password */}
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
                      Domain Settings
                    </h1>
                    <p className="text-gray-500 mb-8">
                      Where will your platform be hosted?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="label-primary">
                        Target Domain Name
                      </label>
                      <div className="relative">
                        <input
                          name="domain"
                          type="url"
                          required
                          value={formData.domain}
                          onChange={handleInputChange}
                          placeholder="https://vtubusiness.com"
                          className="input-primary pl-12"
                        />
                        <Globe
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

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
                    <div className="space-y-2">
                      <label className="label-primary">API Key</label>
                      <input
                        name="monnifyApiKey"
                        type="text"
                        required
                        value={formData.monnifyApiKey}
                        onChange={handleInputChange}
                        placeholder="MK_PROD_..."
                        className="input-primary text-sm font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="label-primary">Secret Key</label>
                      <input
                        name="monnifySecretKey"
                        type="password"
                        required
                        value={formData.monnifySecretKey}
                        onChange={handleInputChange}
                        placeholder="••••••••••••"
                        className="input-primary text-sm font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="label-primary">Contract Code</label>
                      <input
                        name="monnifyContractCode"
                        type="text"
                        required
                        value={formData.monnifyContractCode}
                        onChange={handleInputChange}
                        placeholder="8273645210"
                        className="input-primary text-sm font-mono"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center gap-4 w-full">
              {step > 1 && !isLoading && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 h-16 cursor-pointer rounded-2xl font-black text-lg transition-all shadow-xl shadow-black/5 mt-4 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
        border-brand-gold text-black border
        hover:bg-brand-black hover:text-brand-gold"
                >
                  <ArrowLeft size={20} /> Back
                </button>
              )}

              <SubmitButton
                isLoading={isLoading}
                idleText={step === totalSteps ? "Finish Setup" : "Next Step"}
                loadingText="Configuring System..."
                // If step > 1, it takes the remaining 2/3 space. If step 1, it takes 100%.
                className={step > 1 ? "flex-1" : "w-full"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
