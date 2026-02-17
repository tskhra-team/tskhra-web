import SectionCard from "@/Home/SectionCard";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const [activeTab, setActiveTab] = useState("ecommerce");
  const { t } = useTranslation("home");

  const sections = [
    {
      id: "ecommerce",
      title: t("hero.ecommerce.title"),
      description: t("hero.ecommerce.description"),
      buttonText: t("hero.ecommerce.button"),
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
      title: t("hero.booking.title"),
      description: t("hero.booking.description"),
      buttonText: t("hero.booking.button"),
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
      title: t("hero.swapping.title"),
      description: t("hero.swapping.description"),
      buttonText: t("hero.swapping.button"),
      styles: {
        bg: "bg-[#A31621]",
        hoverBg: "hover:bg-[#D94A55]",
        text: "text-[#A31621]",
        textDark: "text-[#595959]",
        glow: "from-[#A31621]",
      },
    },
  ];

  return (
    <main className="mx-auto px-4 sm:px-8 lg:px-14 py-8 sm:py-12 lg:py-14 relative z-10 bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20 ">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 min-h-[60vh] sm:min-h-[70vh] lg:min-h-[75vh] lg:h-[75vh]">
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
