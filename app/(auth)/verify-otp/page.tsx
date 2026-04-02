"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import AuthSidebar from "@/components/AuthSidebar";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api/auth";
import SubmitButton from "@/components/common/SubmitButton";

export default function VerifyOTP() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isResetFlow, setIsResetFlow] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const registrationEmail = sessionStorage.getItem(
      "pending_verification_email",
    );
    const recoveryEmail = sessionStorage.getItem("recovery_email");

    // Fix: Check if EITHER exists, not both
    if (recoveryEmail) {
      setEmail(recoveryEmail);
      setIsResetFlow(true);
    } else if (registrationEmail) {
      setEmail(registrationEmail);
      setIsResetFlow(false);
    } else {
      toast.error("Session expired. Please restart.");
      router.push("/register");
    }
  }, [router]);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const submitOtp = async (finalOtp: string) => {
    if (finalOtp.length < 6 || isLoading) return;

    setIsLoading(true);
    try {
      if (isResetFlow) {
        // Flow A: Password Reset Identity Confirmation
        await authApi.verifyEmail({ email, otp: finalOtp });
        toast.success("Identity confirmed!");
        router.push("/reset-password");
      } else {
        // Flow B: New Account Verification
        await authApi.verifyEmail({ email, otp: finalOtp });
        toast.success("Account verified! You can now login.");

        sessionStorage.removeItem("pending_verification_email");
        router.push("/login");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Invalid or expired code.";
      toast.error(errorMsg);
      // Reset OTP fields on error for a better UX
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are filled
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === 6) {
      submitOtp(combinedOtp);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      toast.error("Numbers only, please.");
      return;
    }

    const newOtp = [...otp];
    pastedData.split("").forEach((digit, i) => (newOtp[i] = digit));
    setOtp(newOtp);

    if (pastedData.length === 6) {
      submitOtp(pastedData);
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await authApi.resendOtp({ email });
      setOtp(new Array(6).fill(""));
      setTimer(60);
      setCanResend(false);
      toast.success("A fresh code has been sent!");
    } catch (error: any) {
      toast.error("Resend failed. Try again shortly.");
    }
  };

  const maskedEmail = email
    ? email.replace(
      /(.{2})(.*)(?=@)/,
      (_, gp1, gp2) => gp1 + "*".repeat(gp2.length),
    )
    : "";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row bg-grid-pattern">
      <AuthSidebar title="Check your email" subtitle="for the security code." />

      <div className="flex-1 flex flex-col px-6 py-12 lg:p-20 justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto w-full"
        >
          <div className="w-16 h-16 bg-brand-red/10 rounded-2xl flex items-center justify-center text-brand-red mb-8 shadow-lg shadow-brand-red/5">
            <Mail size={32} />
          </div>

          <h1 className="text-3xl font-black text-foreground mb-2">
            Verify {isResetFlow ? "Identity" : "Account"}
          </h1>
          <p className="text-foreground/60 mb-10 font-medium">
            We sent a 6-digit code to{" "}
            <span className="text-brand-red font-bold">
              {maskedEmail || "your email"}
            </span>
          </p>

          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              submitOtp(otp.join(""));
            }}
          >
            {/* OTP Input Grid */}
            <div className="flex justify-between gap-2 md:gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  value={data}
                  onPaste={handlePaste}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-black bg-foreground/5 border-2 border-foreground/10 rounded-2xl focus:border-brand-red focus:bg-background focus:ring-4 focus:ring-brand-red/10 text-foreground outline-none transition-all"
                />
              ))}
            </div>

            <SubmitButton
              isLoading={isLoading}
              idleText="Verify Code"
              loadingText="Verifying..."
            />
          </form>

          <div className="mt-8 text-center min-h-10">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="flex items-center gap-2 mx-auto text-sm font-black text-brand-red hover:opacity-80 transition-all active:scale-95"
              >
                <RefreshCw size={16} />
                Resend Code
              </button>
            ) : (
              <p className="text-sm font-medium text-foreground/40">
                Resend code in{" "}
                <span className="text-foreground font-bold tabular-nums">
                  0:{timer < 10 ? `0${timer}` : timer}
                </span>
              </p>
            )}
          </div>

          <Link
            href="/login"
            className="mt-12 flex items-center justify-center gap-2 text-sm font-black text-foreground/40 hover:text-brand-red transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
