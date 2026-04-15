import ShoppingCart from "@/Ecommerce/ShoppingCart";
import Footer from "@/Home/Footer";
import Header from "@/Home/Header";
import { AuthRedirectHandler } from "@/components/AuthRedirectHandler";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <AuthRedirectHandler />
      <Header />
      <Outlet />
      <Footer />
      <ShoppingCart />
    </>
  );
}
