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
import { BarChart3, Bell, Calendar, Settings } from "lucide-react";
import { useSearchParams } from "react-router-dom";

// const teams = [
//   {
//     name: "Acme Inc",
//     logo: GalleryVerticalEnd,
//     plan: "Enterprise",
//   },
//   {
//     name: "Acme Corp.",
//     logo: AudioWaveform,
//     plan: "Startup",
//   },
//   {
//     name: "Evil Corp.",
//     logo: Command,
//     plan: "Free",
//   },
// ];

const menuItems = [
  {
    title: "Chart",
    icon: BarChart3,
    section: "chart",
  },
  {
    title: "Calendar",
    icon: Calendar,
    section: "calendar",
  },
  {
    title: "Manage",
    icon: Settings,
    section: "manage",
  },
  {
    title: "Notification",
    icon: Bell,
    section: "notification",
  },
];

export function MyBusinessesSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isBusinessChoosed = searchParams.get("businessId");

  // console.log(isBusinessChoosed);

  const handleSectionClick = (section: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("section", section);
    setSearchParams(newParams);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <BusinessSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isBusinessChoosed &&
                menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => handleSectionClick(item.section)}
                      isActive={searchParams.get("section") === item.section}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
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
