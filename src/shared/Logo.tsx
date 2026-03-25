import { scrollToTop } from "@/utils";
import { ChevronDown } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Logo({ color = "black" }: { color?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const allServices = [
    { name: "TSKHRA", path: "/", color: color },
    { name: "BUY", path: "/ecommerce", color: "#3659FA" },
    { name: "BOOK", path: "/booking", color: "#FF6439" },
    { name: "SWAP", path: "/swapping", color: "#A31621" },
  ];

  const getActiveService = () => {
    if (location.pathname.startsWith("/ecommerce")) return allServices[1];
    if (location.pathname.startsWith("/booking")) return allServices[2];
    if (location.pathname.startsWith("/swapping")) return allServices[3];
    return allServices[0];
  };

  const activeService = getActiveService();
  const otherServices = allServices.filter(
    (s) => s.name !== activeService.name && s.name !== "TSKHRA",
  );
  const tskhra = allServices[0];

  const services = [
    activeService,
    ...(activeService.name === "TSKHRA"
      ? otherServices
      : [...otherServices, tskhra]),
  ];

  const otherServicesForDropdown = services.slice(1);

  // Close on click outside for mobile dropdown
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (logoRef.current && !logoRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  return (
    <>
      {/* Desktop version - horizontal on hover */}
      <div
        className="font-bold text-2xl relative overflow-hidden hidden xl:inline-block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => scrollToTop()}
      >
        <div className="flex gap-6">
          {services.map((service, index) => (
            <Link
              key={service.name}
              to={service.path}
              className={`inline-block transition-all duration-500 ease-out ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : index === 0
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-full"
              }`}
              style={{
                color: service.color,
                transitionDelay: isHovered ? `${index * 100}ms` : "0ms",
              }}
            >
              {service.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile version - dropdown */}
      <div ref={logoRef} className="relative xl:hidden">
        <div className="flex items-center gap-2">
          <Link
            to={activeService.path}
            onClick={() => scrollToTop()}
            className="font-bold text-2xl"
            style={{ color: activeService.color }}
          >
            {activeService.name}
          </Link>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
              style={{ color: activeService.color }}
            />
          </button>
        </div>

        {/* Dropdown menu */}
        {isExpanded && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg py-2 min-w-32 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {otherServicesForDropdown.map((service, index) => (
              <Link
                key={service.name}
                to={service.path}
                onClick={() => {
                  setIsExpanded(false);
                  scrollToTop();
                }}
                className="block px-4 py-2 font-bold text-lg hover:bg-slate-50 transition-colors"
                style={{
                  color: service.color,
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {service.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default memo(Logo);
