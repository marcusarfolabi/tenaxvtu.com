"use client"; 
import VerificationBanner from "@/components/common/VerificationBanner";
import {
  MessageCircle, 
} from "lucide-react";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { ACCOUNT_MENU } from "@/settings";
import Sidebar from "./account/components/Sidebar";
import TopHeader from "./account/components/TopHeader";

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

        <div className="lg:pl-64 flex flex-col min-h-screen">
          <TopHeader onMenuClick={() => { }} /> 

          <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
            <VerificationBanner />
            <div className="mt-2">{children}</div>
          </main>
        </div>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-foreground/5 px-2 pb-safe-area-inset-bottom">
          <div className="flex justify-between items-end h-11 max-w-md mx-auto relative">
            {ACCOUNT_MENU.map((item) => {
              const isActive = pathname === item.href;
              const isHome = item.name.toLowerCase() === "home";

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center flex-1 transition-all relative ${isHome ? "-top-1" : "pb-2"
                    }`}
                >
                  {isHome ? (
                    <div className="flex flex-col items-center group">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-4 border-background ${isActive
                            ? "bg-brand-red text-brand-burgundy scale-110 shadow-brand-red/40"
                            : "bg-foreground text-background scale-100"
                          }`}
                      >
                        <item.icon size={16} strokeWidth={2.5} />
                      </div>
                      <span className={`text-[9px] mt-0 font-black uppercase tracking-tighter transition-all ${isActive ? "text-foreground" : "text-foreground/30"
                        }`}>
                        {item.name}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? "bg-brand-red/10 text-brand-red scale-110" : "text-foreground/40"
                        }`}>
                        <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <span className={`text-[9px] mt-0 font-black uppercase tracking-tighter transition-all ${isActive ? "text-foreground" : "text-foreground/30"
                        }`}>
                        {item.name}
                      </span>
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <a
          href={`https://wa.me/${whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-6 z-60 group flex items-center"
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