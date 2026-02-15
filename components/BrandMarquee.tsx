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
    /* Changed bg-gray-50 to use your theme variables and improved border compatibility */
    <div className="py-12 bg-background border-y border-gray-100 dark:border-white/5 overflow-hidden transition-colors duration-300">
      <p className="text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-10">
        Trusted by users across Nigeria
      </p>

      <div className="flex w-max animate-marquee items-center">
        {[...brands, ...brands].map((brand, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-8 md:px-14 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 dark:invert-[0.25] dark:hover:invert-0 transition-all duration-500 cursor-default"
          >
            <div className="relative h-8 md:h-10 w-32 flex items-center justify-center gap-2">
              <Image
                src={brand.src}
                alt={`${brand.name} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 128px, 128px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}