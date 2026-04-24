import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import type { TradeItem } from "@/Swapping/TradeOffer/types";
import { Package, X } from "lucide-react";
import { motion } from "motion/react";

export default function OfferedItemCard({
  item,
  onRemove,
}: {
  item: TradeItem;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative w-28 h-36 rounded-xl border-2 border-swap-primary/20 bg-white shadow-md overflow-hidden group"
    >
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 z-10 w-5 h-5 rounded-full bg-red-500 text-white
          flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity
          hover:bg-red-600 cursor-pointer"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="h-20 w-full bg-gray-50 overflow-hidden p-1">
        {item.image ? (
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-swap-secondary to-white">
            <Package className="w-6 h-6 text-swap-primary/30" />
          </div>
        )}
      </div>

      <div className="p-1.5">
        <p className="text-[11px] font-semibold text-swap-text line-clamp-1">
          {item.name}
        </p>
        {item.estimatedValue != null && (
          <p className="text-[10px] font-bold text-swap-primary">
            {item.estimatedValue} ₾
          </p>
        )}
      </div>
    </motion.div>
  );
}
