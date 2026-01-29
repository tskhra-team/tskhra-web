import Cookies from "node_modules/@types/js-cookie";
import { Outlet, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();

  if (!accessToken) {
    navigate("/login");
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
