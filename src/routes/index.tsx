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
const EcommerceCategoryPage = lazy(
  () => import("@/pages/EcommerceCategoryPage"),
);
const ProductCatalogPage = lazy(() => import("@/pages/ProductCatalogPage"));
const SearchResultsPage = lazy(() => import("@/pages/SearchResultsPage"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage"));
const BookingPage = lazy(() => import("@/pages/BookingPage"));
const SwappingPage = lazy(() => import("@/pages/SwappingPage"));
const SwapCatalogPage = lazy(() => import("@/pages/SwapCatalogPage"));
const CreateBusinessPage = lazy(() => import("@/pages/CreateBusinessPage"));
const BusinessCatalogPage = lazy(() => import("@/pages/ServicesCatalogPage"));
const MyBusinessesPage = lazy(() => import("@/pages/MyBusinessesPage"));
const BusinessDetailsPage = lazy(() => import("@/pages/BusinessDetailsPage"));
const MyBookingsPage = lazy(() => import("@/pages/MyBookingsPage"));
const MyItemsPage = lazy(() => import("@/pages/MyItemsPage"));
const OffersPage = lazy(() => import("@/pages/OffersPage"));
const PostItemsPage = lazy(() => import("@/pages/PostItemsPage"));
const TradeOfferPage = lazy(() => import("@/pages/TradeOfferPage"));
const CounterOfferPage = lazy(() => import("@/pages/CounterOfferPage"));

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const VerificationPage = lazy(() => import("@/pages/VerificationPage"));

import BusinessCatalogSkeleton from "@/Booking/BusinessCatalogSkeleton";
import BusinessDetailsSkeleton from "@/Booking/BusinessDetailsSkeleton";
// import MyItemsPage from "@/pages/MyItemsPage";

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
        path: "/ecommerce/category/:slug",
        element: (
          <Suspense fallback={<Loader />}>
            <EcommerceCategoryPage />
          </Suspense>
        ),
      },
      {
        path: "/ecommerce/catalog",
        element: (
          <Suspense fallback={<Loader />}>
            <ProductCatalogPage />
          </Suspense>
        ),
      },
      {
        path: "/ecommerce/search",
        element: (
          <Suspense fallback={<Loader />}>
            <SearchResultsPage />
          </Suspense>
        ),
      },
      {
        path: "/ecommerce/product/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      {
        path: "/swapping",
        element: (
          <Suspense fallback={<Loader />}>
            <SwappingPage />
          </Suspense>
        ),
        children: [
          {
            path: "catalog",
            element: (
              <Suspense fallback={<Loader />}>
                <SwapCatalogPage />
              </Suspense>
            ),
          },
        ],
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
        path: "/swapping",
        element: (
          <Suspense fallback={<Loader />}>
            <SwappingPage />
          </Suspense>
        ),
        children: [
          {
            path: "my-items",
            element: (
              <Suspense fallback={<Loader />}>
                <MyItemsPage />
              </Suspense>
            ),
          },
          {
            path: "post-item",
            element: (
              <Suspense fallback={<Loader />}>
                <PostItemsPage />
              </Suspense>
            ),
          },
          {
            path: "offers",
            element: (
              <Suspense fallback={<Loader />}>
                <OffersPage />
              </Suspense>
            ),
          },
          {
            path: "trade-offer",
            element: (
              <Suspense fallback={<Loader />}>
                <TradeOfferPage />
              </Suspense>
            ),
          },
          {
            path: "counter-offer/:offerId",
            element: (
              <Suspense fallback={<Loader />}>
                <CounterOfferPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/verification",
        element: (
          <Suspense
            fallback={<div className="h-screen w-full bg-[#1B1B1F]"></div>}
          >
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
