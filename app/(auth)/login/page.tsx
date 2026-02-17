"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import AuthSidebar from "@/components/AuthSidebar";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import SubmitButton from "@/components/common/SubmitButton";
import { PasswordInput } from "@/components/common/PasswordInput";
import FormInput from "@/components/common/FormInput";

export default function Login() {
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("Please fill in all fields");
    }

    setIsLoading(true);
    try {
      await login(formData);
    } catch (err: any) {
      toast.error(err.message || "Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Changed bg-white to bg-background and added the grid pattern
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row bg-grid-pattern">
      <AuthSidebar title="Welcome back to" subtitle="your dashboard." />

      <div className="flex-1 flex flex-col px-6 py-12 lg:p-20 justify-center relative z-10">
        <div className="lg:hidden flex items-center justify-between mb-12">
          <Link
            href="/"
            // Swapped hover:bg-gray-100 for a themed opacity
            className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          {/* text-brand-black -> text-foreground */}
          <span className="font-black tracking-tighter text-xl text-foreground">
            KAKALINKS
          </span>
          <div className="w-10" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto w-full"
        >
          {/* text-brand-black -> text-foreground */}
          <h1 className="text-3xl font-black text-foreground mb-2">
            Login to Account
          </h1>
          {/* text-gray-500 -> text-foreground/60 */}
          <p className="text-foreground/60 mb-8 font-medium">
            Continue saving on your data and bills today.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit} method="POST"> 
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username" 
              placeholder="john@example.com"
              icon={Mail}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
 
            <PasswordInput
              label="Password"
              name="password"
              autoComplete="current-password"  
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            >
              <div className="flex items-center justify-between mt-1">
                <Link
                  href="/forgot-password"
                  // Using text-foreground/40 for that subtle "muted" look
                  className="text-xs font-bold text-foreground/40 hover:text-brand-gold transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </PasswordInput>

            <SubmitButton
              isLoading={isLoading}
              idleText="Login to Dashboard"
              loadingText="Authenticating..."
              className="w-full mt-2" 
            />
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-foreground/60 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-brand-gold font-black hover:underline transition-all"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
