"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    q: "How fast is the data delivery?",
    a: "All our data and airtime top-ups are instant. Once your payment is confirmed, the value is delivered to the recipient's phone number within seconds."
  },
  {
    q: "What happens if a transaction fails?",
    a: "If a transaction fails but you were debited, our system automatically initiates a refund to your wallet within 1-2 minutes. You can also contact support with your transaction ID."
  },
  {
    q: "How do I become an agent?",
    a: "Simply register an account and upgrade your profile to 'Agent' status in the settings. Agents enjoy lower prices and higher commissions on all services."
  },
  {
    q: "Are there any hidden charges?",
    a: "No. We believe in transparency. All prices displayed are final. Some bill payments (like Electricity) may carry a small convenience fee which is always shown before you pay."
  },
  {
    q: "Which networks do you support?",
    a: "We support all major networks in Nigeria (MTN, Airtel, Glo, 9mobile)"
  },
  {
    q: "Can I convert airtime to cash?",
    a: "Yes! You can convert excess airtime to cash in your wallet, which can then be withdrawn to your local bank account."
  },
  {
    q: "Is my payment information secure?",
    a: "Absolutely. We use bank-grade encryption and partner with certified payment processors like Monnify to ensure your data is never compromised."
  },
  {
    q: "What are the support working hours?",
    a: "Our automated systems work 24/7. However, our human support agents are available from 8:00 AM to 10:00 PM daily to assist with complex issues."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_PHONE}?text=Hello%20Tenax%20Support!%20I%20have%20a%20question%20about%20your%20services.`;

  return (
    <div className="min-h-screen bg-background text-foreground font-main pb-20 transition-colors duration-300">

      <div className="bg-brand-dark text-white py-20 px-6 rounded-b-[3rem] text-center border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 bg-brand-red/20 text-brand-red rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          <HelpCircle size={32} />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Frequently Asked Questions</h1>
        <p className="opacity-60 max-w-xl mx-auto font-medium">
          Everything you need to know about {process.env.NEXT_PUBLIC_APP_NAME}. Can't find what you're looking for?
          <Link href="/support" className="text-brand-red ml-1 underline">Chat with us.</Link>
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-10">
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-3xl border transition-all overflow-hidden ${isOpen
                    ? "border-brand-red shadow-lg ring-1 ring-brand-red/20 bg-background"
                    : "bg-background border-foreground/10 shadow-sm"
                  }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className={`font-bold text-lg transition-colors ${isOpen ? "text-brand-red" : "text-foreground"}`}>
                    {faq.q}
                  </span>
                  <div className={`transition-transform duration-300 ${isOpen ? "text-brand-red" : "text-foreground/40"}`}>
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-6"
                    >
                      <div className="pt-2 border-t border-foreground/5 text-foreground/60 leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 p-8 bg-brand-dark rounded-[2.5rem] text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">Still have questions?</h3>
            <p className="opacity-50 mb-6 text-sm">We're here to help you 24/7</p>
            <Link
              href={whatsappLink}
              className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all"
            >
              <MessageCircle size={18} /> WhatsApp Support
            </Link>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
            <HelpCircle size={120} />
          </div>
        </div>
      </div>
    </div>
  );
}