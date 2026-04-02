"use client";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-background transition-colors duration-500">

      {/* --- ELECTRIC GRID LAYER --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="absolute inset-0 h-full w-full stroke-foreground/5 mask-[radial-gradient(100%_100%_at_top_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="electric-grid"
              width={80}
              height={80}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#electric-grid)" />

          <svg x="50%" y={-1} className="overflow-visible">
            <motion.path
              d="M-400 80h800"
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="2"
              strokeDasharray="100 600"
              initial={{ strokeDashoffset: 700 }}
              animate={{ strokeDashoffset: -700 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="opacity-20 dark:opacity-40"
            />
            <motion.path
              d="M160 -400v800"
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="2"
              strokeDasharray="100 600"
              initial={{ strokeDashoffset: 700 }}
              animate={{ strokeDashoffset: -700 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
              className="opacity-20 dark:opacity-40"
            />
            <motion.path
              d="M-240 -400v800"
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="2"
              strokeDasharray="120 800"
              initial={{ strokeDashoffset: 920 }}
              animate={{ strokeDashoffset: -920 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 5 }}
              className="opacity-10 dark:opacity-30"
            />
          </svg>
        </svg>
      </div>

      {/* --- GLOW DEPTH --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-100 bg-brand-red/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        > 
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-[92px] font-black text-foreground leading-[0.85] tracking-tighter mb-8"
          >
            Stay connected <br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-linear-to-t from-brand-red via-red-500 to-foreground bg-[length:100%_200%] animate-pulse">
                without the stress.
              </span>

              <motion.span
                animate={{
                  height: ["8px", "24px", "12px", "32px", "10px"],
                  opacity: [0.4, 0.8, 0.5, 1, 0.6],
                  scaleX: [1, 1.02, 0.98, 1.05, 1],
                }}
                transition={{
                  duration: 2.9,  
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
                className="absolute bottom-2 left-0 w-full bg-brand-red blur-2xl -z-10 origin-bottom"
              />
 
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 1.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-1 left-0 h-[3px] w-full bg-white shadow-[0_0_20px_#ff0000,0_0_40px_#8b1a1a] rounded-full z-0"
              >
                {/* Rapid inner pulse for the core */}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2.9, repeat: Infinity }}
                  className="absolute inset-0 bg-brand-red rounded-full"
                />
              </motion.span>

              {/* 4. THE SMOKE/SHADOW (Extra Depth) */}
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-brand-red/20 blur-[40px] -z-20" />
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            The fastest way to buy Data, Airtime, and Pay Bills in Nigeria. Get
            instant tokens for your light and renew your TV subs in seconds.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/login"
              className="w-full sm:w-auto px-10 py-5 bg-foreground text-background rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-brand-red/30 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              Start Paying Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto px-10 py-5 bg-background border border-foreground/10 text-foreground rounded-2xl font-black text-lg hover:bg-foreground/5 transition-all flex items-center justify-center"
            >
              Become an Agent
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Ambient side glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-brand-red/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-brand-red/10 blur-[100px] pointer-events-none" />
    </section>
  );
}