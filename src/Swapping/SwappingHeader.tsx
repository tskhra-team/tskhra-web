import TopBar from "@/components/TopBar";
import SwappingNavigation from "@/components/navigations/SwappingNavigation";
import Cookies from "js-cookie";

export default function SwappingHeader() {
  const accessToken = Cookies.get("accessToken");
  const isAuthenticated = !!accessToken;

  return (
    <div>
      <TopBar isAuthenticated={isAuthenticated} />
      <SwappingNavigation />
    </div>
  );
}
