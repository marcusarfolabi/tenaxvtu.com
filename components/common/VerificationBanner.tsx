"use client";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function VerificationBanner() {
  const { isIdentityVerified } = useAuth(); 

  if (isIdentityVerified) return null;

  return (
    <Link href="/account/identity-verification" className="block mb-6 group"> 
      <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-2xl p-4 flex items-center justify-between hover:bg-brand-gold/20 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-brand-black shadow-lg shadow-brand-gold/20">
            <ShieldAlert size={20} />
          </div>
          
          <div>
            <h4 className="text-sm font-black text-foreground">
              Verify Identity
            </h4>
            <p className="text-[11px] font-bold text-brand-gold uppercase tracking-tight">
              BVN/NIN verification required for higher limits
            </p>
          </div>
        </div>

        <ChevronRight 
          className="text-foreground/30 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" 
          size={20} 
        />
      </div>
    </Link>
  );
}