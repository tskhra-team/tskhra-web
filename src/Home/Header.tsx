import BookingHeader from "@/Booking/BookingHeader";
import EcommerceHeader from "@/Ecommerce/EcommerceHeader";
import AuthenticatedHeader from "@/Home/AuthenticatedHeader";
import PublicHeader from "@/Home/PublicHeader";
import SwappingHeader from "@/Swapping/SwappingHeader";
import Cookies from "js-cookie";
import type { ReactElement } from "react";
import { useLocation } from "react-router-dom";

const headerMap: Record<string, ReactElement> = {
  "/profile": <AuthenticatedHeader />,
  "/ecommerce": <EcommerceHeader />,
  "/booking": <BookingHeader />,
  "/swapping": <SwappingHeader />,
};

export default function Header() {
  const location = useLocation();
  const accessToken = Cookies.get("accessToken");
  const isAuthenticated = !!accessToken;

  // Check for exact match first
  const exactMatch = headerMap[location.pathname];
  if (exactMatch) return exactMatch;

  // Check for booking paths (includes /booking/*)
  if (location.pathname.includes("/booking")) {
    return <BookingHeader />;
  }

  // For home page - check auth status
  if (location.pathname === "/") {
    return isAuthenticated ? <AuthenticatedHeader /> : <PublicHeader />;
  }

  // Default to public header
  return <PublicHeader />;
}
