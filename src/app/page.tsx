import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import Hero from "@/components/home/Hero";
import OccasionMarquee from "@/components/home/OccasionMarquee";
import BrowseReelers from "@/components/home/BrowseReelers";
import HowItWorks from "@/components/home/HowItWorks";
import ReelShowcase from "@/components/home/ReelShowcase";
import PricingTeaser from "@/components/home/PricingTeaser";
import Comparison from "@/components/home/Comparison";
import EditSpotlight from "@/components/home/EditSpotlight";
import StatsTestimonials from "@/components/home/StatsTestimonials";
import ReelerBand from "@/components/home/ReelerBand";
import FAQ from "@/components/home/FAQ";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <OccasionMarquee />
      <BrowseReelers />
      <HowItWorks />
      <ReelShowcase />
      <PricingTeaser />
      <Comparison />
      <EditSpotlight />
      <StatsTestimonials />
      <ReelerBand />
      <FAQ />
      <Footer />
      <FloatingActions />
    </main>
  );
}
