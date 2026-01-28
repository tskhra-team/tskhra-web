import SearchBar from "@/components/SeacrhBar";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { name: "Ecommerce", path: "/ecommerce" },
  { name: "Switching", path: "/switching" },
  { name: "Booking", path: "/booking" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div className="w-full h-14 bg-[#1E1E1E] flex items-center justify-between px-16 border-b border-b-gray-400">
        <div className="w-80">
          <SearchBar />
        </div>
        <Logo />
        <div className="flex gap-6 w-75 justify-end">
          <Button
            variant="ghost"
            className="text-white"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
          <Button
            className="bg-white border text-black hover:border-white hover:text-white"
            onClick={() =>
              navigate("/login", {
                state: { from: location.pathname },
              })
            }
          >
            Log in
          </Button>
        </div>
      </div>
      <div className="w-full h-12 bg-[#1E1E1E] ">
        <div className="flex h-full justify-center items-center gap-10">
          {navItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              className={({ isActive }) =>
                `text-white px-4 h-full flex items-center hover:border-t-2 hover:border-t-white cursor-pointer transition-normal duration-75 ${
                  isActive ? "border-t font-bold border-t-white" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
