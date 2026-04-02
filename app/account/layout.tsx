"use client";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import TopHeader from "./components/TopHeader";
import Sidebar from "./components/Sidebar";
import Logo from "@/components/Logo";
import VerificationBanner from "@/components/common/VerificationBanner";
import { MessageCircle, X } from "lucide-react";
import { ThemeProvider } from "next-themes";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_SUPPORT_PHONE;
  const message = encodeURIComponent(
    `Hello ${process.env.NEXT_PUBLIC_APP_NAME} Support, I need assistance with my account.`
  );

  return (
    // Wrap everything in ThemeProvider for consistent attribute handling
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background relative transition-colors duration-300">
        {/* MOBILE DRAWER */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-background backdrop-blur-md" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-54 flex-col bg-background shadow-2xl transition-colors duration-300">
                  <div className="absolute top-5 -right-12">
                    <button
                      type="button"
                      className="text-foreground p-2 hover:scale-110 transition-transform"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="flex h-20 items-center px-8 border-b border-foreground/5">
                    <Logo />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <Sidebar
                      mobile={true}
                      closeSidebar={() => setSidebarOpen(false)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
          <div className="flex grow flex-col bg-background shadow-2xl border-r border-white/5">
            <div className="flex h-24 shrink-0 items-center px-8">
              <Logo />
            </div>
            <Sidebar />
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="lg:pl-54 flex flex-col min-h-screen">
          <TopHeader onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
            <VerificationBanner />
            <div className="mt-4">{children}</div>
          </main>

          {/* Optional: Add a subtle footer inside the content area if needed */}
        </div>

        {/* FLOATING WHATSAPP ICON */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-[60] group flex items-center"
        >
          {/* Caption Label - Themed */}
          <span className="mr-3 bg-background border border-foreground/10 text-foreground px-4 py-2 rounded-2xl shadow-2xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 pointer-events-none whitespace-nowrap hidden md:block">
            Support Online
          </span>

          {/* The Icon Button */}
          <div className="w-14 h-14 bg-background border border-foreground/10 text-foreground rounded-[1.4rem] shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 relative">
            <MessageCircle
              size={24}
              fill="currentColor"
              className="text-foreground"
            />

            {/* Notification Dot */}
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-brand-red border-4 border-brand-black"></span>
            </span>
          </div>
        </a>
      </div>
    </ThemeProvider>
  );
}
