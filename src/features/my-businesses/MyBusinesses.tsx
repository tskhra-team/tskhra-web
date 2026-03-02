import BusinessSidebarProvider from "@/features/my-businesses/BusinessSidebarProvider";
import MyCalendar from "@/features/my-businesses/MyCalendar";
import { useSearchParams } from "react-router-dom";

export default function MyBusinesses() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");

  const renderContent = () => {
    switch (section) {
      case "chart":
        return (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Chart</h1>
            <p className="text-muted-foreground">
              View your business analytics and performance metrics.
            </p>
            {/* Chart content will go here */}
          </div>
        );
      case "calendar":
        return <MyCalendar />;
      case "manage":
        return (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Manage</h1>
            <p className="text-muted-foreground">
              Manage your business settings and configurations.
            </p>
            {/* Management content will go here */}
          </div>
        );
      case "notification":
        return (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              View and manage your notifications.
            </p>
            {/* Notification content will go here */}
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">My Businesses</h1>
            <p className="text-muted-foreground">
              Manage your businesses, calendar and notifications!
            </p>
          </div>
        );
    }
  };

  return <BusinessSidebarProvider>{renderContent()}</BusinessSidebarProvider>;
}
