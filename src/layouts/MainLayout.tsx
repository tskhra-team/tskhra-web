import Footer from "@/Home/Footer";
import Header from "@/Home/Header";
import { Outlet } from "react-router-dom";
import { AuthRedirectHandler } from "@/components/AuthRedirectHandler";

export default function MainLayout() {
  return (
    <>
      <AuthRedirectHandler />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
