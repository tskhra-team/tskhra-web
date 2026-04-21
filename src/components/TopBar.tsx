import WithAxiosUser from "@/api/withAxiosUser";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
import useEcommerceFavorites from "@/Ecommerce/hooks/useEcommerceFavorites";
import useGetUser from "@/features/user/useGetUser";
import useGetUserNotifications from "@/features/user/useGetUserNotifications";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell, Heart, LayoutDashboard, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../shared/Logo";

export default function TopBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isVerification = pathname === "/verification";
  const { t } = useTranslation("common");
  const { isAuthenticated, logout, login, register } = useAuth();
  const isMobile = useIsMobile();

  const { data: user } = useGetUser(isAuthenticated);
  const { data: notificationsCount } = useGetUserNotifications(
    user?.isVerified,
  );
  const { favoriteIds: ecommerceFavoriteIds } = useEcommerceFavorites();
  const bookingFavoritesCount = user?.favoriteBusinesses
    ? new Set(user.favoriteBusinesses).size
    : 0;
  const favoritesCount =
    bookingFavoritesCount + (ecommerceFavoriteIds?.length || 0);
  let fullName = user?.userName;
  if (user?.firstName && user?.lastName) {
    fullName = user?.firstName + " " + user?.lastName;
  }

  const showLanguageSwitcher =
    !isVerification && (!isAuthenticated || !isMobile);

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

  const handleFavoritesClick = () => {
    let favTab = "booking"; // По умолчанию
    if (pathname.includes("/ecommerce")) favTab = "ecommerce";
    else if (pathname.includes("/swapping")) favTab = "swapping";

    navigate(`/profile?section=favorites&favTab=${favTab}`);
  };

  const handleNotificationsClick = () => {
    if (pathname.includes("/swapping")) {
      navigate("/swapping/offers");
    } else if (pathname.includes("/ecommerce")) {
      navigate("/ecommerce/offers");
    } else {
      navigate("/my-businesses"); // По умолчанию для booking
    }
  };

  return (
    <div
      className={`w-full h-16 flex items-center justify-between px-4 sm:px-8 lg:px-16 border-b shadow-sm sticky top-0 z-50 backdrop-blur-xl ${isVerification ? "bg-[#1b1b1f] border-white/10" : "bg-white/80 border-slate-200/60"}`}
    >
      <Logo color={isVerification ? "white" : "black"} />
      {/* <SearchBar /> */}
      <div className="flex gap-2 sm:gap-3 lg:gap-4 items-center justify-end">
        {showLanguageSwitcher && <LanguageSwitcher />}
        {isAuthenticated && !isMobile && (
          <button
            onClick={handleFavoritesClick}
            className={`relative p-2 rounded-full transition-colors cursor-pointer ${isVerification ? "hover:bg-white/10 text-white" : "hover:bg-rose-50 text-slate-600 hover:text-rose-500"}`}
            title={t("auth.favorites", { defaultValue: "Favorites" })}
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold min-w-4.5 h-4.5 flex items-center justify-center rounded-full leading-none px-1">
                {favoritesCount}
              </span>
            )}
          </button>
        )}
        {isAuthenticated && user?.isVerified && !isMobile && (
          <button
            onClick={handleNotificationsClick}
            className={`relative p-2 rounded-full transition-colors cursor-pointer ${isVerification ? "hover:bg-white/10 text-white" : "hover:bg-blue-50 text-slate-600 hover:text-blue-600"}`}
            title={t("auth.notifications", { defaultValue: "Notifications" })}
          >
            <Bell className="w-5 h-5" />
            {notificationsCount && notificationsCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[10px] font-bold min-w-4.5 h-4.5 flex items-center justify-center rounded-full leading-none px-1">
                {notificationsCount > 99 ? "99+" : notificationsCount}
              </span>
            ) : null}
          </button>
        )}
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
                  {(favoritesCount || notificationsCount) && isMobile ? (
                    <span className="absolute top-3 right-11.5 bg-red-500 text-white text-[10px] font-bold min-w-3 h-3 flex items-center justify-center rounded-full leading-none px-1"></span>
                  ) : null}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-47 mt-2 p-3">
                <DropdownMenuLabel>{t("auth.myProfile")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer h-10"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("auth.profile")}</span>
                </DropdownMenuItem>

                {isMobile && (
                  <DropdownMenuItem
                    onClick={handleFavoritesClick}
                    className="cursor-pointer h-10"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    <div className="flex justify-between w-full items-center">
                      <span>{t("auth.favorites")}</span>

                      {favoritesCount > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold min-w-4.5 h-4.5 flex items-center justify-center rounded-full leading-none px-1">
                          {favoritesCount > 99 ? "99+" : favoritesCount}
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                )}

                {isMobile && (
                  <>
                    <DropdownMenuItem
                      onClick={handleNotificationsClick}
                      className="cursor-pointer h-10"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      <div className="flex justify-between w-full items-center">
                        <span>{t("auth.notifications")}</span>
                        {notificationsCount && notificationsCount > 0 ? (
                          <span className="bg-blue-500 text-white text-[10px] font-bold min-w-4.5 h-4.5 flex items-center justify-center rounded-full leading-none px-1">
                            {notificationsCount > 99
                              ? "99+"
                              : notificationsCount}
                          </span>
                        ) : null}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                {user?.isVerified && (
                  <DropdownMenuItem
                    onClick={() => navigate("/my-businesses")}
                    className="cursor-pointer h-10"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>{t("auth.dashboard")}</span>
                  </DropdownMenuItem>
                )}

                {!isMobile && <DropdownMenuSeparator />}

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 h-10"
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-600" />
                  <span>{t("auth.singOut")}</span>
                </DropdownMenuItem>

                {isMobile && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LanguageSwitcher
                        className="w-full"
                        style={{ height: "30px" }}
                      />
                    </DropdownMenuItem>
                  </>
                )}
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
