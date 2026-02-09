import { useAuth } from "@/context/useAuth";
import Footer from "@/Home/Footer";
import Header from "@/Home/Header";
import { Navigate, Outlet } from "react-router-dom";

export default function AppLayout() {
  const {authState} = useAuth() 

if (authState?.accessToken) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
