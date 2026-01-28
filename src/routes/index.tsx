import Loader from "@/components/Loader";
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const HomePage = lazy(() => import("@/pages/HomePage"));
const EcommercePage = lazy(() => import("@/pages/EcommercePage"));
const BookingPage = lazy(() => import("@/pages/BookingPage"));
const SwitchingPage = lazy(() => import("@/pages/SwitchingPage"));

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));

export const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: "/ecommerce",
    element: (
      <Suspense fallback={<Loader />}>
        <EcommercePage />
      </Suspense>
    ),
  },
  {
    path: "/booking",
    element: (
      <Suspense fallback={<Loader />}>
        <BookingPage />
      </Suspense>
    ),
  },
  {
    path: "/switching",
    element: (
      <Suspense fallback={<Loader />}>
        <SwitchingPage />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<Loader />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
