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
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Calendar,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
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

export function MyBusinessesSidebar() {
  const { t } = useTranslation("dashboard");
  const [searchParams, setSearchParams] = useSearchParams();
  const isBusinessChoosed = searchParams.get("businessId");

  const menuItems = [
    {
      title: t("navigation.chart"),
      icon: BarChart3,
      section: "chart",
    },
    {
      title: t("navigation.calendar"),
      icon: Calendar,
      section: "calendar",
    },
    {
      title: t("navigation.manage"),
      icon: Settings,
      section: "manage",
    },
    {
      title: t("navigation.services"),
      icon: BriefcaseBusiness,
      section: "services",
    },
    {
      title: t("navigation.notification"),
      icon: Bell,
      section: "notification",
    },
  ];

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
          <SidebarGroupLabel>{t("navigation.dashboard")}</SidebarGroupLabel>
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
