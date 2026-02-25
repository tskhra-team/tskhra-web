import MyServices from "@/My_Services/MyServices";

export default function MyServicesPage() {
  return (
    <MyServices>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">My Services</h1>
        <p className="text-muted-foreground">
          Manage your services, view bookings, and track performance.
        </p>
        {/* Content sections will be displayed here based on sidebar selection */}
      </div>
    </MyServices>
  );
}
