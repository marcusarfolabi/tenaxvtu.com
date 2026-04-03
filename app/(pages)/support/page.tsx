"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare, Mail, User, ArrowRight, Headset, CheckCircle2, Lock
} from "lucide-react";
import { toast } from "react-hot-toast";
import FormInput from "@/components/common/FormInput";
import SubmitButton from "@/components/common/SubmitButton";
import { authApi } from "@/lib/api/auth";
import Link from "next/link";

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [challenge, setChallenge] = useState({ question: "", answer: 0 });

  const [displayEmail, setDisplayEmail] = useState("");

  const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "2347062310461";

  useEffect(() => {
    const parts = ["support", "tenaxvtu.com"];
    setDisplayEmail(parts.join("@"));

    const today = new Date().toDateString();
    const stats = JSON.parse(localStorage.getItem("support_stats") || "{}");
    if (stats.date === today && stats.count >= 2) {
      setIsRateLimited(true);
    }
    generateChallenge();
  }, []);

  const generateChallenge = () => {
    const types = ['math', 'english', 'physics'];
    const type = types[Math.floor(Math.random() * types.length)];
    let q = ""; let a = 0;

    switch (type) {
      case 'math':
        const x = Math.floor(Math.random() * 10) + 5;
        const y = Math.floor(Math.random() * 5) + 2;
        q = `Solve: ${x} + ${y} = ?`; a = x + y;
        break;
      case 'english':
        q = `How many letters are in "${process.env.NEXT_PUBLIC_APP_NAME}"?`; a = 9;
        break;
      case 'physics':
        q = `Force = Mass × ? (1=Accel, 2=Time, 3=Heat)`; a = 1;
        break;
    }
    setChallenge({ question: q, answer: a });
  };

  const isCaptchaCorrect = parseInt(captchaAnswer) === challenge.answer;

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=Hello ${process.env.NEXT_PUBLIC_APP_NAME} Support, I need help with...`;
    window.open(url, "_blank");
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaCorrect) return toast.error("Incorrect security answer!");

    setLoading(true);
    try {
      await authApi.contactUs(formData);
      const today = new Date().toDateString();
      const stats = JSON.parse(localStorage.getItem("support_stats") || "{}");
      const newCount = stats.date === today ? stats.count + 1 : 1;
      localStorage.setItem("support_stats", JSON.stringify({ date: today, count: newCount }));

      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 font-main transition-colors duration-300">

      <div className="bg-brand-dark text-white py-16 px-6 rounded-b-[3rem] relative overflow-hidden mb-18">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6"
          >
            <Headset size={16} /> 24/7 Help Center
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">How can we help?</h1>
        </div>
        <div className="absolute inset-0 opacity-10 bg-grid-pattern pointer-events-none"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 grid lg:grid-cols-3 gap-8">

        {/* Main Form Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-background rounded-[2.5rem] shadow-xl border border-foreground/10 p-8"
        >
          {isRateLimited ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Lock size={32} />
              </div>
              <h2 className="text-xl font-black text-foreground">Daily Limit Reached</h2>
              <p className="text-foreground/50">You've reached the 2-request daily limit.</p>
              <button
                onClick={openWhatsApp}
                className="bg-brand-red text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all"
              >
                Chat on WhatsApp
              </button>
            </div>
          ) : !submitted ? (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormInput label="Full Name" icon={User} placeholder="John Doe" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} required />
                <FormInput label="Email Address" type="email" icon={Mail} placeholder="john@example.com" value={formData.email} onChange={(e: any) => setFormData({ ...formData, email: e.target.value })} required />
              </div>

              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-foreground/5 border border-foreground/10 text-foreground rounded-2xl p-4 focus:border-brand-red outline-none transition-all placeholder:text-foreground/30"
                placeholder="How can we help you today?"
                required
              />

              <div className="p-5 bg-brand-red/5 border border-brand-red/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-sm font-bold text-brand-red">{challenge.question}</p>
                <input
                  type="number"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-full md:w-32 bg-background border border-foreground/20 text-foreground rounded-xl px-4 py-2 font-bold focus:border-brand-red outline-none"
                />
              </div>

              <SubmitButton
                idleText="Send Message"
                loadingText="Verifying..."
                isLoading={loading}
                disabled={!isCaptchaCorrect}
                className={`h-14 rounded-2xl w-full bg-brand-red text-white font-black uppercase tracking-widest ${!isCaptchaCorrect ? 'opacity-50 grayscale' : 'hover:brightness-110'}`}
              />
            </form>
          ) : (
            <div className="py-20 text-center">
              <CheckCircle2 size={60} className="text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-foreground">Message Sent!</h2>
              <p className="text-foreground/50">We will get back to you shortly.</p>
            </div>
          )}
        </motion.div>

        {/* Support Channels */}
        <div className="space-y-6">
          <motion.button
            whileHover={{ y: -5 }}
            onClick={openWhatsApp}
            className="w-full text-left bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] group transition-colors"
          >
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mb-2">WhatsApp</h3>
            <div className="flex items-center gap-2 text-emerald-600/70 dark:text-emerald-400/70 font-black text-xs uppercase">
              Chat Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          <motion.div
            whileHover={{ y: -5 }}
            className="w-full bg-brand-dark p-8 rounded-[2.5rem] text-white border border-white/5"
          >
            <div className="w-12 h-12 bg-brand-red text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-red/20">
              <Mail size={24} />
            </div>
            <h3 className="text-xl font-black mb-2">Email Support</h3>
            <Link href={`mailto:${displayEmail}`} className="text-brand-red font-bold text-sm hover:underline">
              {displayEmail || "support@tenaxvtu.com"}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}