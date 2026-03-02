import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MyBusinessesSidebar } from "@/features/my-businesses/MyBusinessesSidebar";

export default function BusinessSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MyBusinessesSidebar />
      <main className="flex-1 p-6">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
