import SectionCard from "@/Home/SectionCard";
import { useState } from "react";

const sections = [
  {
    id: "ecommerce",
    title: "Buy",
    description:
      "Discover an endless collection of premium products curated just for you. From everyday essentials to luxury finds, enjoy seamless shopping with secure payments and lightning-fast delivery to your doorstep.",
    buttonText: "Start Shopping",
    styles: {
      bg: "bg-[#3659FA]",
      hoverBg: "hover:bg-[#6B88FC]",
      text: "text-[#3659FA]",
      textDark: "text-[#A4B4FF]",
      glow: "from-[#3659FA]",
    },
  },
  {
    id: "booking",
    title: "Book",
    description:
      "Reserve your perfect experience with just a few clicks. Whether it's a cozy restaurant, exciting adventure, or professional service, we make booking effortless so you can focus on what matters most.",
    buttonText: "Reserve Now",
    styles: {
      bg: "bg-[#FF6439]",
      hoverBg: "hover:bg-[#FF8E6B]",
      text: "text-[#FF6439]",
      textDark: "text-[#6DED80]",
      glow: "from-[#FF6439]",
    },
  },
  {
    id: "swapping",
    title: "Swap",
    description:
      "Exchange anything from books, electronics, and furniture to skills, services, and memberships. Turn what you don't need into what you want through smart swapping with verified users in our trusted community.",
    buttonText: "Start Swapping",
    styles: {
      bg: "bg-[#A31621]",
      hoverBg: "hover:bg-[#D94A55]",
      text: "text-[#1E1E1E]",
      textDark: "text-[#595959]",
      glow: "from-[#A31621]",
    },
  },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState("ecommerce");
  return (
    <main className="mx-auto px-14 py-14 relative z-10 bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20 ">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex gap-6 min-h-[75vh] h-[75vh]">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            isActive={activeTab === section.id}
            onMouseEnter={() => setActiveTab(section.id)}
          />
        ))}
      </div>
    </main>
  );
}
