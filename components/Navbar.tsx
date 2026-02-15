"use client";
import { useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react";
import { Menu, X, ChevronRight, Smartphone } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { MAIN_NAVIGATION } from "@/settings";



export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Disclosure
      as="nav"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      {({ open }) => (
        <>
          <div className="container mx-auto px-6 flex justify-between items-center">
            {/* Logo */}
            <Logo inverted={false} />

            <div className="hidden md:flex items-center gap-10">
              <div className="flex gap-8">
                {MAIN_NAVIGATION.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-bold text-gray-600 hover:text-brand-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/login"
                className="px-6 py-3 bg-brand-black text-white rounded-xl text-sm font-black hover:bg-brand-gold hover:text-brand-black transition-all shadow-lg shadow-black/5 flex items-center gap-2"
              >
                <Smartphone size={16} />
                Get Started
              </Link>
            </div>

            <div className="md:hidden">
              <DisclosureButton className="p-2 text-brand-black hover:bg-gray-100 rounded-lg transition-colors">
                {open ? <X size={28} /> : <Menu size={28} />}
              </DisclosureButton>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-150 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <DisclosurePanel className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-2xl p-6">
              <div className="flex flex-col gap-4">
                {MAIN_NAVIGATION.map((link) => (
                  <DisclosureButton
                    key={link.name}
                    as={Link}
                    href={link.href}
                    className="text-lg font-black text-brand-black flex justify-between items-center p-2 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    {link.name}
                    <ChevronRight size={18} className="text-brand-gold" />
                  </DisclosureButton>
                ))}

                <div className="pt-4 border-t border-gray-50">
                  <DisclosureButton
                    as={Link}
                    href="/register"
                    className="w-full py-4 bg-brand-gold text-brand-black rounded-2xl font-black text-center shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2"
                  >
                    <Smartphone size={20} />
                    SIGN UP FOR FREE
                  </DisclosureButton>
                </div>
              </div>
            </DisclosurePanel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
