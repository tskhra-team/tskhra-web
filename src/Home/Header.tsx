import WithAxiosUser from "@/api/withAxiosUser";
import BookingHeader from "@/Booking/BookingHeader";
import { useAuth } from "@/context/useAuth";
import EcommerceHeader from "@/Ecommerce/EcommerceHeader";
import AuthenticatedHeader from "@/Home/AuthenticatedHeader";
import PublicHeader from "@/Home/PublicHeader";
import SwappingHeader from "@/Swapping/SwappingHeader";
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
  const { isAuthenticated } = useAuth();
  // Check for exact match first
  const exactMatch = headerMap[location.pathname];
  if (exactMatch) return exactMatch;

  // Check for booking paths (includes /booking/*)
  if (location.pathname.includes("/booking")) {
    return <BookingHeader />;
  }

  // For home page - check auth status
  if (location.pathname === "/") {
    return isAuthenticated ? (
      <WithAxiosUser>
        <AuthenticatedHeader />
      </WithAxiosUser>
    ) : (
      <PublicHeader />
    );
  }

  // Default to public header
  return <PublicHeader />;
}
