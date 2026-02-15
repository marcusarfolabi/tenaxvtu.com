"use client";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { useEffect, useState } from "react";

interface AuthSidebarProps {
  title?: string;
  subtitle?: string;
}

export default function AuthSidebar({ 
  title = "Join the most reliable", 
  subtitle = "payment network." 
}: AuthSidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avoid rendering theme-specific elements until mounted to prevent hydration flicker
  if (!mounted) return null;

  return (
    <>
      {/* 1. MOBILE VIEW: Adapts via CSS Variables */}
      <div className="lg:hidden w-full bg-secondary border-b border-foreground/5 py-6 px-6 flex items-center justify-center relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        <div className="relative z-10">
           <Logo />
        </div>
      </div>

      {/* 2. DESKTOP VIEW: Smart secondary background */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary p-16 flex-col justify-between relative overflow-hidden min-h-screen transition-colors duration-500 border-r border-foreground/5">
        
        {/* Themed Grid Pattern: Dark mode gets less opacity to avoid looking "busy" */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.07] dark:opacity-[0.03] pointer-events-none" />
        
        {/* Logo Section - Using your existing Logo component for consistency */}
        <div className="relative z-10">
          <Logo />
        </div>

        {/* Dynamic Content */}
        <div className="relative z-10">
          <h2 className="text-6xl font-black text-foreground leading-none mb-8 tracking-tighter">
            {title} <br />
            <span className="text-brand-gold">{subtitle}</span>
          </h2>
          
          <div className="space-y-5">
            {[
              "No hidden fees", 
              "Instant delivery", 
              "Secure transactions"
            ].map((text) => (
              <div key={text} className="flex items-center gap-4 text-foreground/60 text-lg font-bold tracking-tight">
                <div className="bg-brand-gold/10 p-1 rounded-lg">
                   <ShieldCheck className="text-brand-gold" size={22} />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 flex items-center gap-4">
           <div className="h-px w-8 bg-brand-gold/30" />
           <p className="text-foreground/30 text-[10px] font-black uppercase tracking-[0.2em]">
             © {new Date().getFullYear()} Kakalinks Utility Bill Payment.
           </p>
        </div>
        
        {/* Decorative Blur for Dark Mode depth */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </>
  );
}