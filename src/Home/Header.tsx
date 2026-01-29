import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../shared/Logo";

const navItems = [
  { name: "Buy", scroll: "ecommerce", color: "#3659FA" },
  { name: "Book", scroll: "booking", color: "#FF6439" },
  { name: "Swap", scroll: "switching", color: "#A31621" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = Cookies.get("accessToken");

  console.log(accessToken);

  return (
    <>
      <div className="w-full h-16 bg-white/80 backdrop-blur-xl flex items-center justify-between px-16 border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <Logo />
        <div className="flex gap-4 justify-end">
          {accessToken ? (
            "You logged in"
          ) : (
            <>
              <Button
                className="bg-white border-2  text-[#1E1E1E] w-40 h-10 hover:bg-[#1E1E1E] hover:text-white cursor-pointer transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
              <Button
                className="text-white border-2 border-[#1E1E1E] w-40 h-10 bg-[#1E1E1E] cursor-pointer hover:bg-[#2E2E2E] hover:border-[#2E2E2E] transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                onClick={() =>
                  navigate("/login", {
                    state: { from: location.pathname },
                  })
                }
              >
                Log in
              </Button>{" "}
            </>
          )}
        </div>
      </div>
      <div className="w-full h-14 bg-white/60 backdrop-blur-lg border-b border-slate-200/40 sticky top-16 z-40">
        <div className="flex h-full justify-center items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative text-slate-700 px-8 h-full flex items-center cursor-pointer transition-all duration-300 group font-semibold"
              onClick={() => console.log(item.scroll)}
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
    </>
  );
}
