import { useAuth } from "@/context/useAuth";
import Footer from "@/Home/Footer";
import Header from "@/Home/Header";
import { Navigate, Outlet } from "react-router-dom";
import { AuthRedirectHandler } from "@/components/AuthRedirectHandler";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <AuthRedirectHandler />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
