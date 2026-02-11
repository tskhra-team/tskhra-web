import TopBar from "@/components/TopBar";
import HomeNavigation from "@/components/navigations/HomeNavigation";

export default function PublicHeader() {
  return (
    <div>
      <TopBar isAuthenticated={false} />
      <HomeNavigation />
    </div>
  );
}
