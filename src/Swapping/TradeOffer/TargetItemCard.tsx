import { CardImageSlider } from "@/Swapping/CardImageSlider";
import { CONDITION_KEYS, type TradeItem } from "@/Swapping/TradeOffer/types";
import {
  ArrowRightLeft,
  Calendar,
  Crown,
  Heart,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

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

export default function TargetItemCard({ item }: { item: TradeItem }) {
  const { t } = useTranslation(["swapping"]);
  return (
    <div
      className={`h-full rounded-3xl overflow-hidden border-2 flex flex-col bg-white ${
        item.vipStatus ? "border-amber-400" : "border-swap-secondary"
      }`}
    >
      <div className="relative h-56 w-full overflow-hidden">
        <CardImageSlider
          images={item.images}
          alt={item.name}
          noPhotoLabel={t("swapping:tradeOffer.noPhoto")}
          objectFit="contain"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${CONDITION_CONFIG[item.condition]?.className ?? "bg-gray-500 text-white"}`}
          >
            {CONDITION_KEYS[item.condition]
              ? t(`swapping:${CONDITION_KEYS[item.condition]}`)
              : item.condition}
          </span>
          {item.vipStatus && (
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

        <p
          className="text-sm font-medium text-gray-800 line-clamp-2 mb-4"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          {item.description}
        </p>

        {item.estimatedValue != null && (
          <div className="flex mb-2 items-center gap-2 mt-auto pt-4 border-t border-gray-100">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-swap-primary">
              {item.estimatedValue} ₾
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
    </div>
  );
}
