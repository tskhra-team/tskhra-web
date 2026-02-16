import TopBar from "@/components/TopBar";
import HomeNavigation from "@/components/navigations/HomeNavigation";

export default function AuthenticatedHeader() {
  return (
    <div>
      <TopBar />
      <HomeNavigation />
    </div>
  );
}
