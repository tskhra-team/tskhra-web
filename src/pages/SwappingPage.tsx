import Swapping from "@/Swapping/Swapping";
import { Outlet, useLocation } from "react-router-dom";

export default function SwappingPage() {
  const location = useLocation();

  const isRoot =
    location.pathname === "/swapping" || location.pathname === "/swapping/";

  return isRoot ? <Swapping /> : <Outlet />;
}
