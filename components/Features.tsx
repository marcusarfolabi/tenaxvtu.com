"use client";
import { FEATURES } from "@/settings";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";



export default function Features() {
  return (
    <section id="features" className="py-24 bg-background px-6 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 uppercase tracking-tighter">
            Why choose <span className="text-brand-red">{process.env.NEXT_PUBLIC_APP_NAME}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
            We have stripped away the complexity of bill payments. No hidden
            fees, no failed transactions, just pure speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={`p-10 rounded-[2.5rem] flex flex-col justify-between border-brand-burgundy/50 border transition-all duration-300 ${f.className}`}
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-brand-burgundy/50 ${f.iconBg}`}
                >
                  <f.icon size={24} className={f.iconColor} />
                </div>
                <h3 className="text-2xl font-black mb-4 leading-tight uppercase tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium opacity-80">
                  {f.desc}
                </p>
              </div>

              <div className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                <Clock size={14} />
                {f.title}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}