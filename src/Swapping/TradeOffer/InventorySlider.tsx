import { Button } from "@/components/ui/button";
import DraggableInventoryItem from "@/Swapping/TradeOffer/DraggableInventoryItem";
import type { TradeItem } from "@/Swapping/TradeOffer/types";
import { ChevronLeft, ChevronRight, Package, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function useItemsPerPage() {
  const [count, setCount] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 3 : 5,
  );

  useEffect(() => {
    const update = () => setCount(window.innerWidth < 768 ? 3 : 5);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export default function InventorySlider({
  items,
  onAddClick,
}: {
  items: TradeItem[];
  onAddClick: () => void;
}) {
  const { t } = useTranslation(["swapping"]);
  const itemsPerPage = useItemsPerPage();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const safePage = Math.min(page, totalPages - 1);
  const pagedItems = items.slice(
    safePage * itemsPerPage,
    (safePage + 1) * itemsPerPage,
  );

  return (
    <div className="rounded-2xl border-2 border-swap-secondary bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-base font-bold text-swap-text"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          {t("swapping:tradeOffer.yourItems")}
        </h2>
        <Button
          onClick={onAddClick}
          size="sm"
          className="bg-swap-primary hover:bg-swap-primary/90 text-white gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {t("swapping:tradeOffer.addNewItem")}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-center">
          <div>
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-swap-text2">
              {t("swapping:tradeOffer.noItems")}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {t("swapping:tradeOffer.noItemsHint")}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {safePage > 0 && (
            <button
              onClick={() => setPage((p) => p - 1)}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border-2 border-swap-secondary shadow-md flex items-center justify-center hover:bg-swap-secondary transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-swap-text" />
            </button>
          )}

          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {pagedItems.map((item) => (
              <DraggableInventoryItem key={item.id} item={item} />
            ))}
          </div>

          {safePage < totalPages - 1 && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border-2 border-swap-secondary shadow-md flex items-center justify-center hover:bg-swap-secondary transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-swap-text" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
