"use client";
import { motion } from "framer-motion";
import {
  Gavel,
  Wallet,
  RefreshCcw,
  AlertTriangle,
  UserCheck,
  ShieldAlert
} from "lucide-react";

const terms = [
  {
    icon: <UserCheck className="text-brand-red" />,
    title: "1. Account Eligibility",
    content: "You must be at least 18 years old to use {process.env.NEXT_PUBLIC_APP_NAME}. In compliance with CBN regulations, you agree to provide valid identification (BVN/NIN). Accounts found with falsified identity data will be suspended immediately without notice."
  },
  {
    icon: <Wallet className="text-brand-red" />,
    title: "2. Wallet & Funding",
    content: "Funds deposited into your {process.env.NEXT_PUBLIC_APP_NAME} wallet are non-refundable but can be used for all services on the platform. We are not responsible for funds sent to the wrong generated account numbers provided by our payment partners."
  },
  {
    icon: <RefreshCcw className="text-brand-red" />,
    title: "3. Service Delivery",
    content: "Digital products (Airtime, Data, Cable TV) are delivered instantly. Once a transaction is marked 'Successful' by the network provider, it is final and non-reversible. Please double-check recipient numbers before confirming."
  },
  {
    icon: <AlertTriangle className="text-brand-red" />,
    title: "4. Failed Transactions",
    content: "In the event of a service failure where your wallet was debited, the system will automatically reverse the amount within 24 hours. If a reversal does not occur, users must lodge a complaint within 48 hours."
  },
  {
    icon: <ShieldAlert className="text-brand-red" />,
    title: "5. Prohibited Activities",
    content: "Any attempt to hack, scrape, or exploit bugs on this platform will result in a permanent ban and reporting to the Economic and Financial Crimes Commission (EFCC) or the Nigeria Police Force."
  },
  {
    icon: <Gavel className="text-brand-red" />,
    title: "6. Governing Law",
    content: "These terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts in Nigeria."
  }
];
export default function TermsAndConditions() {
  const lastUpdated = "February 15, 2026";


  return (
    <div className="min-h-screen bg-background text-foreground font-main pb-20 transition-colors duration-300">

      <div className="bg-brand-dark text-white py-20 px-6 rounded-b-[3rem] text-center mb-12 border-b border-white/5">
        <div className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
          <Gavel size={16} /> Legal Agreement
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Terms & Conditions</h1>
        <p className="opacity-50 max-w-xl mx-auto font-medium">
          Last Updated: {lastUpdated} • Please read carefully before using our services.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-foreground/5 border border-foreground/10 p-8 rounded-[2.5rem] mb-12 text-foreground/70 leading-relaxed font-medium">
          By accessing <strong>{process.env.NEXT_PUBLIC_APP_NAME}</strong>, you agree to be bound by these terms. This platform is a product designed to facilitate value-added services (VAS) and financial payments within Nigeria. If you disagree with any part of these terms, you may not access our services.
        </div>

        {/* Terms Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {terms.map((term: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-8 border border-foreground/10 rounded-[2.5rem] bg-background transition-all hover:border-brand-red/40 hover:shadow-xl hover:shadow-brand-red/5 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-brand-dark text-white rounded-xl flex items-center justify-center group-hover:bg-brand-red transition-colors">
                  {term.icon}
                </div>
                <h3 className="text-lg font-black text-brand-red">{term.title}</h3>
              </div>
              <p className="text-foreground/60 text-sm leading-relaxed font-medium">
                {term.content}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-10 bg-brand-red rounded-[3rem] text-white shadow-2xl shadow-brand-red/20">
          <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
            <ShieldAlert size={28} /> Right to Terminate
          </h2>
          <p className="font-bold leading-relaxed opacity-90">
            We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
          </p>
        </div>
      </div>
    </div>
  );
}