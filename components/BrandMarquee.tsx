"use client";
import Image from "next/image";

const brands = [
  { name: "MTN", src: "/providers/mtn.png" },
  { name: "Airtel", src: "/providers/airtel.png" },
  { name: "Glo", src: "/providers/glo.png" },
  { name: "9mobile", src: "/providers/9mobile.png" },
  { name: "Ikeja Electric", src: "/providers/power.png" },
  { name: "Eko Electric", src: "/providers/electricity.png" },
  { name: "Moniepoint", src: "/providers/moniepoint.png" },
  { name: "WAEC", src: "/providers/waec.png" },
];

export default function BrandMarquee() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-brand-black/50 border-y border-gray-100 dark:border-white/5 overflow-hidden">
      <p className="text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-10">
        Trusted by users across Nigeria
      </p>

      <div className="flex w-max animate-marquee items-center">
        {[...brands, ...brands].map((brand, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-8 md:px-14 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default"
          >
            <div className="relative h-8 md:h-10 w-32 items-center justify-center gap-2 flex">
              <Image
                src={brand.src}
                alt={`${brand.name} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100px, 150px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
