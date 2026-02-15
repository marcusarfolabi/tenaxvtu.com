"use client";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  inverted?: boolean; 
  className?: string;
}

export default function Logo({ inverted = false, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      {/* The Icon Box */}
      <div >
        <Image 
          src="/android-icon-192x192.png" 
          alt="Kakalinks Logo"
          width={40} 
          height={40}
          className="rounded-2xl " 
          priority  
        />
      </div>

      {/* The Text - Left exactly as it was */}
      <span className={`
        font-black text-xl tracking-tighter
        ${inverted ? 'text-white' : 'text-brand-black'}
      `}>
        KAKALINKS<span className="text-brand-gold">.</span>
      </span>
    </Link>
  );
}