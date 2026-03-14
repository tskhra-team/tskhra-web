import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function FavoritesTab() {
  const navigate = useNavigate();
  const { t } = useTranslation("profile");

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
        onClick={() => navigate("/")}
        className="bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
      >
        {t("favorites.exploreServices")}
      </Button>
    </div>
  );
}
