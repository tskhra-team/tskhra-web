import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import useGetMyItems, { type Item } from "@/Swapping/MyItems/useGetMyItems";
import type { TradeOffer, TradeOfferItem } from "@/Swapping/Offers/types";
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
import {
  ArrowLeft,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Package,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useCreateCounterOffer from "./useCreateCounterOffer";
import useGetTradeOfferById from "./useGetTradeOfferById";
import useGetUserItems from "./useGetUserItems";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TradeItem {
  id: string;
  ownerId?: number;
  name: string;
  description: string;
  image: string;
  estimatedValue: number | null;
  condition: string;
  category: string;
}

type DragSource = "my-inventory" | "their-inventory" | "my-offer" | "requested";

const CONDITION_KEYS: Record<string, string> = {
  NEW: "tradeOffer.conditionNew",
  LIKE_NEW: "tradeOffer.conditionLikeNew",
  USED: "tradeOffer.conditionUsed",
  DAMAGED: "tradeOffer.conditionDamaged",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapItemToTradeItem(item: Item): TradeItem {
  return {
    id: item.id,
    ownerId: item.ownerId,
    name: item.name,
    description: item.description,
    image: item.images?.[0] ?? "",
    estimatedValue: item.estimatedValue,
    condition: item.condition,
    category: item.category,
  };
}

function mapOfferItemToTradeItem(item: TradeOfferItem): TradeItem {
  return {
    id: item.id,
    name: item.name,
    description: "",
    image: item.images?.[0] ?? item.image ?? "",
    estimatedValue: item.estimatedValue ?? null,
    condition: item.condition ?? "",
    category: item.category ?? "",
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DraggableInventoryItem({
  item,
  source,
}: {
  item: TradeItem;
  source: DragSource;
}) {
  const { t } = useTranslation(["swapping"]);
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: `${source}::${item.id}`,
    data: { source, item },
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

function CounterOfferDropZone({
  zoneId,
  title,
  items,
  onRemoveItem,
  dragHint,
  dropHint,
  dragDescription,
  itemLabel,
  itemsLabel,
}: {
  zoneId: string;
  title: string;
  items: TradeItem[];
  onRemoveItem: (id: string) => void;
  dragHint: string;
  dropHint: string;
  dragDescription: string;
  itemLabel: string;
  itemsLabel: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: zoneId });

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
          {title}
        </h2>
        {items.length > 0 && (
          <span className="ml-auto text-xs font-medium text-swap-text2 bg-swap-secondary px-2.5 py-1 rounded-full">
            {items.length} {items.length !== 1 ? itemsLabel : itemLabel}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <motion.div
            animate={isOver ? { scale: 1.1 } : { scale: 1 }}
            className="w-16 h-16 rounded-full bg-swap-secondary flex items-center justify-center mb-3"
          >
            <Package className="w-8 h-8 text-swap-primary/40" />
          </motion.div>
          <p className="text-sm font-medium text-swap-text2">
            {isOver ? dropHint : dragHint}
          </p>
          <p className="text-xs text-gray-400 mt-1">{dragDescription}</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
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

// ─── Inventory Panel ─────────────────────────────────────────────────────────

function useItemsPerPage() {
  const [count, setCount] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 3 : 4,
  );

  useEffect(() => {
    const update = () => setCount(window.innerWidth < 768 ? 3 : 4);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

function InventoryPanel({
  title,
  items,
  source,
}: {
  title: string;
  items: TradeItem[];
  source: DragSource;
}) {
  const itemsPerPage = useItemsPerPage();
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const safePage = Math.min(page, totalPages - 1);
  const pagedItems = items.slice(
    safePage * itemsPerPage,
    (safePage + 1) * itemsPerPage,
  );

  return (
    <div className="rounded-2xl border-2 border-swap-secondary bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-sm font-bold text-swap-text"
          style={{ fontFamily: "'Archivo Black', sans-serif" }}
        >
          {title}
        </h2>
        {items.length > 0 && (
          <span className="text-xs text-swap-text2">
            {safePage + 1}/{totalPages}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-center">
          <div>
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-swap-text2">No items available</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {safePage > 0 && (
            <button
              onClick={() => setPage((p) => p - 1)}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border-2 border-swap-secondary shadow-md flex items-center justify-center hover:bg-swap-secondary transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-swap-text" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            {pagedItems.map((item) => (
              <DraggableInventoryItem
                key={item.id}
                item={item}
                source={source}
              />
            ))}
          </div>

          {safePage < totalPages - 1 && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border-2 border-swap-secondary shadow-md flex items-center justify-center hover:bg-swap-secondary transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 text-swap-text" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main CounterOffer component ─────────────────────────────────────────────

export default function CounterOffer() {
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();
  const location = useLocation();
  const { offerId } = useParams<{ offerId: string }>();

  const [myInventoryItems, setMyInventoryItems] = useState<TradeItem[]>([]);
  const [theirInventoryItems, setTheirInventoryItems] = useState<TradeItem[]>(
    [],
  );
  const [myOfferedItems, setMyOfferedItems] = useState<TradeItem[]>([]);
  const [requestedItems, setRequestedItems] = useState<TradeItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // ── Load original offer ──

  const originalOffer: TradeOffer | null = useMemo(() => {
    const fromState = (location.state as { offer?: TradeOffer } | null)?.offer;
    if (fromState) {
      sessionStorage.setItem(
        `counter-offer-${offerId}`,
        JSON.stringify(fromState),
      );
      return fromState;
    }
    const stored = sessionStorage.getItem(`counter-offer-${offerId}`);
    if (stored) {
      return JSON.parse(stored) as TradeOffer;
    }
    return null;
  }, [location.state, offerId]);

  const { data: fetchedOffer, isLoading: isLoadingOffer } =
    useGetTradeOfferById(originalOffer ? null : (offerId ?? null));

  const offer = originalOffer ?? fetchedOffer ?? null;

  // ── Fetch inventories ──

  const { data: myItemsData, isLoading: isLoadingMyItems } = useGetMyItems(
    0,
    50,
  );
  const { data: theirItemsData, isLoading: isLoadingTheirItems } =
    useGetUserItems(offer?.offererId ?? null, 0, 50);

  // ── Pre-populate from original offer ──

  useEffect(() => {
    if (initialized || !offer) return;

    const preMyOffered = offer.responderItems
      .filter((i) => !!i.id)
      .map(mapOfferItemToTradeItem);
    const preRequested = offer.offererItems
      .filter((i) => !!i.id)
      .map(mapOfferItemToTradeItem);

    setMyOfferedItems(preMyOffered);
    setRequestedItems(preRequested);
    setInitialized(true);
  }, [offer, initialized]);

  useEffect(() => {
    if (!myItemsData?.content) return;
    const prePopulatedIds = new Set(myOfferedItems.map((i) => i.id));
    setMyInventoryItems(
      myItemsData.content
        .map(mapItemToTradeItem)
        .filter((i) => !prePopulatedIds.has(i.id)),
    );
  }, [myItemsData, myOfferedItems]);

  useEffect(() => {
    if (!theirItemsData?.content) return;
    const prePopulatedIds = new Set(requestedItems.map((i) => i.id));
    setTheirInventoryItems(
      theirItemsData.content
        .map(mapItemToTradeItem)
        .filter((i) => !prePopulatedIds.has(i.id)),
    );
  }, [theirItemsData, requestedItems]);

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
    if (!over) return;

    const source = active.data.current?.source as DragSource | undefined;
    const item = active.data.current?.item as TradeItem | undefined;
    if (!source || !item) return;

    if (
      over.id === "my-offer-drop-zone" &&
      source === "my-inventory"
    ) {
      if (myOfferedItems.some((i) => i.id === item.id)) return;
      setMyInventoryItems((prev) => prev.filter((i) => i.id !== item.id));
      setMyOfferedItems((prev) => [...prev, item]);
    }

    if (
      over.id === "requested-items-drop-zone" &&
      source === "their-inventory"
    ) {
      if (requestedItems.some((i) => i.id === item.id)) return;
      setTheirInventoryItems((prev) => prev.filter((i) => i.id !== item.id));
      setRequestedItems((prev) => [...prev, item]);
    }
  };

  const handleRemoveMyOffer = (id: string) => {
    const item = myOfferedItems.find((i) => i.id === id);
    if (!item) return;
    setMyOfferedItems((prev) => prev.filter((i) => i.id !== id));
    setMyInventoryItems((prev) => [...prev, item]);
  };

  const handleRemoveRequested = (id: string) => {
    const item = requestedItems.find((i) => i.id === id);
    if (!item) return;
    setRequestedItems((prev) => prev.filter((i) => i.id !== id));
    setTheirInventoryItems((prev) => [...prev, item]);
  };

  // ── Submit ──

  const { mutate: submitCounterOffer, isPending: isSubmitting } =
    useCreateCounterOffer(offerId ?? "");

  const handleSubmit = () => {
    if (myOfferedItems.length === 0 || requestedItems.length === 0) return;
    if (!offer) return;

    submitCounterOffer(
      {
        responderId: offer.offererId,
        offererItems: myOfferedItems.map((i) => i.id).filter(Boolean),
        responderItems: requestedItems.map((i) => i.id).filter(Boolean),
      },
      {
        onSuccess: () => {
          toast.success(t("swapping:offers.counterOfferSent"), {
            position: "top-center",
          });
          sessionStorage.removeItem(`counter-offer-${offerId}`);
          navigate("/swapping/offers");
        },
        onError: () => {
          toast.error(t("swapping:offers.counterOfferFailed"), {
            position: "top-center",
          });
        },
      },
    );
  };

  // ── Active item for drag overlay ──

  const activeItem = useMemo(() => {
    if (!activeId) return null;
    const allItems = [
      ...myInventoryItems,
      ...theirInventoryItems,
      ...myOfferedItems,
      ...requestedItems,
    ];
    const itemId = activeId.includes("::") ? activeId.split("::")[1] : activeId;
    return allItems.find((i) => i.id === itemId) ?? null;
  }, [activeId, myInventoryItems, theirInventoryItems, myOfferedItems, requestedItems]);

  // ── Loading & error states ──

  const isLoading = isLoadingOffer || isLoadingMyItems || isLoadingTheirItems;

  if (!offerId) {
    return (
      <div className="min-h-screen bg-swap-bg flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-swap-primary/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-swap-text mb-2">
            {t("swapping:counterOffer.noOriginalOffer")}
          </h2>
          <p className="text-swap-text2 mb-6">
            {t("swapping:counterOffer.noOriginalOfferDesc")}
          </p>
          <Button
            onClick={() => navigate("/swapping/offers")}
            className="bg-swap-primary hover:bg-swap-primary/90 text-white"
          >
            {t("swapping:counterOffer.backToOffers")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-swap-bg p-4 md:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-swap-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !offer ? (
          <div className="max-w-7xl mx-auto text-center py-32">
            <Package className="w-16 h-16 text-swap-primary/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-swap-text mb-2">
              {t("swapping:counterOffer.noOriginalOffer")}
            </h2>
            <p className="text-swap-text2 mb-6">
              {t("swapping:counterOffer.noOriginalOfferDesc")}
            </p>
            <Button
              onClick={() => navigate("/swapping/offers")}
              className="bg-swap-primary hover:bg-swap-primary/90 text-white"
            >
              {t("swapping:counterOffer.backToOffers")}
            </Button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <Button
              variant="link"
              className="mb-6"
              onClick={() => navigate("/swapping/offers")}
            >
              <ArrowLeft />
              {t("swapping:counterOffer.backToOffers")}
            </Button>

            <div className="mb-8">
              <h1
                className="text-2xl md:text-3xl text-swap-text flex items-center gap-3"
                style={{ fontFamily: "'Archivo Black', sans-serif" }}
              >
                <ArrowRightLeft className="w-8 h-8 text-purple-500" />
                {t("swapping:counterOffer.title")}
              </h1>
              <p className="text-swap-text2 mt-2 text-sm">
                {t("swapping:counterOffer.subtitle")}
              </p>
            </div>

            {/* Main 4-column layout */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: My Inventory */}
              <div className="w-full lg:w-[22%]">
                <p className="text-xs uppercase font-bold tracking-widest text-swap-text2 mb-3">
                  {t("swapping:counterOffer.myInventory")}
                </p>
                <InventoryPanel
                  title={t("swapping:counterOffer.myInventory")}
                  items={myInventoryItems}
                  source="my-inventory"
                />
              </div>

              {/* Center-left: My Offer Drop Zone */}
              <div className="w-full lg:w-[28%]">
                <p className="text-xs uppercase font-bold tracking-widest text-swap-text2 mb-3">
                  {t("swapping:counterOffer.myOffer")}
                </p>
                <CounterOfferDropZone
                  zoneId="my-offer-drop-zone"
                  title={t("swapping:counterOffer.myOffer")}
                  items={myOfferedItems}
                  onRemoveItem={handleRemoveMyOffer}
                  dragHint={t("swapping:counterOffer.dragMyItems")}
                  dropHint={t("swapping:counterOffer.dropMyHint")}
                  dragDescription={t("swapping:counterOffer.dragMyDescription")}
                  itemLabel={t("swapping:tradeOffer.item")}
                  itemsLabel={t("swapping:tradeOffer.items")}
                />
              </div>

              {/* Center-right: Requested Items Drop Zone */}
              <div className="w-full lg:w-[28%]">
                <p className="text-xs uppercase font-bold tracking-widest text-swap-text2 mb-3">
                  {t("swapping:counterOffer.requestedItems")}
                </p>
                <CounterOfferDropZone
                  zoneId="requested-items-drop-zone"
                  title={t("swapping:counterOffer.requestedItems")}
                  items={requestedItems}
                  onRemoveItem={handleRemoveRequested}
                  dragHint={t("swapping:counterOffer.dragTheirItems")}
                  dropHint={t("swapping:counterOffer.dropTheirHint")}
                  dragDescription={t(
                    "swapping:counterOffer.dragTheirDescription",
                  )}
                  itemLabel={t("swapping:tradeOffer.item")}
                  itemsLabel={t("swapping:tradeOffer.items")}
                />
              </div>

              {/* Right: Their Inventory */}
              <div className="w-full lg:w-[22%]">
                <p className="text-xs uppercase font-bold tracking-widest text-swap-text2 mb-3">
                  {t("swapping:counterOffer.theirInventory")}
                </p>
                <InventoryPanel
                  title={t("swapping:counterOffer.theirInventory")}
                  items={theirInventoryItems}
                  source="their-inventory"
                />
              </div>
            </div>

            {/* Submit button */}
            {(myOfferedItems.length > 0 || requestedItems.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    myOfferedItems.length === 0 ||
                    requestedItems.length === 0
                  }
                  className="w-full h-12 text-base font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg"
                >
                  <ArrowRightLeft className="w-5 h-5 mr-2" />
                  {isSubmitting
                    ? t("swapping:counterOffer.sending")
                    : `${t("swapping:counterOffer.sendCounterOffer")} (${myOfferedItems.length} ↔ ${requestedItems.length})`}
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <div className="w-32 h-40 rounded-xl shadow-2xl ring-2 ring-swap-primary overflow-hidden rotate-2 opacity-90 bg-white">
            <div className="h-24 w-full overflow-hidden p-1">
              {activeItem.image ? (
                <ImageWithFallback
                  src={activeItem.image}
                  alt={activeItem.name}
                  className="w-full h-full object-contain"
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
