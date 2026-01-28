import { Link, useLocation } from "react-router-dom";

const logoTextMap: Record<string, string> = {
  "/": "TSKHRA",
  "/ecommerce": "ECOMMERCE",
  "/switching": "SWITCHING",
  "/booking": "BOOKING",
};

export default function Logo() {
  const location = useLocation();
  const logoText = logoTextMap[location.pathname];
  console.log(logoText);
  return (
    <Link to="/" className="font-bold text-2xl text-white">
      {logoText}
    </Link>
  );
}
