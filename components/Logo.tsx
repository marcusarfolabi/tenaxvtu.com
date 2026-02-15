"use client";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      {/* The Icon Box */}
      <div className="relative">
        <Image 
          src="/android-icon-192x192.png" 
          alt="Kakalinks Logo"
          width={40} 
          height={40}
          className="rounded-xl shadow-lg shadow-brand-gold/10 group-hover:scale-105 transition-transform duration-300" 
          priority  
        />
        {/* Subtle glow effect behind the logo icon */}
        <div className="absolute inset-0 bg-brand-gold/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* The Text - Now Theme Aware */}
      <span className="font-black text-xl tracking-tighter text-foreground transition-colors duration-300">
        KAKALINKS<span className="text-brand-gold">.</span>
      </span>
    </Link>
  );
}