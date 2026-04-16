import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRightLeft,
  GripVertical,
  Package,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import useGetMyItems, { type Item } from "@/Swapping/MyItems/useGetMyItems";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TradeItem {
  id: string;
  name: string;
  description: string;
  image: string;
  estimatedValue: number | null;
  condition: string;
  category: string;
}

const CONDITION_LABELS: Record<string, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  USED: "Used",
  DAMAGED: "Damaged",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapItemToTradeItem(item: Item): TradeItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    image: item.images?.[0] ?? "",
    estimatedValue: item.estimatedValue,
    condition: item.condition,
    category: item.category,
  };
}

// Mock target item — in production this would come from route params / API
const MOCK_TARGET_ITEM: TradeItem = {
  id: "target-1",
  name: "iPhone 15 Pro Max",
  description: "256GB, Space Black, excellent condition with original box and all accessories included.",
  image: "",
  estimatedValue: 3500,
  condition: "LIKE_NEW",
  category: "Electronics",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function TargetItemCard({ item }: { item: TradeItem }) {
  return (
    <div className="h-full rounded-3xl border-2 border-swap-secondary bg-white shadow-xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
        {item.image ? (
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-swap-secondary to-white">
            <Package className="w-16 h-16 text-swap-primary/30" />
            <span className="text-sm text-swap-text2 mt-2">No photo</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider bg-swap-primary shadow-sm">
            {item.category}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col">
        <h3
          className="text-xl mb-2 text-swap-text"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          {item.name}
        </h3>

        <div className="mb-4 p-4 rounded-xl bg-swap-secondary flex-1">
          <div className="text-xs uppercase font-bold tracking-wider text-swap-primary mb-1">
            {CONDITION_LABELS[item.condition] ?? item.condition}
          </div>
          <p
            className="text-sm text-gray-700 leading-relaxed"
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            {item.description}
          </p>
        </div>

        {item.estimatedValue != null && (
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-lg font-bold text-swap-primary">
              {item.estimatedValue} ₾
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Draggable inventory card ────────────────────────────────────────────────

function DraggableInventoryItem({ item }: { item: TradeItem }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: item.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`relative shrink-0 w-36 h-44 rounded-2xl border-2 border-swap-secondary bg-white shadow-md
        cursor-grab active:cursor-grabbing touch-none select-none
        transition-all hover:shadow-lg hover:border-swap-primary/30 group
        ${isDragging ? "opacity-30 scale-95" : ""}`}
    >
      {/* Drag handle indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity">
        <GripVertical className="w-4 h-4 text-swap-text2" />
      </div>

      {/* Image */}
      <div className="h-24 w-full rounded-t-2xl overflow-hidden bg-gray-50">
        {item.image ? (
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-swap-secondary to-white">
            <Package className="w-8 h-8 text-swap-primary/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-xs font-semibold text-swap-text line-clamp-1">
          {item.name}
        </p>
        <p className="text-[10px] text-swap-text2 mt-0.5">
          {CONDITION_LABELS[item.condition] ?? item.condition}
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

// ─── Offered item card (in drop zone) ────────────────────────────────────────

function OfferedItemCard({
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

      <div className="h-20 w-full bg-gray-50 overflow-hidden">
        {item.image ? (
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
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

// ─── Drop zone ───────────────────────────────────────────────────────────────

function OfferDropZone({
  offeredItems,
  onRemoveItem,
}: {
  offeredItems: TradeItem[];
  onRemoveItem: (id: string) => void;
}) {
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
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <ArrowRightLeft className="w-5 h-5 text-swap-primary" />
        <h2
          className="text-base font-bold text-swap-text"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          Your Offer
        </h2>
        {offeredItems.length > 0 && (
          <span className="ml-auto text-xs font-medium text-swap-text2 bg-swap-secondary px-2.5 py-1 rounded-full">
            {offeredItems.length} item{offeredItems.length !== 1 ? "s" : ""}
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
              ? "Drop here to add to your offer!"
              : "Drag items from your inventory below"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Build your trade offer by dragging items here
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

// ─── Inventory slider ────────────────────────────────────────────────────────

function InventorySlider({
  items,
  onAddClick,
}: {
  items: TradeItem[];
  onAddClick: () => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-swap-secondary bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-base font-bold text-swap-text"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          Your Items
        </h2>
        <Button
          onClick={onAddClick}
          size="sm"
          className="bg-swap-primary hover:bg-swap-primary/90 text-white gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add New Item
        </Button>
      </div>

      {/* Scrollable slider */}
      {items.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-center">
          <div>
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-swap-text2">
              No items in your inventory yet.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Click "Add New Item" to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((item) => (
            <DraggableInventoryItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main TradeOffer component ───────────────────────────────────────────────

export default function TradeOffer() {
  const [inventoryItems, setInventoryItems] = useState<TradeItem[]>([]);
  const [offeredItems, setOfferedItems] = useState<TradeItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const targetItem: TradeItem = (() => {
    const fromState = (location.state as { targetItem?: TradeItem } | null)?.targetItem;
    if (fromState) {
      sessionStorage.setItem("trade-offer-target", JSON.stringify(fromState));
      return fromState;
    }
    const stored = sessionStorage.getItem("trade-offer-target");
    if (stored) {
      return JSON.parse(stored) as TradeItem;
    }
    return MOCK_TARGET_ITEM;
  })();

  // Fetch user's items from API
  const { data } = useGetMyItems(0, 50);

  useEffect(() => {
    if (data?.content) {
      setInventoryItems(data.content.map(mapItemToTradeItem));
    }
  }, [data]);

  // ── DnD sensors ──

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  // ── DnD handlers ──

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over || over.id !== "offer-drop-zone") return;

    const draggedId = active.id as string;
    const item = inventoryItems.find((i) => i.id === draggedId);

    if (!item) return;
    if (offeredItems.some((i) => i.id === draggedId)) return;

    setInventoryItems((prev) => prev.filter((i) => i.id !== draggedId));
    setOfferedItems((prev) => [...prev, item]);
  };

  const handleRemoveOffer = (id: string) => {
    const item = offeredItems.find((i) => i.id === id);
    if (!item) return;
    setOfferedItems((prev) => prev.filter((i) => i.id !== id));
    setInventoryItems((prev) => [...prev, item]);
  };

  // Active item for drag overlay
  const activeItem = activeId
    ? inventoryItems.find((i) => i.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-swap-bg p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-2xl md:text-3xl text-swap-text flex items-center gap-3"
              style={{ fontFamily: "'Archivo Black', sans-serif" }}
            >
              <ArrowRightLeft className="w-8 h-8 text-swap-primary" />
              Trade Offer
            </h1>
            <p className="text-swap-text2 mt-2 text-sm">
              Drag your items to build your trade offer
            </p>
          </div>

          {/* Main split layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column — Target Item (40%) */}
            <div className="w-full lg:w-[40%]">
              <div className="sticky top-8">
                <p className="text-xs uppercase font-bold tracking-widest text-swap-text2 mb-3">
                  You want
                </p>
                <TargetItemCard item={targetItem} />
              </div>
            </div>

            {/* Right Column (60%) */}
            <div className="w-full lg:w-[60%] flex flex-col gap-6">
              {/* Drop Zone — Top */}
              <div>
                <p className="text-xs uppercase font-bold tracking-widest text-swap-text2 mb-3">
                  You offer
                </p>
                <OfferDropZone
                  offeredItems={offeredItems}
                  onRemoveItem={handleRemoveOffer}
                />
              </div>

              {/* Inventory Slider — Bottom */}
              <div>
                <p className="text-xs uppercase font-bold tracking-widest text-swap-text2 mb-3">
                  Your inventory
                </p>
                <InventorySlider
                  items={inventoryItems}
                  onAddClick={() => navigate("/swapping/post-item", { state: { from: "trade-offer" } })}
                />
              </div>

              {/* Submit offer button */}
              {offeredItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button className="w-full h-12 text-base font-bold bg-swap-primary hover:bg-swap-primary/90 text-white rounded-xl shadow-lg">
                    <ArrowRightLeft className="w-5 h-5 mr-2" />
                    Send Trade Offer ({offeredItems.length} item
                    {offeredItems.length !== 1 ? "s" : ""})
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <div className="w-32 h-40 rounded-xl shadow-2xl ring-2 ring-swap-primary overflow-hidden rotate-2 opacity-90 bg-white">
            <div className="h-24 w-full overflow-hidden">
              {activeItem.image ? (
                <ImageWithFallback
                  src={activeItem.image}
                  alt={activeItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-swap-secondary">
                  <Package className="w-8 h-8 text-swap-primary/30" />
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-xs font-semibold text-swap-text line-clamp-1">
                {activeItem.name}
              </p>
            </div>
          </div>
        ) : null}
      </DragOverlay>

    </DndContext>
  );
}
