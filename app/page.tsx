import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BrandMarquee from "@/components/BrandMarquee";
import Features from "@/components/Features";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <BrandMarquee />
      <Services />
      <Features />

      <Footer />
    </main>
  );
}
