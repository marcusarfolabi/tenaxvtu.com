"use client";
import { motion } from "framer-motion";
import { Home, ArrowLeft, ZapOff } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-foreground font-main flex items-center justify-center overflow-hidden relative">

            {/* 1. THE ELECTRIC GRID (Faded for the 404 vibe) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <svg
                    className="absolute inset-0 h-full w-full stroke-foreground/[0.03] [mask-image:radial-gradient(100%_100%_at_center,white,transparent)]"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern id="404-grid" width={80} height={80} x="50%" y="50%" patternUnits="userSpaceOnUse">
                            <path d="M.5 200V.5H200" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" strokeWidth={0} fill="url(#404-grid)" />
                </svg>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto"
                > 

                    {/* THE BOOMING 404 */}
                    <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter mb-4 relative inline-block">
                        <span className="relative z-10">404</span> 
                        <motion.span
                            animate={{
                                height: ["10px", "40px", "20px", "60px", "15px"],
                                opacity: [0.3, 0.6, 0.4, 0.8, 0.3],
                            }}
                            transition={{ duration: 0.15, repeat: Infinity, repeatType: "mirror" }}
                            className="absolute bottom-4 left-0 w-full bg-brand-red blur-3xl -z-10 origin-bottom"
                        />
                    </h1>

                    <h2 className="text-3xl md:text-5xl font-black mb-6">
                        Even our <span className="text-brand-red">fastest lines</span> couldn't find this.
                    </h2>

                    <p className="text-foreground/50 text-lg md:text-xl font-medium mb-12 max-w-lg mx-auto">
                        The page you are looking for has been disconnected or moved to a new network.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-4 bg-foreground text-background rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-brand-red hover:text-white transition-all group active:scale-95 shadow-xl shadow-brand-red/10"
                        >
                            <Home size={20} />
                            Back to Dashboard
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto px-8 py-4 bg-background border border-foreground/10 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-foreground/5 transition-all"
                        >
                            <ArrowLeft size={20} />
                            Go Back
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Decorative localized "short circuit" blurs */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-red/50 to-transparent opacity-20" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand-red/5 blur-[100px] rounded-full pointer-events-none" />
        </div>
    );
}