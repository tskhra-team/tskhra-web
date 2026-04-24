import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import { CONDITION_KEYS, type TradeItem } from "@/Swapping/TradeOffer/types";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DraggableInventoryItem({
  item,
}: {
  item: TradeItem;
}) {
  const { t } = useTranslation(["swapping"]);
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: item.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`relative rounded-2xl border-2 border-swap-secondary bg-white shadow-md
        cursor-grab active:cursor-grabbing touch-none select-none
        transition-all hover:shadow-lg hover:border-swap-primary/30 group
        ${isDragging ? "opacity-30 scale-95" : ""}`}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity">
        <GripVertical className="w-4 h-4 text-swap-text2" />
      </div>

      <div className="h-24 w-full rounded-t-2xl overflow-hidden bg-gray-50 p-1">
        {item.image ? (
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-swap-secondary to-white">
            <Package className="w-8 h-8 text-swap-primary/30" />
          </div>
        )}
      </div>

      <div className="p-2">
        <p className="text-xs font-semibold text-swap-text line-clamp-1">
          {item.name}
        </p>
        <p className="text-[10px] text-swap-text2 mt-0.5">
          {CONDITION_KEYS[item.condition]
            ? t(`swapping:${CONDITION_KEYS[item.condition]}`)
            : item.condition}
        </p>
        {item.estimatedValue != null && (
          <p className="text-xs font-bold text-swap-primary mt-1">
            {item.estimatedValue} ₾
          </p>
        )}
      </div>
    </div>
  );
}
