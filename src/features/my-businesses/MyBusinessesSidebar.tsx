import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BusinessSwitcher } from "@/features/my-businesses/BusinessSwitcher";
import { NavUser } from "@/features/my-businesses/NavUser";
import {
  AudioWaveform,
  BarChart3,
  Bell,
  Calendar,
  Command,
  GalleryVerticalEnd,
  Settings,
} from "lucide-react";

const teams = [
  {
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Command,
    plan: "Free",
  },
];

const menuItems = [
  {
    title: "Chart",
    icon: BarChart3,
    url: "#chart",
  },
  {
    title: "Calendar",
    icon: Calendar,
    url: "#calendar",
  },
  {
    title: "Manage",
    icon: Settings,
    url: "#manage",
  },
  {
    title: "Notification",
    icon: Bell,
    url: "#notification",
  },
];

export function MyBusinessesSidebar() {
  // Mock business data
  const business = {
    name: "Premium Barber",
    type: "Barber Shop",
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <BusinessSwitcher />
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Scissors className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{business.name}</span>
              <span className="text-xs text-muted-foreground">
                {business.type}
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-3 w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add More
        </Button> */}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
