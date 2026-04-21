import { Button } from "@/components/ui/button";
import useGetAllItems from "@/Swapping/SwapCatalog/useGetAllItems";
import { SwapItemCard } from "@/Swapping/SwapItemCard";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
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

  const visibleTrades = trades.slice(currentIndex, currentIndex + itemsPerPage);

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
                      >
                        <SwapItemCard item={item} />
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
