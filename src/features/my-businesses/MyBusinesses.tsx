import BusinessSidebarProvider from "@/features/my-businesses/BusinessSidebarProvider";

export default function MyBusinesses() {
  return (
    <BusinessSidebarProvider>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">My Businesses</h1>
        <p className="text-muted-foreground">
          Manage your businesses, view bookings, and track performance.
        </p>
        {/* Content sections will be displayed here based on sidebar selection */}
      </div>
    </BusinessSidebarProvider>
  );
}
