"use client";
import { Smartphone, Zap, GraduationCap, Wallet } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Instant Data & VTU",
    desc: "SME and Gifting data for MTN, Airtel, Glo, and 9mobile at wholesale prices.",
    icon: Smartphone,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Electricity Tokens",
    desc: "Instant tokens for Ikeja, Eko, Abuja, and other DISCOs nationwide.",
    icon: Zap,
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    title: "Education Pins",
    desc: "Generate WAEC, JAMB, and NECO result checker pins instantly.",
    icon: GraduationCap,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Cable TV & Bills",
    desc: "Renew DSTV, GOTV, and Startimes subscriptions in seconds.",
    icon: Wallet,
    color: "bg-purple-500/10 text-purple-500",
  },
];

export default function Services() {
  return (
    /* Changed: bg-background ensures the section adapts to light/dark mode */
    <section id="services" className="py-24 bg-background px-6 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            Everything you need, <br />
            <span className="text-brand-red italic">delivered instantly.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl font-medium">
            Stop overpaying on other apps. {process.env.NEXT_PUBLIC_APP_NAME} gives you the best rates
            and 100% successful transactions every time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="group relative cursor-pointer p-8 rounded-[2.5rem] border border-foreground/5 transition-all duration-500 hover:border-brand-red hover:shadow-2xl hover:shadow-brand-red/10 bg-foreground/[0.02] dark:bg-foreground/[0.04] hover:-translate-y-2"
            >
              <div
                className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:rotate-6 transition-transform duration-300`}
              >
                <s.icon size={28} />
              </div>

              <h3 className="text-xl font-black text-foreground mb-3">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                {s.desc}
              </p>

              <div className="mt-6 flex items-center text-xs font-black uppercase tracking-widest text-brand-red opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
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