"use client";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import TopHeader from "./components/TopHeader";
import Sidebar from "./components/Sidebar";
import Logo from "@/components/Logo";
import VerificationBanner from "@/components/common/VerificationBanner";
import { MessageCircle } from "lucide-react"; // Using Lucide for a clean icon

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Replace with your actual WhatsApp number
  const whatsappNumber = process.env.NEXT_PUBLIC_SUPPORT_PHONE; 
  const message = encodeURIComponent("Hello Kakalinks Support, I need assistance with my account.");

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative">
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
            <div className="fixed inset-0 bg-brand-black/40 backdrop-blur-md" />
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
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1 flex-col bg-brand-black shadow-2xl">
                <div className="flex h-20 items-center px-8 border-b border-white/5">
                  <Logo inverted={true} />
                </div>
                <Sidebar
                  mobile={true}
                  closeSidebar={() => setSidebarOpen(false)}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col bg-brand-black shadow-2xl">
          <div className="flex h-24 shrink-0 items-center px-8">
            <Logo inverted={true} />
          </div>
          <Sidebar />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="lg:pl-72">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <VerificationBanner />
          {children}
        </main>
      </div>

      {/* FLOATING WHATSAPP ICON */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-60 group flex items-center"
      >
        {/* Caption Label */}
        <span className="mr-3 bg-white border border-gray-100 text-brand-black px-4 py-2 rounded-2xl shadow-xl text-xs font-black opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 pointer-events-none">
          We are Here :)
        </span>

        {/* The Icon Button */}
        <div className="w-14 h-14 bg-brand-black text-white rounded-3xl shadow-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
          <MessageCircle size={28} fill="currentColor" className="text-white" />
          
          {/* Notification Dot to grab attention */}
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-gold"></span>
          </span>
        </div>
      </a>
    </div>
  );
}