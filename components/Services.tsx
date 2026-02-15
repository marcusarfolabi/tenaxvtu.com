"use client";
import { Smartphone, Zap, GraduationCap, Wallet } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Instant Data & VTU",
    desc: "SME and Gifting data for MTN, Airtel, Glo, and 9mobile at wholesale prices.",
    icon: Smartphone,
    color: "bg-blue-500",
  },
  {
    title: "Electricity Tokens",
    desc: "Instant tokens for Ikeja, Eko, Abuja, and other DISCOs nationwide.",
    icon: Zap,
    color: "bg-yellow-500",
  },
  {
    title: "Education Pins",
    desc: "Generate WAEC, JAMB, and NECO result checker pins instantly.",
    icon: GraduationCap,
    color: "bg-green-500",
  },
  {
    title: "Cable TV & Bills",
    desc: "Renew DSTV, GOTV, and Startimes subscriptions in seconds.",
    icon: Wallet,
    color: "bg-purple-500",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-black text-brand-black mb-4 leading-tight">
            Everything you need, <br />
            <span className="text-brand-gold italic">delivered instantly.</span>
          </h2>
          <p className="text-gray-500 max-w-xl font-medium">
            Stop overpaying on other apps. Kakalinks gives you the best rates
            and 100% successful transactions every time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="group relative cursor-pointer p-8 rounded-[2.5rem] border border-gray-100 transition-all duration-500 hover:border-brand-gold hover:shadow-2xl hover:shadow-brand-gold/10 bg-gray-50/50 hover:-translate-y-2"
            >
              <div
                className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:rotate-6 transition-transform duration-300`}
              >
                <s.icon size={28} />
              </div>

              <h3 className="text-xl font-black text-brand-black mb-3">
                {s.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {s.desc}
              </p>

              <div className="mt-6 flex items-center text-xs font-black uppercase tracking-widest text-brand-gold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                Buy Now
                <span className="ml-2">→</span>
              </div>

              <Link
                href="/register"
                className="absolute inset-0 z-10 rounded-[2.5rem]"
                aria-label={`Purchase ${s.title}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
