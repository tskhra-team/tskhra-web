import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";

export default function AuthLayout() {
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();

  if (accessToken) {
    navigate("/");
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
