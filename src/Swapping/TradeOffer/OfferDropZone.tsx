import OfferedItemCard from "@/Swapping/TradeOffer/OfferedItemCard";
import type { TradeItem } from "@/Swapping/TradeOffer/types";
import { useDroppable } from "@dnd-kit/core";
import { ArrowRightLeft, Package } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";

export default function OfferDropZone({
  offeredItems,
  onRemoveItem,
}: {
  offeredItems: TradeItem[];
  onRemoveItem: (id: string) => void;
}) {
  const { t } = useTranslation(["swapping"]);
  const { setNodeRef, isOver } = useDroppable({ id: "offer-drop-zone" });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-50 rounded-2xl border-2 border-dashed p-5 transition-all ${
        isOver
          ? "border-swap-primary bg-swap-primary/5 shadow-inner"
          : "border-gray-300 bg-white"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <ArrowRightLeft className="w-5 h-5 text-swap-primary" />
        <h2
          className="text-base font-bold text-swap-text"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          {t("swapping:tradeOffer.yourOffer")}
        </h2>
        {offeredItems.length > 0 && (
          <span className="ml-auto text-xs font-medium text-swap-text2 bg-swap-secondary px-2.5 py-1 rounded-full">
            {offeredItems.length}{" "}
            {offeredItems.length !== 1
              ? t("swapping:tradeOffer.items")
              : t("swapping:tradeOffer.item")}
          </span>
        )}
      </div>

      {offeredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <motion.div
            animate={isOver ? { scale: 1.1 } : { scale: 1 }}
            className="w-16 h-16 rounded-full bg-swap-secondary flex items-center justify-center mb-3"
          >
            <Package className="w-8 h-8 text-swap-primary/40" />
          </motion.div>
          <p className="text-sm font-medium text-swap-text2">
            {isOver
              ? t("swapping:tradeOffer.dropHint")
              : t("swapping:tradeOffer.dragHint")}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {t("swapping:tradeOffer.dragDescription")}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <AnimatePresence mode="popLayout">
            {offeredItems.map((item) => (
              <OfferedItemCard
                key={item.id}
                item={item}
                onRemove={() => onRemoveItem(item.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
