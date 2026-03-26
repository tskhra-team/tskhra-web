import useAddFavorite from "@/Booking/useAddFavorite";
import useGetFavoriteBusinesses from "@/Booking/useGetFavoriteBusinesses";
import useRemoveFavorite from "@/Booking/useRemoveFavorite";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Briefcase, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type BusinessHeaderProps = {
  businessName: string;
  category: string;
  callType: string;
  businessId: string;
};

export default function BusinessHeader({
  businessName,
  category,
  callType,
  businessId,
}: BusinessHeaderProps) {
  const { t } = useTranslation("booking");
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites } = useGetFavoriteBusinesses(isAuthenticated);
  const { mutate: addFavorite, isPending: isAdding } = useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavorite();

  const isFavorite = favorites?.some(
    (id) => String(id) === String(businessId),
  );

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      login();
      return;
    }

    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    };

    if (isFavorite) {
      removeFavorite({ businessId }, { onSuccess });
    } else {
      addFavorite({ businessId }, { onSuccess });
    }
  };

  const getCallTypeBadge = () => {
    switch (callType.toLowerCase()) {
      case "outcall":
        return (
          <Badge variant="secondary">
            {t("businessDetails.callType.outcall")}
          </Badge>
        );
      case "onsite":
        return (
          <Badge variant="default">
            {t("businessDetails.callType.onsite")}
          </Badge>
        );
      case "both":
        return (
          <Badge variant="outline">{t("businessDetails.callType.both")}</Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-hidden min-w-0">
        <button
          onClick={() => navigate("/")}
          className="hover:text-primary transition-colors font-medium shrink-0"
        >
          {t("businessDetails.breadcrumb.home")}
        </button>
        <span className="text-muted-foreground/50 shrink-0">•</span>
        <button
          onClick={() => navigate("/booking")}
          className="hover:text-primary transition-colors font-medium shrink-0"
        >
          {t("businessDetails.breadcrumb.booking")}
        </button>
        <span className="text-muted-foreground/50 shrink-0">•</span>
        <span className="text-[#100b2e] font-semibold truncate min-w-0">{businessName}</span>
      </div>

      {/* Business Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text break-all flex-1 min-w-0">
            {businessName}
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleFavorite}
              disabled={isAdding || isRemoving}
              className="p-2 rounded-full hover:bg-rose-50 transition-colors disabled:opacity-50"
              title={
                isFavorite
                  ? t("businessDetails.favorite.remove")
                  : t("businessDetails.favorite.add")
              }
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isFavorite
                    ? "fill-rose-500 text-rose-500"
                    : "text-muted-foreground hover:text-rose-500"
                }`}
              />
            </button>
            {getCallTypeBadge()}
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="w-5 h-5 text-primary/70" />
          <span className="text-base">{category}</span>
        </div>
      </div>
    </>
  );
}
