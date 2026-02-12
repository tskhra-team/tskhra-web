import BookingHeader from "@/Booking/BookingHeader";
import EcommerceHeader from "@/Ecommerce/EcommerceHeader";
import AuthenticatedHeader from "@/Home/AuthenticatedHeader";
import PublicHeader from "@/Home/PublicHeader";
import SwappingHeader from "@/Swapping/SwappingHeader";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const { logout, user, authState } = useAuth();
  // const { user } = useAuth();
  const handleLogout = () => {
    logout();
    // navigate("/");
  };
  const { t } = useTranslation("common");
  const accessToken = Cookies.get("accessToken");

  // Check if user is authenticated
  const isAuthenticated = !!accessToken;

  // Determine which header to render based on location and auth status
  const renderHeader = () => {
    // For profile page, always show authenticated header
    if (location.pathname === "/profile") {
      return <AuthenticatedHeader />;
    }

    // For ecommerce page, show EcommerceHeader
    if (location.pathname === "/ecommerce") {
      return <EcommerceHeader />;
    }

    // For booking page, show BookingHeader
    if (location.pathname.includes("/booking")) {
      return <BookingHeader />;
    }

    // For swapping page, show SwappingHeader
    if (location.pathname === "/swapping") {
      return <SwappingHeader />;
    }

    // For home page - check auth status
    if (location.pathname === "/") {
      return isAuthenticated ? <AuthenticatedHeader /> : <PublicHeader />;
    }

    // Default to public header
    return <PublicHeader />;
  };

  return <>{renderHeader()}</>;
}
