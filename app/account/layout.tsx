"use client";
import { useState } from "react";
import TopHeader from "./components/TopHeader";
import Sidebar from "./components/Sidebar";
import VerificationBanner from "@/components/common/VerificationBanner";
import {
  MessageCircle,
  LayoutGrid,
  ArrowUpRight,
  History,
  UserCircle2,
  CreditCard
} from "lucide-react";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { ACCOUNT_MENU } from "@/settings";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const whatsappNumber = process.env.NEXT_PUBLIC_SUPPORT_PHONE;
  const message = encodeURIComponent(
    `Hello ${process.env.NEXT_PUBLIC_APP_NAME} Support, I need assistance.`
  ); 

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background relative transition-colors duration-300 pb-20 lg:pb-0">

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
          <div className="flex grow flex-col bg-background shadow-2xl border-r border-foreground/5">
            <div className="flex h-24 shrink-0 items-center px-8">
              <Logo />
            </div>
            <Sidebar />
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <TopHeader onMenuClick={() => { }} /> 

          <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
            <VerificationBanner />
            <div className="mt-2">{children}</div>
          </main>
        </div>

        {/* MOBILE BOTTOM NAVIGATION (GTBank Style) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-xl border-t border-foreground/5 px-4 pb-safe-area-inset-bottom">
          <div className="flex justify-between items-center h-16 max-w-md mx-auto">
            {ACCOUNT_MENU.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  
                  className="flex flex-col items-center justify-center flex-1 transition-all"
                >
                  <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? "bg-brand-red text-brand-burgundy scale-110" : "text-foreground/40"
                    }`}>
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[9px] mt-1 font-black uppercase tracking-tighter transition-all ${isActive ? "text-foreground" : "text-foreground/30"
                    }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* FLOATING WHATSAPP ICON (Pushed up to clear footer) */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-6 z-[60] group flex items-center"
        >
          <div className="w-14 h-14 bg-background border border-foreground/10 text-foreground rounded-[1.4rem] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 relative">
            <MessageCircle size={24} fill="currentColor" className="text-foreground" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-red"></span>
            </span>
          </div>
        </a>

      </div>
    </ThemeProvider>
  );
}