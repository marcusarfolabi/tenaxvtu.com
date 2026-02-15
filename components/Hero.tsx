"use client";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Smartphone } from "lucide-react";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-white dark:bg-brand-black">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none opacity-40" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-8xl font-black text-brand-black dark:text-white leading-[0.95] tracking-tighter mb-8"
          >
            Stay connected <br />
            without{" "}
            <span className="text-brand-gold italic text-shadow-sm">
              the stress.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            The fastest way to buy Data, Airtime, and Pay Bills in Nigeria. Get
            instant tokens for your light and renew your TV subs in seconds—all
            at the best rates.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >

            <button onClick={() => window.location.href = '/login'} className="w-full cursor-pointer sm:w-auto px-10 py-5 bg-brand-black dark:bg-brand-gold text-white dark:text-brand-black rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-brand-gold/20 active:scale-95 transition-all flex items-center justify-center gap-3 group">
              Start Paying Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px] pointer-events-none" />
    </section>
  );
}
