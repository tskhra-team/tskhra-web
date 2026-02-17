import { scrollToTop } from "@/utils";
import { memo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Logo({ color = "black" }: { color?: string }) {
  const [isHovered, setIsHovered] = useState(false);
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

  return (
    <div
      className="font-bold text-2xl relative overflow-hidden inline-block"
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
  );
}

export default memo(Logo);
