import { FinalCta } from "@/app/resto/_components/FinalCta";
import { Footer } from "@/app/resto/_components/Footer";
import { Hero } from "@/app/resto/_components/Hero";
import { Navbar } from "@/app/resto/_components/Navbar";
import { Pricing } from "@/app/resto/_components/Pricing";
import { ProductStory } from "@/app/resto/_components/ProductStory";
import { StockSection } from "@/app/resto/_components/StockSection";
import { WhySection } from "@/app/resto/_components/WhySection";

export default function RestoPage() {
  return (
    // `.resto-landing` soustrait la page au reset global de globals.css (voir le commentaire là-bas).
    <div className="resto-landing">
      <Navbar />
      <main className="flex-1 overflow-x-hidden bg-white">
        <Hero />
        <WhySection />
        <ProductStory />
        <StockSection />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
