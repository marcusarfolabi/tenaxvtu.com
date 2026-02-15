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
  const { theme, setTheme, resolvedTheme } = useTheme();
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-foreground/5 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      {({ open }) => (
        <>
          <div className="container mx-auto px-6 flex justify-between items-center">
            {/* Logo - Adaptive */}
            <Logo inverted={mounted ? resolvedTheme === "dark" : false} />

            <div className="hidden md:flex items-center gap-8">
              <div className="flex gap-8">
                {MAIN_NAVIGATION.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-bold text-muted-foreground hover:text-brand-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all active:scale-90"
                aria-label="Toggle Theme"
              >
                {mounted && (resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
              </button>

              <Link
                href="/login"
                className="px-6 py-3 bg-foreground text-background rounded-xl text-sm font-black hover:bg-brand-gold hover:text-black transition-all flex items-center gap-2"
              >
                <Smartphone size={16} />
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2 text-foreground"
              >
                {mounted && (resolvedTheme === "dark" ? <Sun size={24} /> : <Moon size={24} />)}
              </button>
              <DisclosureButton className="p-2 text-foreground hover:bg-foreground/5 rounded-lg">
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
            <DisclosurePanel className="md:hidden absolute top-full left-0 w-full bg-background border-b border-foreground/5 shadow-2xl p-6">
              <div className="flex flex-col gap-4">
                {MAIN_NAVIGATION.map((link) => (
                  <DisclosureButton
                    key={link.name}
                    as={Link}
                    href={link.href}
                    className="text-lg font-black text-foreground flex justify-between items-center p-3 hover:bg-foreground/5 rounded-xl transition-colors"
                  >
                    {link.name}
                    <ChevronRight size={18} className="text-brand-gold" />
                  </DisclosureButton>
                ))}

                <div className="pt-4 border-t border-foreground/5">
                  <DisclosureButton
                    as={Link}
                    href="/register"
                    className="w-full py-4 bg-brand-gold text-black rounded-2xl font-black text-center flex items-center justify-center gap-2"
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