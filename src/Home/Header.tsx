import BookingHeader from "@/Booking/BookingHeader";
import EcommerceHeader from "@/Ecommerce/EcommerceHeader";
import AuthenticatedHeader from "@/Home/AuthenticatedHeader";
import SwappingHeader from "@/Swapping/SwappingHeader";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  // Check for booking paths (includes /booking/*)
  if (location.pathname.includes("/booking")) {
    return <BookingHeader />;
  }

  if (location.pathname.includes("/ecommerce")) {
    return <EcommerceHeader />;
  }

  if (location.pathname.includes("/swapping")) {
    return <SwappingHeader />;
  }

  // Default to public header
  return <AuthenticatedHeader />;
}
