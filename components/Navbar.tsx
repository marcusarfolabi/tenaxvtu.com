"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react";
import { Menu, X, ChevronRight, Smartphone, Sun, Moon } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { MAIN_NAVIGATION } from "@/settings";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Disclosure
      as="nav"
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-foreground/5 py-3 shadow-xl shadow-black/5"
          : "bg-transparent py-6"
      }`}
    >
      {({ open }) => (
        <>
          <div className="container mx-auto px-6 flex justify-between items-center">
            {/* Logo - Adaptive (Ensure Logo uses text-foreground internally) */}
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex gap-8">
                {MAIN_NAVIGATION.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-[13px] font-black uppercase tracking-widest text-foreground/60 hover:text-brand-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-xl bg-foreground/5 border border-foreground/5 hover:bg-foreground/10 text-foreground transition-all active:scale-90"
                aria-label="Toggle Theme"
              >
                {mounted && (resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
              </button>

              <Link
                href="/login"
                className="px-6 py-3.5 bg-foreground text-background rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-brand-black transition-all flex items-center gap-2 active:scale-95"
              >
                <Smartphone size={16} className="text-brand-gold" />
                Get Started
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-3 text-foreground bg-foreground/5 rounded-xl border border-foreground/5"
              >
                {mounted && (resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
              </button>
              <DisclosureButton className="p-3 text-foreground hover:bg-foreground/5 rounded-xl transition-colors">
                {open ? <X size={24} /> : <Menu size={24} />}
              </DisclosureButton>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          <Transition
            enter="transition duration-300 ease-out"
            enterFrom="transform -translate-y-4 opacity-0"
            enterTo="transform translate-y-0 opacity-100"
            leave="transition duration-200 ease-in"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform -translate-y-4 opacity-0"
          >
            <DisclosurePanel className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-foreground/5 shadow-2xl p-6 overflow-hidden">
              <div className="flex flex-col gap-3">
                {MAIN_NAVIGATION.map((link) => (
                  <DisclosureButton
                    key={link.name}
                    as={Link}
                    href={link.href}
                    className="text-sm font-black text-foreground uppercase tracking-widest flex justify-between items-center p-4 hover:bg-foreground/5 rounded-2xl transition-all"
                  >
                    {link.name}
                    <ChevronRight size={16} className="text-brand-gold" />
                  </DisclosureButton>
                ))}

                <div className="pt-4 mt-2 border-t border-foreground/5">
                  <DisclosureButton
                    as={Link}
                    href="/register"
                    className="w-full py-5 bg-brand-gold text-brand-black rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-3"
                  >
                    <Smartphone size={20} />
                    Sign Up Free
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