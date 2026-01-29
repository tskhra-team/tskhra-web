import AboutUs from "@/Home/AboutUs";
import BookSection from "@/Home/BookSection";
import BuySection from "@/Home/BuySection";
import Footer from "@/Home/Footer";
import Header from "@/Home/Header";
import Hero from "@/Home/Hero";
import SwapSection from "@/Home/SwapSection";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <BuySection />
      <BookSection />
      <SwapSection />
      <AboutUs />
      <Footer />
    </>
  );
}
