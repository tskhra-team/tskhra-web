import { Button } from "@/components/ui/button";
import { CardImageSlider } from "@/Swapping/CardImageSlider";
import type { Item } from "@/Swapping/MyItems/useGetMyItems";
import {
  ArrowRightLeft,
  Calendar,
  Crown,
  Heart,
  MapPin,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CONDITION_CONFIG: Record<string, { key: string; className: string }> = {
  NEW: { key: "conditionNew", className: "bg-green-700 text-white" },
  LIKE_NEW: { key: "conditionGood", className: "bg-blue-700 text-white" },
  USED: { key: "conditionFair", className: "bg-orange-600 text-white" },
  DAMAGED: { key: "conditionPoor", className: "bg-red-700 text-white" },
};

const TRADE_RANGE_KEYS: Record<string, string> = {
  CITY_WIDE: "tradeRangeCityWide",
  COUNTRY_WIDE: "tradeRangeCountryWide",
};

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface SwapItemCardProps {
  item: Item;
}

export function SwapItemCard({ item }: SwapItemCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(["swapping"]);

  return (
    <div
      className={`rounded-3xl bg-white overflow-hidden border-2 flex flex-col cursor-pointer ${
        item.vip ? "border-amber-400" : "border-swap-secondary"
      }`}
      onClick={() => navigate(`/swapping/trade-offer?id=${item.id}`)}
    >
      <div className="relative h-56 w-full overflow-hidden">
        <CardImageSlider
          images={item.images ?? []}
          alt={item.name}
          noPhotoLabel={t("swapping:availableTrades.noPhoto")}
          objectFit="contain"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${CONDITION_CONFIG[item.condition]?.className ?? "bg-gray-500 text-white"}`}
          >
            {t(
              `swapping:postItem.${CONDITION_CONFIG[item.condition]?.key ?? "conditionNew"}`,
            )}
          </span>
          {item.vip && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 bg-linear-to-r from-amber-400 to-yellow-500 text-amber-900">
              <Crown className="w-3 h-3" />
              VIP
            </span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-swap-primary/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-swap-secondary hover:text-swap-primary transition-colors"
        >
          <Heart className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3
          className="text-lg mb-1 line-clamp-1"
          style={{
            fontFamily: "'Archivo Black', sans-serif",
            color: "var(--swap-text)",
          }}
        >
          {item.name}
        </h3>

        <div
          className="text-sm h-10 font-medium text-gray-800 line-clamp-2 mb-4"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          {item.description}
        </div>

        <div
          className="mb-6 p-4 rounded-xl relative flex-1"
          style={{ backgroundColor: "var(--swap-secondary)" }}
        >
          <div
            className="text-xs uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5"
            style={{ color: "var(--swap-primary)" }}
          >
            <Search className="w-3.5 h-3.5" />
            {t("swapping:catalog.lookingFor", "Looking for")}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(item.desiredCategories?.length > 0
              ? item.desiredCategories
              : ["Electronics", "Fashion", "Books"]
            ).map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-1 rounded-full text-xs font-medium text-swap-primary"
                style={{
                  backgroundColor:
                    "var(--swap-primary-light, rgba(var(--swap-primary-rgb, 0,0,0), 0.1))",
                }}
              >
                {t(`swapping:categories.${cat}`, cat)}
              </span>
            ))}
          </div>
          <div className="absolute -right-3 -top-3 w-8 text-swap-primary h-8 rounded-full bg-white shadow-md flex items-center justify-center">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
        </div>

        <Button
          className="bg-swap-primary hover:bg-swap-secondary hover:text-swap-primary"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/swapping/trade-offer?id=${item.id}`);
          }}
        >
          {t("swapping:availableTrades.makeOffer")}
        </Button>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {item.estimatedValue && (
            <span className="text-sm font-bold text-swap-primary">
              {item.estimatedValue} ₾
            </span>
          )}
          <div className="flex gap-2 items-center text-swap-text2">
            <ArrowRightLeft className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t(
                `swapping:postItem.${TRADE_RANGE_KEYS[item.tradeRange] ?? "tradeRangeCityWide"}`,
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatRelativeTime(item.createdAt)}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {item.city}
          </div>
        </div>
      </div>
    </div>
  );
}
