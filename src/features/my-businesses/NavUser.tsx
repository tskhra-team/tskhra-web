import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/useAuth";
import useGetUser from "@/features/user/useGetUser";
import {
  BadgeCheck,
  Calendar,
  ChevronsUpDown,
  LogOut,
  RefreshCcw,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: user } = useGetUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const fallBackPhoto =
    (user?.firstName?.at(0) ?? "") + (user?.lastName?.at(0) ?? "")
      ? (user?.firstName?.at(0) ?? "") + (user?.lastName?.at(0) ?? "")
      : user?.userName.at(0)?.toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar} alt={user?.firstName} />
                <AvatarFallback className="rounded-lg">
                  {fallBackPhoto}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.firstName}</span>
                <span className="truncate text-xs">{user?.userEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.firstName} />
                  <AvatarFallback className="rounded-lg">
                    {fallBackPhoto}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.firstName}
                  </span>
                  <span className="truncate text-xs">{user?.userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate("/profile");
                }}
                className="cursor-pointer"
              >
                <BadgeCheck />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate("/booking");
                }}
                className="cursor-pointer"
              >
                <Calendar />
                Booking
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  navigate("/swapping");
                }}
                className="cursor-pointer"
              >
                <RefreshCcw />
                Swapping
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/ecommerce");
                }}
                className="cursor-pointer"
              >
                <ShoppingBag />
                Ecommerce
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <LanguageSwitcher
                className="w-full cursor-pointer"
                style={{ height: "auto", border: "none" }}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate("/");
                logout();
              }}
              className="cursor-pointer"
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
