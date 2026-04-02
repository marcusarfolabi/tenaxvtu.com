"use client";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-background transition-colors duration-300">

      <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none opacity-20 dark:opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-8xl font-black text-foreground leading-[0.95] tracking-tighter mb-8"
          >
            Stay connected <br />
            without{" "}
            <span className="text-brand-red italic">
              the stress.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            The fastest way to buy Data, Airtime, and Pay Bills in Nigeria. Get
            instant tokens for your light and renew your TV subs in seconds—all
            at the best rates.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/login"
              className="w-full sm:w-auto px-10 py-5 bg-foreground text-background rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-brand-red/20 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              Start Paying Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-red/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-brand-red/5 rounded-full blur-[80px] pointer-events-none" />
    </section>
  );
}