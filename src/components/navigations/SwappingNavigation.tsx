import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export default function SwappingNavigation() {
  const { t } = useTranslation("swapping");
  const location = useLocation();

  const isNotInMain =
    location.pathname === "/swapping/my-items" ||
    location.pathname === "/swapping/post-item" ||
    location.pathname === "/swapping/offers";

  const navItems = [
    { name: t("nav.myItems"), link: "/swapping/my-items", color: "#A31621" },
    { name: t("nav.postItem"), link: "/swapping/post-item", color: "#FF6439" },
    { name: t("nav.offers"), link: "/swapping/offers", color: "#3659FA" },
  ];

  return (
    <div
      className={`w-full ${isNotInMain ? "bg-swap-bg" : "bg-white/60"} h-12 sm:h-14  backdrop-blur-lg border-b border-slate-200/40 sticky top-16 z-40`}
    >
      <div className="flex h-full justify-center items-center gap-0.5 sm:gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.link;

          return (
            <Link
              key={item.link}
              to={item.link}
              className="relative text-slate-700 px-4 sm:px-6 lg:px-8 h-full flex items-center cursor-pointer transition-all duration-300 group font-semibold text-sm sm:text-base"
            >
              <span
                className={`relative z-10 text-center text-sm md:text-base transition-all duration-300 ${isActive ? "scale-105" : "group-hover:scale-105"}`}
              >
                {item.name}
              </span>

              <div
                className={`absolute top-0 left-0 right-0 h-1 transition-transform duration-300 origin-center rounded-full 
                  ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                style={{ backgroundColor: item.color }}
              />

              <div
                className={`absolute inset-0 transition-opacity duration-300 rounded-lg 
                  ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                style={{ backgroundColor: `${item.color}10` }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
