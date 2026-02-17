import WithAxiosUser from "@/api/withAxiosUser";
import Loader from "@/components/Loader";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import ProfilePage from "@/pages/ProfilePage";
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const HomePage = lazy(() => import("@/pages/HomePage"));
const EcommercePage = lazy(() => import("@/pages/EcommercePage"));
const BookingPage = lazy(() => import("@/pages/BookingPage"));
const SwitchingPage = lazy(() => import("@/pages/SwappingPage"));
const CreateServicePage = lazy(() => import("@/pages/CreateServicePage"));
const ServicesCatalogPage = lazy(() => import("@/pages/ServicesCatalogPage"));
const ServiceDetailsPage = lazy(() => import("@/pages/ServiceDetailsPage"));

const LoginPage = lazy(() => import("@/pages/LoginPage"));


export const routes = [
  // Main Layout - Public pages with main Header + Footer
  {
    element: <MainLayout />,
    children: [
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
        path: "/swapping",
        element: (
          <Suspense fallback={<Loader />}>
            <SwitchingPage />
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
        path: "/services",
        element: (
          <Suspense fallback={<Loader />}>
            <ServicesCatalogPage />
          </Suspense>
        ),
      },
      {
        path: "/services/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <ServiceDetailsPage />
          </Suspense>
        ),
      },
    ],
  },

  // App Layout - Protected routes with main Header + Footer
  {
    element: (
      <WithAxiosUser>
        <AppLayout />,
      </WithAxiosUser>
    ),
    children: [
      {
        path: "/profile",
        element: (
          <Suspense fallback={<Loader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: "/create-service",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateServicePage />
          </Suspense>
        ),
      },
    ],
  },

  // Auth Layout - Login/Register pages
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loader />}>
            <LoginPage />
          </Suspense>
        ),
      },
    ],
  },

  // 404 - Redirect to home
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
