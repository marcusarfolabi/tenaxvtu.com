"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Scale, Eye, Fingerprint, Landmark, ScrollText } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "February 15, 2026";

  const sections = [
    {
      icon: <Fingerprint className="text-brand-gold" />,
      title: "Information We Collect",
      content: "We collect basic profile information (name, email, phone number) and mandatory Identity Verification data. This includes your Bank Verification Number (BVN) or National Identity Number (NIN) to prevent fraud, money laundering, and identity theft."
    },
    {
      icon: <Landmark className="text-brand-gold" />,
      title: "Regulatory Compliance",
      content: "Our data processing activities are conducted in strict accordance with the Central Bank of Nigeria (CBN) Anti-Money Laundering (AML) and Combating the Financing of Terrorism (CFT) regulations, as well as the Nigeria Data Protection Act (NDPA) 2023."
    },
    {
      icon: <Eye className="text-brand-gold" />,
      title: "Why We Need BVN/NIN",
      content: "As a financial services provider, we are legally required to 'Know Your Customer' (KYC). Verification of BVN/NIN is strictly for identity confirmation and does not give us access to your bank accounts or sensitive biometric data stored by the CBN or NIMC."
    },
    {
      icon: <ShieldCheck className="text-brand-gold" />,
      title: "Data Protection & Security",
      content: "Your data is encrypted using bank-grade AES-256 encryption. We do not sell your personal information to third parties. Data is only shared with authorized regulatory bodies or verified payment processors (e.g., Paystack/Monnify) as required to complete transactions."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-instrument pb-20">
      {/* Header */}
      <div className="bg-brand-black text-white py-20 px-6 rounded-b-[3rem] text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
          <ShieldCheck size={16} /> Secure & Encrypted
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Last Updated: {lastUpdated} • Compliant with NDPA 2023
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Policy Intro */}
        <div className="prose prose-lg max-w-none mb-16 text-gray-600">
          <p className="leading-relaxed">
            At <strong>Kakalinks</strong>, we respect your privacy and are committed to protecting your personal data. 
            This policy outlines how we handle your information when you use our VTU, bill payment, and agent services.
          </p>
        </div>

        {/* Dynamic Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {sections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 border border-gray-100 rounded-4xl bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {section.icon}
              </div>
              <h3 className="text-xl font-black text-brand-black mb-4">{section.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Legal Text Area */}
        <div className="bg-brand-black p-10 rounded-[3rem] text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Scale className="text-brand-gold" /> Your Legal Rights
            </h2>
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
              <p>Under the Nigeria Data Protection Act, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Request access to your personal data.</li>
                <li>Request correction of any inaccurate data.</li>
                <li>Object to processing of your data for direct marketing.</li>
                <li>Request the deletion of your data (subject to CBN record-keeping requirements).</li>
              </ul>
              <p className="mt-8 pt-6 border-t border-white/10">
                For any privacy concerns, contact our Data Protection Officer at 
                <span className="text-brand-gold ml-1">privacy@kakalinks.com</span>
              </p>
            </div>
          </div>
          <ScrollText className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 -rotate-12" />
        </div>
      </div>
    </div>
  );
}