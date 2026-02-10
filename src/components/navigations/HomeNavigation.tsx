import { scrollToElement } from "@/utils";
import { useTranslation } from "react-i18next";

export default function HomeNavigation() {
  const { t } = useTranslation("common");

  const navItems = [
    { name: t("nav.buy"), scroll: "buy-section", color: "#3659FA" },
    { name: t("nav.book"), scroll: "book-section", color: "#FF6439" },
    { name: t("nav.swap"), scroll: "swap-section", color: "#A31621" },
  ];

  return (
    <div className="w-full h-12 sm:h-14 bg-white/60 backdrop-blur-lg border-b border-slate-200/40 sticky top-16 z-40">
      <div className="flex h-full justify-center items-center gap-0.5 sm:gap-1">
        {navItems.map((item) => (
          <div
            key={item.name}
            className="relative text-slate-700 px-4 sm:px-6 lg:px-8 h-full flex items-center cursor-pointer transition-all duration-300 group font-semibold text-sm sm:text-base"
            onClick={() => scrollToElement(item.scroll)}
          >
            <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
              {item.name}
            </span>
            <div
              className="absolute top-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
              style={{ backgroundColor: `${item.color}10` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
