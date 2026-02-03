import Logo from "@/shared/Logo";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const accessToken = Cookies.get("accessToken");

  if (accessToken) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20 relative overflow-hidden">
      <Logo />
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>
      <Outlet />
    </div>
  );
}
