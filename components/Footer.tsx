"use client";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone, 
  MapPin,
  ArrowUpRight,
} from "lucide-react";

import Logo from "@/components/Logo";
import { FOOTER_NAVIGATION } from "@/settings";
import { useEffect, useState } from "react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return ( 
    <footer className="bg-brand-black text-white pt-20 pb-10 border-t-4 border-brand-gold">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6"> 
            <div className="dark">
              <Logo />
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Empowering agents across Nigeria with the fastest utility vending
              infrastructure.
            </p>

            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-brand-black transition-all"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h6 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
              Our Services <span className="text-brand-gold">#</span>
            </h6>
            <ul className="space-y-4">
              {FOOTER_NAVIGATION.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-gold transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h6 className="font-bold text-lg text-white mb-6">
              Contact Details
            </h6>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={20} className="text-brand-gold shrink-0" />
                <span className="text-sm">
                  Victoria Island, Lagos, NG
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={20} className="text-brand-gold shrink-0" />
                <span className="text-sm">
                  +234 (0) 800-KAKALINKS
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM BAR RESTRUCTURED --- */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright Left */}
          <p className="text-gray-500 text-[11px] font-medium tracking-wide">
            © {new Date().getFullYear()} Kakalinks. All rights reserved.
          </p>

          {/* Navigation Middle */}
          <div className="flex items-center gap-8">
            {[
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
              { name: "FAQ", href: "/faq" }
            ].map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-brand-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Placeholder (to keep middle links centered) */}
          <div className="hidden md:block w-50 text-right">
             <span className="text-[10px] text-brand-gold/50 font-black tracking-widest uppercase">Secured by Kakalinks</span>
          </div>
        </div>
      </div>
    </footer>
  );
}