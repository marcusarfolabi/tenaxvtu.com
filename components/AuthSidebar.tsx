"use client";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";

interface AuthSidebarProps {
  title?: string;
  subtitle?: string;
}

export default function AuthSidebar({ 
  title = "Join the most reliable", 
  subtitle = "payment network." 
}: AuthSidebarProps) {
  return (
    <>
      {/* 1. MOBILE VIEW ONLY: Slim Header Bar */}
      <div className="lg:hidden w-full bg-brand-black border-t-4 border-brand-gold py-4 px-6 flex items-center justify-center relative overflow-hidden">
        {/* Subtle pattern for mobile too */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        
        <Logo inverted={true} />
      </div>

      {/* 2. DESKTOP VIEW ONLY: Full Sidebar */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-black p-12 flex-col justify-between relative overflow-hidden min-h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-10 group">
          <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-brand-black transition-transform group-hover:rotate-12">
            <span className="font-extrabold text-xl">K</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            KAKALINKS
          </span>
        </Link>

        {/* Dynamic Content */}
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
            {title} <br />
            <span className="text-brand-gold">{subtitle}</span>
          </h2>
          
          <div className="space-y-4">
            {["No hidden fees", "Instant delivery", "Secure transactions"].map((text) => (
              <div key={text} className="flex items-center gap-3 text-gray-400 font-medium">
                <ShieldCheck className="text-brand-gold" size={20} />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-gray-500 text-sm relative z-10">
          © {new Date().getFullYear()} Kakalinks Utility Payment Platform.
        </p>
      </div>
    </>
  );
}