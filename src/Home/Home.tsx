import AboutUs from "@/Home/AboutUs";
import BookSection from "@/Home/BookSection";
import BuySection from "@/Home/BuySection";
import Hero from "@/Home/Hero";
import SwapSection from "@/Home/SwapSection";

export default function Home() {
  return (
    <>
      <Hero />
      <BuySection />
      <BookSection />
      <SwapSection />
      <AboutUs />
    </>
  );
}
