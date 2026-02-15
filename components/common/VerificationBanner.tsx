"use client";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function VerificationBanner() {
  const { isIdentityVerified } = useAuth(); 

  if (isIdentityVerified) return null;

  return (
    <Link href="/account/identity-verification" className="block mb-6">
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between hover:bg-orange-100 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-orange-900">Verify Identity</h4>
            <p className="text-[11px] font-bold text-orange-700 uppercase tracking-tight">
              BVN/NIN verification required for higher limits
            </p>
          </div>
        </div>
        <ChevronRight className="text-orange-400" size={20} />
      </div>
    </Link>
  );
}