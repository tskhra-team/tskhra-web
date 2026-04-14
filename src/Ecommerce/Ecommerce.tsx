import { useRef } from "react";
import Slider from "./../shared/slider/slider";
import FeaturedItems from "./FeaturedItems";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import StatsCounter from "./StatsCounter";

export default function Ecommerce() {
  const catalogRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Hero Section with Search */}
        <HeroSection />

        {/* Slider Section */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 container mx-auto">
          <Slider />
        </div>

        {/* Content Sections */}
        <div ref={catalogRef}>
          <FeaturedItems />
          <PopularCategories />
          <HowItWorks />
          <StatsCounter />
        </div>
      </div>
    </div>
  );
}
