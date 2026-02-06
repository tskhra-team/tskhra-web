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
import { scrollToElement } from "@/utils";
import Cookies from "js-cookie";
import { LogOut, User } from "lucide-react";
import Avatar from "react-avatar";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../shared/Logo";

const navItems = [
  { name: "Buy", scroll: "buy-section", color: "#3659FA" },
  { name: "Book", scroll: "book-section", color: "#FF6439" },
  { name: "Swap", scroll: "swap-section", color: "#A31621" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = Cookies.get("accessToken");
  const { logout } = useAuth();
  const {user} = useAuth()
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <div className="w-full h-16 bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 lg:px-16 border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <Logo />
        <div className="flex gap-2 sm:gap-3 lg:gap-4 justify-end items-center">
          {accessToken ? (
           <div>dsfsfsfsf</div>
          ) : (
            <>
              <Button
                className="bg-white border-2 text-[#1E1E1E] w-20 sm:w-28 lg:w-40 h-9 lg:h-10 text-xs sm:text-sm lg:text-base hover:bg-[#1E1E1E] hover:text-white cursor-pointer transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                onClick={() => navigate("/register")}
              >
                Sign Up
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
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar name={user.userName} size="40" round />
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
            </>
          )}
        </div>
      </div>
      <div className="w-full h-12 sm:h-14 bg-white/60 backdrop-blur-lg border-b border-slate-200/40 sticky top-16 z-40">
        <div className="flex h-full justify-center items-center gap-0.5 sm:gap-1">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative text-slate-700 px-4 sm:px-6 lg:px-8 h-full flex items-center cursor-pointer transition-all duration-300 group font-semibold text-sm sm:text-base"
              onClick={() => scrollToElement(item.scroll)}
            >
              <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                {item.name}
              </span>
              <div
                className="absolute top-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                style={{ backgroundColor: `${item.color}10` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
