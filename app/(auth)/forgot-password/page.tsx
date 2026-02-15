"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, KeyRound, ShieldCheck } from "lucide-react";
import AuthSidebar from "@/components/AuthSidebar";
import { toast } from "react-hot-toast";
import { authApi } from "@/lib/api/auth";
import FormInput from "@/components/common/FormInput";
import SubmitButton from "@/components/common/SubmitButton";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email: cleanEmail });
      sessionStorage.setItem("recovery_email", cleanEmail);
      toast.success("OTP sent! Please check your email.");
      router.push("/verify-otp");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <AuthSidebar title="Recover your" subtitle="account access." />

      <div className="flex-1 flex flex-col px-6 py-12 lg:p-20 justify-center">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-12">
          <Link
            href="/login"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <span className="font-black tracking-tighter text-xl text-brand-black">
            KAKALINKS
          </span>
          <div className="w-10" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto w-full"
        >
          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-brand-gold mb-8 shadow-sm">
            <KeyRound size={32} />
          </div>

          <h1 className="text-3xl font-black text-brand-black mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-500 mb-8 font-medium">
            Enter the email associated with your account and we&apos;ll send a
            six digit OTP code to reset your password.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@example.com"
              icon={Mail}
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />

            {/* Reusable Submit Button */}
            <SubmitButton
            
              isLoading={isLoading}
              idleText="Send Reset Link"
              loadingText="Sending OTP..."
            />
          </form>

          {/* Security Note */}
          <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
            <ShieldCheck className="text-emerald-600 shrink-0" size={18} />
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              For your security, we never send passwords via email. You must use
              the six digit OTP code provided to set a new one.
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-brand-black transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
