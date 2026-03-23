import WithAxiosUser from "@/api/withAxiosUser";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SearchBar from "@/components/SeacrhBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import useGetUser from "@/features/user/useGetUser";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../shared/Logo";

export default function TopBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isVerification = pathname === "/verification";
  const { t } = useTranslation("common");
  const { isAuthenticated, logout, login, register } = useAuth();
  const { data: user } = useGetUser(isAuthenticated);
  let fullName = user?.userName;
  if (user?.firstName && user?.lastName) {
    fullName = user?.firstName + " " + user?.lastName;
  }

  const handleLogin = () => {
    login(); // This will redirect to Keycloak login page
  };

  const handleRegister = () => {
    register(); // This will redirect to Keycloak registration page
  };

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  return (
    <div
      className={`w-full h-16 flex items-center justify-between px-4 sm:px-8 lg:px-16 border-b shadow-sm sticky top-0 z-50 backdrop-blur-xl ${isVerification ? "bg-[#1b1b1f] border-white/10" : "bg-white/80 border-slate-200/60"}`}
    >
      <Logo color={isVerification ? "white" : "black"} />
      <SearchBar />
      <div className="flex gap-2 sm:gap-3 lg:gap-4 items-center justify-end">
        {!isVerification && <LanguageSwitcher />}
        {isAuthenticated ? (
          <WithAxiosUser>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none rounded-full cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt={fullName} />
                    <AvatarFallback>
                      {fullName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t("auth.myProfile")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("auth.profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/my-businesses")}
                  className="cursor-pointer"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>{t("auth.dashboard")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("auth.singOut")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </WithAxiosUser>
        ) : (
          <>
            <Button
              className="bg-white border-2 text-[#1E1E1E] w-20 sm:w-28 lg:w-40 h-9 lg:h-10 text-xs sm:text-sm lg:text-base hover:bg-[#1E1E1E] hover:text-white cursor-pointer transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
              onClick={() => handleRegister()}
            >
              {t("auth.signUp")}
            </Button>
            <Button
              className="text-white border-2 border-[#1E1E1E] w-20 sm:w-28 lg:w-40 h-9 lg:h-10 text-xs sm:text-sm lg:text-base bg-[#1E1E1E] cursor-pointer hover:bg-[#2E2E2E] hover:border-[#2E2E2E] transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
              onClick={() => handleLogin()}
            >
              {t("auth.logIn")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
