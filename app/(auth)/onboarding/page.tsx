"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Mail, ArrowLeft, ShieldAlert, Lock, Phone as PhoneIcon, Briefcase } from "lucide-react";
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
    name: "",
    password: "",
    adminPassword: "",
    domain: process.env.NEXT_PUBLIC_APP_URL || "",
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "",
    supportContactPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "",
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
        name: formData.name,
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

      router.push("/account");
    } catch (error: any) {
      const validationErrors = error.response?.data?.errors;
      let errorMessage = error.response?.data?.message || "Onboarding failed. Please check your credentials.";

      if (validationErrors) { 
        const firstErrorField = Object.values(validationErrors)[0] as string[];
        if (firstErrorField && firstErrorField.length > 0) {
          errorMessage = firstErrorField[0];
        }
      }

      toast.error(errorMessage, {
        style: {
          borderRadius: '16px',
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(139,26,26,0.5)',
        },
        iconTheme: {
          primary: '#8b1a1a',
          secondary: '#fff',
        },
      });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row bg-grid-pattern">
      <AuthSidebar title="Set up your" subtitle="business information." />

      <div className="flex-1 flex flex-col px-6 py-12 lg:p-20 justify-center relative z-10">
        <div className="max-w-md mx-auto w-full">
          {/* Progress Indicator - Themed */}
          <div className="flex items-center gap-4 mb-12">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                // Changed bg-gray-100 to themed foreground opacity
                className="flex-1 h-2 rounded-full relative bg-foreground/10 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: step >= num ? "100%" : "0%" }}
                  className="absolute inset-0 bg-brand-red shadow-[0_0_10px_rgba(212,175,55,0.3)]"
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
                    <h1 className="text-3xl font-black text-foreground mb-2">
                      Account Access
                    </h1>
                    <p className="text-foreground/60 mb-8 font-medium">
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
                    >
                      <p className="text-[10px] text-foreground/40 mt-1 italic">
                        This password will be used to access this dashboard.
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
                    <h1 className="text-3xl font-black text-foreground mb-2">
                      Business Details
                    </h1>
                    <p className="text-foreground/60 mb-8 font-medium">
                      Where will your platform be hosted and how can users reach
                      you?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormInput
                      label="Business Name"
                      name="name"
                      type="text"
                      icon={Briefcase}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="ABC Enterprises"
                    />
                    <FormInput
                      label="Target Domain Name"
                      name="domain"
                      type="url"
                      icon={Globe}
                      value={formData.domain}
                      onChange={handleInputChange}
                      placeholder="https://yourdomain.com"
                    />

                    <FormInput
                      label="Support Email"
                      name="supportEmail"
                      type="email"
                      icon={Mail}
                      value={formData.supportEmail}
                      onChange={handleInputChange}
                      placeholder="support@example.com"
                    />

                    <FormInput
                      label="Support Phone Number"
                      name="supportContactPhone"
                      type="tel"
                      maxLength={13}
                      icon={PhoneIcon}
                      value={formData.supportContactPhone} 
                      onChange={handleInputChange}
                      placeholder="234..."
                    />
                    <p className="text-[10px] text-foreground/40 -mt-2 font-bold uppercase tracking-wider">
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
                      <h1 className="text-3xl font-black text-foreground">
                        Payment Gateway
                      </h1>
                      <span className="bg-brand-red/20 text-brand-red text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest border border-brand-red/30">
                        Monnify
                      </span>
                    </div>
                    <p className="text-foreground/60 mb-8 font-medium">
                      Connect your Monnify keys to start processing payments.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormInput
                      label="API Key"
                      name="monnifyApiKey"
                      icon={ShieldAlert}
                      value={formData.monnifyApiKey}
                      onChange={handleInputChange}
                      placeholder="MK_PROD_..."
                      className="font-mono text-sm"
                      autoComplete="one-time-code"
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
                      autoComplete="off"
                    />
                    <FormInput
                      label="Contract Code"
                      name="monnifyContractCode"
                      icon={Globe}
                      value={formData.monnifyContractCode}
                      onChange={handleInputChange}
                      placeholder="0••••••9"
                      className="font-mono text-sm"
                      autoComplete="off"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex items-center gap-4 w-full">
              {step > 1 && !isLoading && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 h-16 cursor-pointer rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] border-2 border-brand-red/30 text-foreground hover:bg-brand-red/10 hover:border-brand-red"
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              <SubmitButton
                isLoading={isLoading}
                idleText={step === 3 ? "Finish Setup" : "Next Step"}
                loadingText="Configuring System..."
                className={step > 1 ? "flex-1" : "w-full"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
