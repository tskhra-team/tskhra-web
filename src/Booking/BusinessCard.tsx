import useAddFavorite from "@/Booking/useAddFavorite";
import type { BusinessType } from "@/Booking/useGetAllBookingBusinesses";
import useGetFavoriteBusinesses from "@/Booking/useGetFavoriteBusinesses";
import useRemoveFavorite from "@/Booking/useRemoveFavorite";
import { SmartImage } from "@/components/SmartImage";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/useAuth";
import { scrollToTop } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function BusinessCard({ business }: { business: BusinessType }) {
  const { t } = useTranslation("booking");
  const { isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: addFavorite, isPending: isAdding } = useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavorite();
  const { data: favorites } = useGetFavoriteBusinesses(isAuthenticated);
  const navigate = useNavigate();

  const handkleClick = (id: string) => {
    scrollToTop();
    navigate(`/booking/business/${id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent, businessId: string) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      login();
      return;
    }
    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    };
    const isFav = favorites?.some((id) => String(id) === String(businessId));
    if (isFav) {
      removeFavorite({ businessId }, { onSuccess });
    } else {
      addFavorite({ businessId }, { onSuccess });
    }
  };

  return (
    <Card
      key={business.businessId}
      className="group overflow-hidden transition-all duration-500 cursor-pointer flex flex-col"
      onClick={() => handkleClick(business.businessId)}
    >
      {/* Image Section */}
      <div className="w-full h-48 overflow-hidden relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-10" />

        <SmartImage
          src={business.mainImage}
          alt={business.businessName}
          containerClassName="aspect-video w-full rounded-lg"
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-500 brightness-95 group-hover:brightness-105"
        />

        {/* Call Type Tag Overlay */}
        <div className="absolute top-3 left-3 z-20">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-slate-800 shadow-lg border border-white/40">
            {t(`businessDetails.callType.${business.callType.toLowerCase()}`)}
          </span>
        </div>

        {/* Favorite Heart Icon */}
        <button
          onClick={(e) => handleToggleFavorite(e, business.businessId)}
          disabled={isAdding || isRemoving}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-white/40 hover:bg-white transition-colors disabled:opacity-50"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              favorites?.some(
                (id) => String(id) === String(business.businessId),
              )
                ? "fill-rose-500 text-rose-500"
                : "text-slate-600 hover:text-rose-500"
            }`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-5">
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-1 overflow-hidden text-ellipsis">
          {business.businessName}
        </CardTitle>

        {/* Description - Fixed size for consistent UI */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">
          {business.description || "\u00A0"}
        </p>

        {/* City */}
        <div className="flex items-center gap-1 mb-4 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{business.city}</span>
          <span>{business.addressDetail}</span>
        </div>

        {/* Button Section */}
        <div className="flex justify-end mt-auto pt-3 border-t border-gray-100">
          <Button
            className="relative overflow-hidden bg-linear-to-r from-slate-700 to-slate-900 text-white px-8 py-2.5 rounded-full cursor-pointer font-semibold shadow-lg transition-all duration-500 border-2 border-slate-600/30 backdrop-blur-sm group-hover:shadow-2xl hover:from-slate-600 hover:to-slate-800"
            onClick={(e) => {
              e.stopPropagation();
              handkleClick(business.businessId);
            }}
          >
            <span className="relative z-10 tracking-wide">
              {t("catalog.viewDetails")}
            </span>
            {/* Animated shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-linear-to-r from-transparent via-white/25 to-transparent" />
            {/* Inner subtle glow */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent" />
            {/* Top highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
