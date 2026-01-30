import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const accessToken = Cookies.get("accessToken");

  if (accessToken) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
