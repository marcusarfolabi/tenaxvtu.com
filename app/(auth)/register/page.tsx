"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  User,
  Phone,
  ShieldCheck,
} from "lucide-react";
import AuthSidebar from "@/components/AuthSidebar";
import { getUserCurrency } from "@/util/getUserCurrency";
import { authApi } from "@/lib/api/auth";
import SubmitButton from "@/components/common/SubmitButton";
import { PasswordInput } from "@/components/common/PasswordInput";
import FormInput from "@/components/common/FormInput";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false); // New State for Terms

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("You must agree to the Terms and Privacy Policy");
      return;
    }
    
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        currency: getUserCurrency(),
      };

      await authApi.register(dataToSubmit);

      sessionStorage.setItem("pending_verification_email", formData.email);

      toast.success("Account created! Please verify your email");

      router.push("/verify-otp");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

 return (
    // Updated container with background and grid logic
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row bg-grid-pattern">
      <AuthSidebar title="Join the most reliable" subtitle="payment network." />

      <div className="flex-1 flex flex-col px-6 py-12 lg:p-20 justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto w-full"
        >
          <h1 className="text-3xl font-black text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-foreground/60 mb-8 font-medium">
            Start saving on your data and bills today.
          </p>

          <form className="space-y-5" onSubmit={handleRegister}>
            {/* Grid for First/Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                name="name"
                placeholder="John"
                icon={User}
                autoComplete="given-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <FormInput
                label="Last Name"
                name="lastname"
                placeholder="Mary"
                icon={User}
                autoComplete="family-name"
                value={formData.lastname}
                onChange={(e) =>
                  setFormData({ ...formData, lastname: e.target.value })
                }
              />
            </div>

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="john.mary@gmail.com"
              icon={Mail}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="08033440133"
              minLength={11}
              icon={Phone}
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <PasswordInput
              label="Password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            {/* Themed Consent Checkbox */}
            <div className="flex items-start gap-3 py-2">
              <div className="relative flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  // Swapped accent-brand-black for gold and added border-foreground/20
                  className="w-5 h-5 border-2 border-foreground/20 rounded text-brand-gold focus:ring-brand-gold cursor-pointer accent-brand-gold bg-background transition-colors"
                />
              </div>
              <label htmlFor="terms" className="text-xs font-medium text-foreground/60 leading-tight cursor-pointer">
                I agree to the <Link href="/terms" className="text-brand-gold font-bold hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-brand-gold font-bold hover:underline">Privacy Policy</Link> (including identity verification via BVN/NIN as per CBN guidelines).
              </label>
            </div>

            <SubmitButton
              isLoading={isLoading}
              idleText="Create My Account"
              loadingText="Creating Account..."
              disabled={!agreed}
            />
          </form>

          <div className="mt-8 text-center">
            <p className="text-foreground/60 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-brand-gold font-black hover:underline transition-all"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}