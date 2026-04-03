"use client";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "VASPAYMENT";
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative">
        <Image
          src="/android-icon-192x192.png"
          alt={appName}
          width={40}
          height={40}
          className="rounded-xl shadow-lg shadow-brand-red/10 group-hover:scale-105 transition-transform duration-300"
          priority
        />
        <div className="absolute inset-0 bg-brand-red/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <span className="font-black text-md tracking-tighter uppercase text-foreground transition-colors duration-300">
        {appName} <span className="text-brand-red">.</span>
      </span>
    </Link>
  );
}