import { useAuth } from "@/context/useAuth";
import useGetUser from "@/features/profile/useGetUser";
import Footer from "@/Home/Footer";
import Header from "@/Home/Header";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AppLayout() {
  const { authState, setUser } = useAuth();
  const { data: user, isSuccess } = useGetUser();

  useEffect(() => {
    if (isSuccess) {
      if (user) setUser(user);
    }
  }, [user, isSuccess, setUser]);

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
