import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import { MAGIC_GRADIENT } from "@/Swapping/MagicChain/types";
import type { Item } from "@/Swapping/MyItems/useGetMyItems";
import { Check, Package } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";

export default function SelectableItemCard({
  item,
  isSelected,
  onSelect,
}: {
  item: Item;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation(["swapping"]);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border-2 bg-white ${
        isSelected
          ? "border-swap-magic-mid shadow-lg"
          : "border-swap-secondary hover:border-purple-200"
      }`}
      style={
        isSelected
          ? { boxShadow: "0 8px 30px rgba(168, 85, 247, 0.2)" }
          : undefined
      }
    >
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-white"
            style={{ background: MAGIC_GRADIENT }}
          >
            <Check className="w-3.5 h-3.5" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-28 w-full overflow-hidden bg-gray-50">
        {item.images?.[0] ? (
          <ImageWithFallback
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-sm font-semibold text-swap-text line-clamp-1">
          {item.name}
        </p>
        <p className="text-xs text-swap-text2 mt-0.5">
          {t(`swapping:categories.${item.category}`, item.category)}
        </p>
        {item.estimatedValue != null && (
          <p className="text-xs font-bold text-swap-magic-mid mt-1">
            {item.estimatedValue} ₾
          </p>
        )}
      </div>
    </motion.div>
  );
}
