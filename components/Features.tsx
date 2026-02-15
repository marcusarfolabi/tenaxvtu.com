"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Headphones, BarChart3, Clock } from "lucide-react";

const mainFeatures = [
  {
    title: "Lightning Fast Delivery",
    desc: "Our automated systems ensure your data and tokens are delivered the micro-second your payment is confirmed.",
    icon: Zap,
    // Use bg-secondary (Brand Black in light, White in dark)
    className: "md:col-span-2 bg-secondary text-background", 
    iconColor: "text-brand-gold",
  },
  {
    title: "Bank-Grade Security",
    desc: "Your transactions are protected by industry-leading encryption.",
    icon: ShieldCheck,
    // Use a themed gray that flips in dark mode
    className: "md:col-span-1 bg-foreground/[0.03] dark:bg-white/5 text-foreground",
    iconColor: "text-blue-600",
  },
  {
    title: "24/7 Human Support",
    desc: "Have an issue? Our support team is always online to help you.",
    icon: Headphones,
    className: "md:col-span-1 bg-foreground/[0.03] dark:bg-white/5 text-foreground",
    iconColor: "text-emerald-600",
  },
  {
    title: "Smart Budgeting",
    desc: "Track every kobo you spend on utilities with our simplified transaction history.",
    icon: BarChart3,
    // Brand Gold usually stays gold in both modes, but text needs to stay dark
    className: "md:col-span-2 bg-brand-gold text-brand-black",
    iconColor: "text-brand-black",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-background px-6 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            Why choose <span className="text-brand-gold">Kakalinks</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
            We have stripped away the complexity of bill payments. No hidden
            fees, no failed transactions, just pure speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainFeatures.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              /* Removed hardcoded border-gray-100 and added a themed border 
                 The f.className now handles the background switch
              */
              className={`p-10 rounded-[2.5rem] flex flex-col justify-between border border-foreground/5 transition-all duration-300 ${f.className}`}
            >
              <div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 bg-brand-gold/20 backdrop-blur-sm border border-brand-gold/20 shadow-sm"
                >
                  <f.icon size={24} className={f.iconColor} />
                </div>
                <h3 className="text-2xl font-black mb-4 leading-tight">
                  {f.title}
                </h3>
                <p className={`text-sm leading-relaxed font-medium opacity-80`}>
                  {f.desc}
                </p>
              </div>

              <div className="mt-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60">
                <Clock size={14} />
                Instant Delivery
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}