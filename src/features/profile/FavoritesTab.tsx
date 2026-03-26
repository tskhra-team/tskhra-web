import useGetFavoriteBusinesses from "@/Booking/useGetFavoriteBusinesses";
import useGetBookingSingleBusiness from "@/Booking/useGetBookingSingleBusiness";
import useRemoveFavorite from "@/Booking/useRemoveFavorite";
import { SmartImage } from "@/components/SmartImage";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, MapPin, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function FavoriteBusinessCard({ businessId }: { businessId: number }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const lang = i18n.language.split("-")[0].toUpperCase();

  const { data: business, isLoading } = useGetBookingSingleBusiness(
    String(businessId),
    true,
    lang,
  );
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

  if (isLoading) {
    return (
      <Card className="overflow-hidden flex flex-col animate-pulse">
        <div className="w-full h-48 bg-slate-200" />
        <div className="p-5 space-y-3">
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
      </Card>
    );
  }

  if (!business) return null;

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
  const { isAuthenticated } = useAuth();
  const { data: favoriteIds, isLoading } =
    useGetFavoriteBusinesses(isAuthenticated);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!favoriteIds || favoriteIds.length === 0) {
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
        {favoriteIds.map((id) => (
          <FavoriteBusinessCard key={id} businessId={id} />
        ))}
      </div>
    </div>
  );
}
