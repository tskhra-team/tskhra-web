import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/useAuth";
import { LogOut, User } from "lucide-react";
import Avatar from "react-avatar";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../shared/Logo";

interface TopBarProps {
  isAuthenticated: boolean;
}

export default function TopBar({ isAuthenticated }: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("common");
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full h-16 bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 lg:px-16 border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
      <Logo />
      <div className="flex gap-2 sm:gap-3 lg:gap-4 items-center justify-end">
        <LanguageSwitcher />
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar name={user?.userName} size="40" round />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button
              className="bg-white border-2 text-[#1E1E1E] w-20 sm:w-28 lg:w-40 h-9 lg:h-10 text-xs sm:text-sm lg:text-base hover:bg-[#1E1E1E] hover:text-white cursor-pointer transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
              onClick={() => navigate("/register")}
            >
              {t("auth.signUp")}
            </Button>
            <Button
              className="text-white border-2 border-[#1E1E1E] w-20 sm:w-28 lg:w-40 h-9 lg:h-10 text-xs sm:text-sm lg:text-base bg-[#1E1E1E] cursor-pointer hover:bg-[#2E2E2E] hover:border-[#2E2E2E] transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
              onClick={() =>
                navigate("/login", {
                  state: { from: location.pathname },
                })
              }
            >
              Log in
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
