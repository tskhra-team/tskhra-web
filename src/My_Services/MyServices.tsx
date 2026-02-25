import { MyServicesSidebar } from "./MyServicesSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function MyServices({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MyServicesSidebar />
      <main className="flex-1 p-6">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
