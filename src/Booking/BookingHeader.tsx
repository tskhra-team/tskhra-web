import TopBar from "@/components/TopBar";
import BookingNavigation from "@/components/navigations/BookingNavigation";
import Cookies from "js-cookie";

export default function BookingHeader() {
  const accessToken = Cookies.get("accessToken");
  const isAuthenticated = !!accessToken;

  return (
    <div>
      <TopBar isAuthenticated={isAuthenticated} />
      <BookingNavigation />
    </div>
  );
}
