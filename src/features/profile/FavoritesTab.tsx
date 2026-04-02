import { publicInstance } from "@/api";
import useGetFavoriteBusinesses from "@/Booking/useGetFavoriteBusinesses";
import type { Business } from "@/Booking/types/booking.types";
import useRemoveFavorite from "@/Booking/useRemoveFavorite";
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
import { ChevronLeft, ChevronRight, Heart, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 9;

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
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors disabled:opacity-50"
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

export default function FavoritesTab() {
  const navigate = useNavigate();
  const { t } = useTranslation("profile");
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { data: favoriteIds, isLoading } =
    useGetFavoriteBusinesses(isAuthenticated);
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (validFavorites.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="p-8 bg-linear-to-br from-rose-50 to-pink-50 rounded-full mb-6 shadow-sm">
          <Heart className="w-16 h-16 text-rose-400" />
        </div>

        <h3 className="text-2xl font-semibold text-slate-900 tracking-tight mb-3">
          {t("favorites.noFavoritesTitle")}
        </h3>

        <p className="text-slate-500 text-center max-w-md mb-8 leading-relaxed">
          {t("favorites.noFavoritesDescription")}
        </p>

        <Button
          onClick={() => navigate("/booking")}
          className="bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          {t("favorites.exploreServices")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6">{t("favorites.title")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {paginatedFavorites.map(({ id, business }) => (
          <FavoriteBusinessCard
            key={id}
            businessId={id}
            business={business}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent className="bg-white border border-slate-200 rounded-xl p-3">
            <PaginationItem>
              <PaginationLink
                size="default"
                onClick={() =>
                  handlePageChange(Math.max(1, safePage - 1))
                }
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
                <span className="hidden sm:block">
                  {t("favorites.next")}
                </span>
                <ChevronRight className="size-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
