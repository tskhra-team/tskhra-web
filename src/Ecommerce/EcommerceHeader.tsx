import TopBar from "@/components/TopBar";
import EcommerceNavigation from "@/components/navigations/EcommerceNavigation";
import Cookies from "js-cookie";

export default function EcommerceHeader() {
  const accessToken = Cookies.get("accessToken");
  const isAuthenticated = !!accessToken;

  return (
    <div>
      <TopBar isAuthenticated={isAuthenticated} />
      <EcommerceNavigation />
    </div>
  );
}
