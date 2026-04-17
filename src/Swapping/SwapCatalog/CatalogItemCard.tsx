import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CardImageSlider } from "@/Swapping/CardImageSlider";
import type { Item } from "@/Swapping/MyItems/useGetMyItems";
import {
  Calendar,
  ChevronDown,
  Crown,
  MapPin,
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useNavigate } from "react-router-dom";

const CONDITION_KEYS: Record<string, string> = {
  NEW: "conditionNew",
  LIKE_NEW: "conditionGood",
  USED: "conditionFair",
  DAMAGED: "conditionPoor",
};

export function CatalogItemCard({ item }: { item: Item }) {
  const navigate = useNavigate();
  const { t } = useTranslation(["swapping"]);

  const locale = i18n.language === "ka" ? "ka-GE" : "en-US";
  const formattedDate = new Date(item.createdAt).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="rounded-3xl bg-white shadow-xl overflow-hidden border-2 flex flex-col group cursor-pointer border-amber-400 shadow-amber-100"
    >
      {/* Image Header */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-50">
        <CardImageSlider
          images={item.images ?? []}
          alt={item.name}
          objectFit="contain"
        />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-sm bg-swap-primary">
            {t(`swapping:categories.${item.category}`, item.category)}
          </span>
        </div>

        <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 bg-linear-to-r from-amber-400 to-yellow-500 text-amber-900">
          <Crown className="w-3 h-3" />
          VIP
        </span>
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        <h3
          className="text-lg line-clamp-1"
          style={{
            fontFamily: "'Archivo Black', sans-serif",
            color: "var(--swap-text)",
          }}
        >
          {item.name}
        </h3>

        <div
          className="text-sm font-medium text-gray-800 line-clamp-2"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          {item.description}
        </div>

        <Button
          className="w-full bg-swap-primary hover:bg-swap-secondary hover:text-swap-primary"
          onClick={() => {
            navigate(`/swapping/trade-offer?id=${item.id}`);
          }}
        >
          {t("swapping:catalog.makeOffer", "Make Offer")}
        </Button>

        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit"
            style={{
              color: "var(--swap-primary)",
              backgroundColor: "var(--swap-secondary)",
            }}
          >
            {t(`swapping:postItem.${CONDITION_KEYS[item.condition] || "conditionNew"}`)}
          </span>

          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center gap-1.5 text-xs font-semibold text-swap-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Search className="w-3.5 h-3.5" />
                {t("swapping:catalog.lookingFor", "Looking for")}
                <ChevronDown className="w-3 h-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-56 p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">
                {t("swapping:catalog.lookingFor", "Looking for")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(item.desiredCategories?.length > 0
                  ? item.desiredCategories
                  : ["Electronics", "Fashion", "Other"]
                ).map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-swap-secondary text-swap-primary"
                  >
                    {t(`swapping:categories.${cat}`, cat)}
                  </span>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {item.city}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
