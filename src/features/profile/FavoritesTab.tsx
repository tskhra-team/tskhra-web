import { publicInstance } from "@/api";
import useGetFavoriteBusinesses from "@/Booking/useGetFavoriteBusinesses";
import type { Business } from "@/Booking/types/booking.types";
import useRemoveFavorite from "@/Booking/useRemoveFavorite";
import useEcommerceFavorites from "@/Ecommerce/hooks/useEcommerceFavorites";
import { MOCK_PRODUCTS, STORE_COLORS } from "@/Ecommerce/ProductCatalog";
import { SmartImage } from "@/components/SmartImage";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useAuth } from "@/context/useAuth";
import { cn } from "@/lib/utils";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Loader2,
  CalendarCheck,
  ShoppingBag,
  ArrowLeftRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

type ServiceTab = "booking" | "ecommerce" | "swapping";

const ITEMS_PER_PAGE = 9;

// ── Booking Favorite Card ─────────────────────────────────────────────

function FavoriteBusinessCard({
  business,
  businessId,
}: {
  business: Business;
  businessId: number;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: removeFavorite, isPending } = useRemoveFavorite();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFavorite(
      { businessId: String(businessId) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getUser"] });
        },
      },
    );
  };

  return (
    <Card
      className="group overflow-hidden transition-all duration-500 cursor-pointer flex flex-col"
      onClick={() => navigate(`/booking/business/${businessId}`)}
    >
      <div className="w-full h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-10" />
        <SmartImage
          src={business.mainImage}
          alt={business.businessName}
          containerClassName="aspect-video w-full rounded-lg"
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-500 brightness-95 group-hover:brightness-105"
        />
        <button
          onClick={handleRemove}
          disabled={isPending}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
        </button>
      </div>
      <div className="flex-1 flex flex-col p-5">
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-1">
          {business.businessName}
        </CardTitle>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">
          {business.description || "\u00A0"}
        </p>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{business.city}</span>
          <span>{business.addressDetail}</span>
        </div>
      </div>
    </Card>
  );
}

// ── Booking Favorites Section ─────────────────────────────────────────

function BookingFavorites() {
  const navigate = useNavigate();
  const { t } = useTranslation("profile");
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { data: favoriteIds, isLoading } =
    useGetFavoriteBusinesses(isAuthenticated);
  const queryClient = useQueryClient();
  const { mutate: removeFavorite } = useRemoveFavorite();
  const [currentPage, setCurrentPage] = useState(1);

  const lang = i18n.language.split("-")[0].toUpperCase();

  const businessQueries = useQueries({
    queries: (favoriteIds ?? []).map((id) => ({
      queryKey: ["favoriteBusiness", String(id), lang],
      queryFn: async () => {
        const response = await publicInstance.get(`/business/${id}`, {
          params: { lang },
        });
        return { id, business: response.data as Business };
      },
      staleTime: 5 * 60 * 1000,
    })),
  });

  const allLoaded = businessQueries.every((q) => !q.isLoading);
  const validFavorites = businessQueries
    .filter((q) => q.data?.business)
    .map((q) => q.data!);

  const cleanedUp = useRef(false);
  useEffect(() => {
    if (!allLoaded || cleanedUp.current || !favoriteIds?.length) return;
    const validIds = new Set(validFavorites.map((f) => f.id));
    const staleIds = favoriteIds.filter((id) => !validIds.has(id));
    if (staleIds.length > 0) {
      cleanedUp.current = true;
      staleIds.forEach((id) => {
        removeFavorite(
          { businessId: String(id) },
          {
            onSuccess: () =>
              queryClient.invalidateQueries({ queryKey: ["getUser"] }),
          },
        );
      });
    }
  }, [allLoaded, favoriteIds, validFavorites, removeFavorite, queryClient]);

  const totalPages = Math.max(
    1,
    Math.ceil(validFavorites.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedFavorites = validFavorites.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading || !allLoaded) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (validFavorites.length === 0) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center py-16 px-4">
        <div className="p-6 bg-linear-to-br from-orange-50 to-amber-50 rounded-full mb-5 shadow-sm">
          <CalendarCheck className="w-12 h-12 text-orange-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-2">
          {t("favorites.noBookingTitle")}
        </h3>
        <p className="text-slate-500 text-center max-w-md mb-6 leading-relaxed">
          {t("favorites.noBookingDescription")}
        </p>
        <Button
          onClick={() => navigate("/booking")}
          className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          {t("favorites.exploreServices")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {paginatedFavorites.map(({ id, business }) => (
          <FavoriteBusinessCard key={id} businessId={id} business={business} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent className="bg-white border border-slate-200 rounded-xl p-3">
            <PaginationItem>
              <PaginationLink
                size="default"
                onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                className={cn(
                  "gap-1 px-2.5 sm:pl-2.5",
                  safePage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-slate-50",
                )}
              >
                <ChevronLeft className="size-4" />
                <span className="hidden sm:block">
                  {t("favorites.previous")}
                </span>
              </PaginationLink>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={safePage === page}
                    className={cn(
                      "cursor-pointer transition-colors duration-200",
                      safePage === page
                        ? "bg-linear-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800"
                        : "hover:bg-slate-50 hover:text-indigo-700",
                    )}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationLink
                size="default"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, safePage + 1))
                }
                className={cn(
                  "gap-1 px-2.5 sm:pr-2.5",
                  safePage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-slate-50",
                )}
              >
                <span className="hidden sm:block">{t("favorites.next")}</span>
                <ChevronRight className="size-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

// ── Ecommerce Favorites Section ───────────────────────────────────────

function EcommerceFavorites() {
  const navigate = useNavigate();
  const { t } = useTranslation("profile");
  const { favoriteIds, removeFavorite } = useEcommerceFavorites();
  const [currentPage, setCurrentPage] = useState(1);

  const favoriteProducts = MOCK_PRODUCTS.filter((p) =>
    favoriteIds.includes(p.id),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(favoriteProducts.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginated = favoriteProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center py-16 px-4">
        <div className="p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-full mb-5 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-2">
          {t("favorites.noEcommerceTitle")}
        </h3>
        <p className="text-slate-500 text-center max-w-md mb-6 leading-relaxed">
          {t("favorites.noEcommerceDescription")}
        </p>
        <Button
          onClick={() => navigate("/ecommerce")}
          className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          {t("favorites.exploreProducts")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {paginated.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden transition-all duration-500 cursor-pointer flex flex-col"
            onClick={() => navigate(`/ecommerce/product/${product.id}`)}
          >
            <div className="w-full h-48 overflow-hidden relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Store badge */}
              <span
                className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold"
                style={{
                  backgroundColor: STORE_COLORS[product.store].bg,
                  color: STORE_COLORS[product.store].text,
                }}
              >
                {product.store}
              </span>
              {/* Condition badge */}
              <span className="absolute top-3 right-12 z-10 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-medium text-slate-700">
                {product.condition}
              </span>
              {/* Remove favorite */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(product.id);
                }}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors cursor-pointer"
              >
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </button>
            </div>
            <div className="flex-1 flex flex-col p-5">
              <CardTitle className="text-lg font-semibold mb-1 line-clamp-1">
                {product.name}
              </CardTitle>
              <p className="text-xs text-slate-500 mb-3">
                {product.category}
              </p>
              <p className="text-base font-bold text-slate-900 mt-auto">
                {product.price}₾
              </p>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent className="bg-white border border-slate-200 rounded-xl p-3">
            <PaginationItem>
              <PaginationLink
                size="default"
                onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                className={cn(
                  "gap-1 px-2.5 sm:pl-2.5",
                  safePage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-slate-50",
                )}
              >
                <ChevronLeft className="size-4" />
                <span className="hidden sm:block">
                  {t("favorites.previous")}
                </span>
              </PaginationLink>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={safePage === page}
                    className={cn(
                      "cursor-pointer transition-colors duration-200",
                      safePage === page
                        ? "bg-linear-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800"
                        : "hover:bg-slate-50 hover:text-indigo-700",
                    )}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationLink
                size="default"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, safePage + 1))
                }
                className={cn(
                  "gap-1 px-2.5 sm:pr-2.5",
                  safePage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-slate-50",
                )}
              >
                <span className="hidden sm:block">{t("favorites.next")}</span>
                <ChevronRight className="size-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

// ── Swapping Favorites Section (placeholder) ──────────────────────────

function SwappingFavorites() {
  const navigate = useNavigate();
  const { t } = useTranslation("profile");

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center py-16 px-4">
      <div className="p-6 bg-linear-to-br from-red-50 to-rose-50 rounded-full mb-5 shadow-sm">
        <ArrowLeftRight className="w-12 h-12 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-2">
        {t("favorites.noSwappingTitle")}
      </h3>
      <p className="text-slate-500 text-center max-w-md mb-6 leading-relaxed">
        {t("favorites.noSwappingDescription")}
      </p>
      <Button
        onClick={() => navigate("/swapping")}
        className="bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
      >
        {t("favorites.exploreSwapping")}
      </Button>
    </div>
  );
}

// ── Main FavoritesTab ─────────────────────────────────────────────────

const SERVICE_TABS: {
  value: ServiceTab;
  labelKey: string;
  icon: typeof CalendarCheck;
  activeColor: string;
}[] = [
  {
    value: "booking",
    labelKey: "favorites.tabBooking",
    icon: CalendarCheck,
    activeColor: "from-orange-500 to-orange-600",
  },
  {
    value: "ecommerce",
    labelKey: "favorites.tabEcommerce",
    icon: ShoppingBag,
    activeColor: "from-green-500 to-green-600",
  },
  {
    value: "swapping",
    labelKey: "favorites.tabSwapping",
    icon: ArrowLeftRight,
    activeColor: "from-red-500 to-red-600",
  },
];

const VALID_TABS: ServiceTab[] = ["booking", "ecommerce", "swapping"];

export default function FavoritesTab() {
  const { t } = useTranslation("profile");
  const [searchParams] = useSearchParams();
  const favTabParam = searchParams.get("favTab") as ServiceTab | null;
  const initialTab = favTabParam && VALID_TABS.includes(favTabParam) ? favTabParam : "booking";
  const [activeTab, setActiveTab] = useState<ServiceTab>(initialTab);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6">{t("favorites.title")}</h2>

      {/* Service Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {SERVICE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer",
                isActive
                  ? `bg-linear-to-r ${tab.activeColor} text-white shadow-md`
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800",
              )}
            >
              <Icon className="w-4 h-4" />
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "booking" && <BookingFavorites />}
      {activeTab === "ecommerce" && <EcommerceFavorites />}
      {activeTab === "swapping" && <SwappingFavorites />}
    </div>
  );
}
