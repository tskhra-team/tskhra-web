import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CategoryMegaMenu from "./CategoryMegaMenu";

export default function EcommerceNavigation() {
  const { t } = useTranslation("ecommerce");
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const navItems = [
    { name: t("nav.products"), link: "#", color: "#3659FA" },
    {
      name: t("nav.categories"),
      link: "#",
      color: "#FF6439",
      hasMegaMenu: true,
    },
    { name: t("nav.deals"), link: "#", color: "#A31621" },
  ];

  const openMegaMenu = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMegaMenuOpen(true);
  }, []);

  const closeMegaMenu = useCallback(() => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  }, []);

  const handleMenuMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  return (
    <div className="w-full bg-white/60 backdrop-blur-lg border-b border-slate-200/40 sticky top-16 z-40">
      <div className="flex h-12 sm:h-14 justify-center items-center gap-0.5 sm:gap-1">
        {navItems.map((item) => (
          <div
            key={item.name}
            className="relative text-slate-700 px-4 sm:px-6 lg:px-8 h-full flex items-center cursor-pointer transition-all duration-300 group font-semibold text-sm sm:text-base"
            onMouseEnter={item.hasMegaMenu ? openMegaMenu : undefined}
            onMouseLeave={item.hasMegaMenu ? closeMegaMenu : undefined}
          >
            <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
              {item.name}
            </span>
            <div
              className="absolute top-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"
              style={{
                backgroundColor: item.color,
                ...(item.hasMegaMenu && isMegaMenuOpen
                  ? { transform: "scaleX(1)" }
                  : {}),
              }}
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
              style={{
                backgroundColor: `${item.color}10`,
                ...(item.hasMegaMenu && isMegaMenuOpen ? { opacity: 1 } : {}),
              }}
            />
          </div>
        ))}
      </div>

      {/* Mega Menu Dropdown */}
      <div
        onMouseEnter={handleMenuMouseEnter}
        onMouseLeave={closeMegaMenu}
      >
        <CategoryMegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
        />
      </div>
    </div>
  );
}
