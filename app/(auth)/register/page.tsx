"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, User, Phone, ShieldCheck } from "lucide-react";
import AuthSidebar from "@/components/AuthSidebar";
import { getUserCurrency } from "@/util/getUserCurrency";
import { authApi } from "@/lib/api/auth";
import SubmitButton from "@/components/common/SubmitButton";
import { PasswordInput } from "@/components/common/PasswordInput";
import FormInput from "@/components/common/FormInput";

import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      toast.error("Security system not ready. Please refresh.");
      return;
    }

    if (!agreed) {
      toast.error("You must agree to the Terms and Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      const token = await executeRecaptcha("register_user");

      const dataToSubmit = {
        ...formData,
        currency: getUserCurrency(),
        captcha_token: token,
      };

      await authApi.register(dataToSubmit);

      sessionStorage.setItem("pending_verification_email", formData.email);

      toast.success("Account created! Please verify your email");

      router.push("/verify-otp");
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 429) {
        toast.error("Security Alert: Too many attempts.", { icon: "🛡️" });
      } else if (status === 422 && data.errors) {
        const firstError = Object.values(data.errors)[0];
        const message = Array.isArray(firstError) ? firstError[0] : firstError;

        toast.error(message || "Please check your input details.");
      } else {
        toast.error(data?.message || "Registration failed. Try again later.");
      }
    }
  };

  return (
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

          <form className="space-y-5" onSubmit={handleRegister} method="POST">
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
              maxLength={11}
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

            <div className="flex items-start gap-3 py-2">
              <div className="relative flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 border-2 border-foreground/20 rounded text-brand-red focus:ring-brand-red cursor-pointer accent-brand-red bg-background transition-colors"
                />
              </div>
              <label
                htmlFor="terms"
                className="text-xs font-medium text-foreground/60 leading-tight cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-brand-red font-bold hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-brand-red font-bold hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                (including identity verification via BVN/NIN as per CBN
                guidelines).
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
                className="text-brand-red font-black hover:underline transition-all"
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

export default function Register() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6Leeh24sAAAAAEB3XFgWSOPzxhx_dq4BY-LWWr61">
      <RegisterForm />
    </GoogleReCaptchaProvider>
  );
}
