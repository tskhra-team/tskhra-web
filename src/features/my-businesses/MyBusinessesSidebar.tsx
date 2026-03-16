import LanguageSwitcher from "@/components/LanguageSwitcher";
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
  Languages,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

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
          {isBusinessChoosed && (
            <>
              <SidebarGroupLabel>{t("navigation.dashboard")}</SidebarGroupLabel>
              <SidebarGroupContent className="mb-5">
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => handleSectionClick(item.section)}
                        isActive={searchParams.get("section") === item.section}
                        className="h-10 text-base cursor-pointer"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </>
          )}

          <div className="mt-auto pt-4">
            <SidebarGroupLabel className="flex items-center gap-2 px-2 mb-2">
              <Languages className="h-4 w-4" />
              {t("navigation.language")}
            </SidebarGroupLabel>
            <div className="px-2">
              <LanguageSwitcher className="w-full" style={{ height: "auto" }} />
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
