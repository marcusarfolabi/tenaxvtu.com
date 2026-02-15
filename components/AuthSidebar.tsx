"use client";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface AuthSidebarProps {
  title?: string;
  subtitle?: string;
}

export default function AuthSidebar({ 
  title = "Join the most reliable", 
  subtitle = "payment network." 
}: AuthSidebarProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* 1. MOBILE VIEW: Uses themed background and border */}
      <div className="lg:hidden w-full bg-secondary border-t-4 border-brand-gold py-4 px-6 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <Logo inverted={mounted ? resolvedTheme === "dark" : true} />
      </div>

      {/* 2. DESKTOP VIEW: Background switches based on theme */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary p-12 flex-col justify-between relative overflow-hidden min-h-screen transition-colors duration-300">
        {/* Background Pattern - opacity tweak for visibility */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5 pointer-events-none" />
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 relative z-10 group">
          <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-black transition-transform group-hover:rotate-12">
            <span className="font-extrabold text-xl">K</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground">
            KAKALINKS
          </span>
        </Link>

        {/* Dynamic Content */}
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-foreground leading-[1.1] mb-6 tracking-tighter">
            {title} <br />
            <span className="text-brand-gold">{subtitle}</span>
          </h2>
          
          <div className="space-y-4">
            {["No hidden fees", "Instant delivery", "Secure transactions"].map((text) => (
              <div key={text} className="flex items-center gap-3 text-muted-foreground font-medium">
                <ShieldCheck className="text-brand-gold" size={20} />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-muted-foreground/60 text-sm relative z-10">
          © {new Date().getFullYear()} Kakalinks Utility Payment Platform.
        </p>
      </div>
    </>
  );
}