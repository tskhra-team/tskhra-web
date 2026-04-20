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

const API_BASE = "http://10.227.164.247:8081";

function toImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

const ACCENT_COLORS = [
  "var(--swap-accent-orange)",
  "var(--swap-primary)",
  "var(--swap-accent-taupe)",
  "var(--swap-accent-gold)",
  "var(--swap-accent-green)",
  "var(--swap-accent-blue)",
];

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
  accentColor?: string;
  colorIndex?: number;
}

export function SwapItemCard({
  item,
  accentColor,
  colorIndex = 0,
}: SwapItemCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(["swapping"]);

  const color = accentColor ?? ACCENT_COLORS[colorIndex % ACCENT_COLORS.length];

  return (
    <div
      className={`rounded-3xl bg-white overflow-hidden border-2 flex flex-col cursor-pointer ${
        item.vip ? "border-amber-400" : "border-swap-secondary"
      }`}
    >
      <div className="relative h-56 w-full overflow-hidden">
        <CardImageSlider
          images={(item.images ?? []).map(toImageUrl)}
          alt={item.name}
          noPhotoLabel={t("swapping:availableTrades.noPhoto")}
          objectFit="contain"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-sm"
            style={{ backgroundColor: color }}
          >
            {t(`swapping:categories.${item.category}`, item.category)}
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
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-swap-primary transition-colors"
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
          className="text-sm font-medium text-gray-800 line-clamp-2 mb-4"
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
                style={{ backgroundColor: "var(--swap-primary-light, rgba(var(--swap-primary-rgb, 0,0,0), 0.1))" }}
              >
                {t(`swapping:categories.${cat}`, cat)}
              </span>
            ))}
          </div>
          <div className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
            <ArrowRightLeft
              className="w-4 h-4"
              style={{ color: "var(--swap-primary)" }}
            />
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
          <span
            className="text-sm font-medium"
            style={{ color: "var(--swap-text2)" }}
          >
            {item.condition}
          </span>
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
