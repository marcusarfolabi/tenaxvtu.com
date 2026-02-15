"use client";
import { ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { useEffect, useState } from "react";

export default function AuthSidebar({
  title = "Join the most reliable",
  subtitle = "payment network.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // While mounting, show a neutral background to prevent the "interchange" flicker
  if (!mounted) {
    return (
      <div className="hidden lg:flex lg:w-1/2 bg-background min-h-screen" />
    );
  }

  return (
    <>
      {/* 1. MOBILE VIEW */}
      <div className="lg:hidden w-full bg-foreground/[0.03] border-b border-foreground/5 py-6 px-6 flex items-center justify-center relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        <Logo />
      </div>

      {/* 2. DESKTOP VIEW */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground/[0.03] p-16 flex-col justify-between relative overflow-hidden min-h-screen transition-colors duration-500">
        <div className="absolute inset-0 bg-background/50 dark:bg-transparent pointer-events-none" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] dark:opacity-[0.02] pointer-events-none" />

        <div className="relative z-10">
          <Logo />
        </div>
        <div className="relative z-10">
          <h2 className="text-6xl font-black text-foreground leading-none mb-8 tracking-tighter">
            {title} <br />
            <span className="text-brand-gold">{subtitle}</span>
          </h2>

          <div className="space-y-5">
            {["No hidden fees", "Instant delivery", "Secure transactions"].map(
              (text) => (
                <div
                  key={text}
                  className="flex items-center gap-4 text-foreground/70 text-lg font-bold tracking-tight"
                >
                  <div className="bg-brand-gold/10 p-1.5 rounded-xl">
                    <ShieldCheck className="text-brand-gold" size={20} />
                  </div>
                  {text}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="h-px w-8 bg-brand-gold/30" />
          <p className="text-foreground/30 text-[10px] font-black uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Kakalinks Infrastructure.
          </p>
        </div>

        {/* Decorative glow: Opacity is tied to theme mode */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none opacity-40 dark:opacity-20" />
      </div>
    </>
  );
}
