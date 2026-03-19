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
const CreateBusinessPage = lazy(() => import("@/pages/CreateBusinessPage"));
const BusinessCatalogPage = lazy(() => import("@/pages/ServicesCatalogPage"));
const MyBusinessesPage = lazy(() => import("@/pages/MyBusinessesPage"));
const BusinessDetailsPage = lazy(() => import("@/pages/BusinessDetailsPage"));
const MyBookingsPage = lazy(() => import("@/pages/MyBookingsPage"));

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const VerificationPage = lazy(() => import("@/pages/VerificationPage"));

import BusinessCatalogSkeleton from "@/Booking/BusinessCatalogSkeleton";
import BusinessDetailsSkeleton from "@/Booking/BusinessDetailsSkeleton";

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
          <Suspense fallback={<BusinessCatalogSkeleton />}>
            <BusinessCatalogPage />
          </Suspense>
        ),
      },
      {
        path: "/booking/business/:id",
        element: (
          <Suspense fallback={<BusinessDetailsSkeleton />}>
            <BusinessDetailsPage />
          </Suspense>
        ),
      },
    ],
  },

  // App Layout - Protected routes with main Header + Footer
  {
    element: (
      <WithAxiosUser>
        <AppLayout />
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
        path: "/verification",
        element: (
          <Suspense fallback={<Loader />}>
            <VerificationPage />
          </Suspense>
        ),
      },
      {
        path: "/create-business",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateBusinessPage />
          </Suspense>
        ),
      },
      {
        path: "/my-businesses",
        element: (
          <Suspense fallback={<Loader />}>
            <MyBusinessesPage />
          </Suspense>
        ),
      },
      {
        path: "/my-bookings",
        element: (
          <Suspense fallback={<Loader />}>
            <MyBookingsPage />
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
