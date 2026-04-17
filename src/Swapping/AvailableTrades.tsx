import { Button } from "@/components/ui/button";
import { CardImageSlider } from "@/Swapping/CardImageSlider";
import useGetAllItems from "@/Swapping/SwapCatalog/useGetAllItems";
import {
  ArrowRight,
  ArrowRightLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Crown,
  Heart,
  Loader2,
  MapPin,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
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

function useItemsPerPage() {
  const [count, setCount] = useState(4);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCount(1);
      else if (window.innerWidth < 1024) setCount(2);
      else setCount(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

export function AvailableTrades() {
  const navigate = useNavigate();
  const { t } = useTranslation(["swapping"]);
  const { data, isLoading } = useGetAllItems(0, 7);
  const trades = [...(data?.content ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 7);

  const itemsPerPage = useItemsPerPage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const maxIndex = Math.max(0, trades.length - itemsPerPage);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (trades.length <= itemsPerPage || isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, trades.length, itemsPerPage, isPaused]);

  const visibleTrades = trades.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <>
      <div className="px-8 md:px-20 text-3xl mb-10 font-bold flex justify-between items-center">
        <h1>{t("swapping:availableTrades.title")}</h1>
        <Button
          variant="outline"
          className=" h-10 rounded-4xl bg-swap-primary text-swap-secondary hover:bg-swap-secondary hover:text-swap-primary"
          onClick={() => navigate("/swapping/catalog")}
        >
          {t("swapping:availableTrades.viewAll")}
          <ArrowRight />
        </Button>
      </div>

      <div className="px-8 md:px-20 mb-20">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-swap-primary" />
          </div>
        ) : trades.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-base">
            {t("swapping:availableTrades.noTrades")}
          </div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {trades.length > itemsPerPage && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prev}
                  className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-swap-primary hover:bg-swap-primary hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={next}
                  className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-swap-primary hover:bg-swap-primary hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </>
            )}

            <div className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {visibleTrades.map((item, idx) => {
                    const accentColor =
                      ACCENT_COLORS[
                        trades.indexOf(item) % ACCENT_COLORS.length
                      ];

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -30 }}
                        transition={{
                          duration: 0.45,
                          delay: idx * 0.08,
                          type: "spring",
                          stiffness: 300,
                          damping: 28,
                        }}
                        className={`rounded-3xl bg-white overflow-hidden border-2 flex flex-col cursor-pointer ${
                          item.vip
                            ? "border-amber-400"
                            : "border-swap-secondary"
                        }`}
                      >
                        {/* Image Header */}
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
                              style={{ backgroundColor: accentColor }}
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

                        {/* Details */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3
                            className="text-lg mb-4 line-clamp-1"
                            style={{
                              fontFamily: "'Archivo Black', sans-serif",
                              color: "var(--swap-text)",
                            }}
                          >
                            {item.name}
                          </h3>

                          <div
                            className="mb-6 p-4 rounded-xl relative flex-1"
                            style={{
                              backgroundColor: "var(--swap-secondary)",
                            }}
                          >
                            <div
                              className="text-xs uppercase font-bold tracking-wider mb-1"
                              style={{ color: "var(--swap-primary)" }}
                            >
                              {t("swapping:availableTrades.description")}
                            </div>
                            <div
                              className="text-sm font-medium text-gray-800 line-clamp-2"
                              style={{
                                fontFamily: "'Work Sans', sans-serif",
                              }}
                            >
                              {item.description}
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

                          {/* Footer */}
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
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {trades.length > itemsPerPage && (
              <div className="flex gap-2 justify-center mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "w-8 bg-swap-primary"
                        : "w-2.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
