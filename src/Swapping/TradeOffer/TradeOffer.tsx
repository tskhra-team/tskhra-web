import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import useGetMyItems from "@/Swapping/MyItems/useGetMyItems";
import AlsoUserHas from "@/Swapping/TradeOffer/AlsoUserHas";
import InventorySlider from "@/Swapping/TradeOffer/InventorySlider";
import OfferDropZone from "@/Swapping/TradeOffer/OfferDropZone";
import OwnItem from "@/Swapping/TradeOffer/OwnItem";
import TargetItemCard from "@/Swapping/TradeOffer/TargetItemCard";
import {
  mapItemToTradeItem,
  MOCK_TARGET_ITEM,
  type TradeItem,
} from "@/Swapping/TradeOffer/types";
import useCreateTradeOffer from "@/Swapping/TradeOffer/useCreateTradeOffer";
import useGetItemById from "@/Swapping/TradeOffer/useGetItemById";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { ArrowLeft, ArrowRightLeft, Package } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function TradeOffer() {
  const { t } = useTranslation(["swapping"]);
  const [inventoryItems, setInventoryItems] = useState<TradeItem[]>([]);
  const [offeredItems, setOfferedItems] = useState<TradeItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("id");

  const { data: fetchedItem, isLoading: isLoadingItem } =
    useGetItemById(itemId);

  const targetItem: TradeItem = useMemo(() => {
    if (fetchedItem) {
      const mapped = mapItemToTradeItem(fetchedItem);
      sessionStorage.setItem("trade-offer-target", JSON.stringify(mapped));
      return mapped;
    }
    const fromState = (location.state as { targetItem?: TradeItem } | null)
      ?.targetItem;
    if (fromState) {
      sessionStorage.setItem("trade-offer-target", JSON.stringify(fromState));
      return fromState;
    }
    const stored = sessionStorage.getItem("trade-offer-target");
    if (stored) {
      return JSON.parse(stored) as TradeItem;
    }
    return MOCK_TARGET_ITEM;
  }, [fetchedItem, location.state]);

  const { data } = useGetMyItems(0, 50);
  const { mutate: submitOffer, isPending: isSubmitting } =
    useCreateTradeOffer();

  useEffect(() => {
    if (data?.content) {
      setInventoryItems(
        data.content
          .filter((item) => item.status === "AVAILABLE")
          .map(mapItemToTradeItem),
      );
    }
  }, [data]);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

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

  const handleSubmitOffer = () => {
    if (offeredItems.length === 0) return;

    submitOffer(
      {
        responderId: targetItem.ownerId,
        offererItems: offeredItems.map((i) => i.id),
        responderItems: [targetItem.id],
      },
      {
        onSuccess: () => {
          toast.success(t("swapping:tradeOffer.offerSent"), {
            position: "top-center",
          });
          navigate("/swapping/offers");
        },
        onError: () => {
          toast.error(
            t("swapping:tradeOffer.offerFailed", { position: "top-center" }),
          );
        },
      },
    );
  };

  const activeItem = activeId
    ? inventoryItems.find((i) => i.id === activeId)
    : null;

  const isMyOwnItem =
    fetchedItem?.ownerId != null &&
    data?.content?.at(0)?.ownerId != null &&
    fetchedItem.ownerId === data.content.at(0)?.ownerId;

  return isMyOwnItem ? (
    <OwnItem />
  ) : (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="min-h-screen bg-swap-bg p-4 md:p-8">
          {isLoadingItem && (
            <div className="flex justify-center items-center py-32">
              <div className="w-10 h-10 border-4 border-swap-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!isLoadingItem && (
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <Button
                variant="link"
                className="mb-10"
                onClick={() => navigate(-1 || "/swappping/catalog")}
              >
                <ArrowLeft />
                {t("swapping:postItem.back")}
              </Button>
              <div className="mb-8">
                <h1
                  className="text-2xl md:text-3xl text-swap-text flex items-center gap-3"
                  style={{ fontFamily: "'Archivo Black', sans-serif" }}
                >
                  <ArrowRightLeft className="w-8 h-8 text-swap-primary" />
                  {t("swapping:tradeOffer.title")}
                </h1>
                <p className="text-swap-text2 mt-2 text-sm">
                  {t("swapping:tradeOffer.subtitle")}
                </p>
              </div>

              {/* Main split layout */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column — Target Item (40%) */}
                <div className="w-full lg:w-[40%]">
                  <div className="sticky top-8">
                    <p className="text-xs uppercase font-bold tracking-widest text-swap-text2 mb-3">
                      {t("swapping:tradeOffer.youWant")}
                    </p>
                    <TargetItemCard item={targetItem} />
                  </div>
                </div>

                {/* Right Column (60%) */}
                <div className="w-full lg:w-[60%] flex flex-col gap-6">
                  {/* Drop Zone — Top */}
                  <div>
                    <p className="text-xs uppercase font-bold tracking-widest text-swap-text2 mb-3">
                      {t("swapping:tradeOffer.youOffer")}
                    </p>
                    <OfferDropZone
                      offeredItems={offeredItems}
                      onRemoveItem={handleRemoveOffer}
                    />
                  </div>

                  {/* Inventory Slider — Bottom */}
                  <div>
                    <p className="text-xs uppercase font-bold tracking-widest text-swap-text2 mb-3">
                      {t("swapping:tradeOffer.yourInventory")}
                    </p>
                    <InventorySlider
                      items={inventoryItems}
                      onAddClick={() =>
                        navigate("/swapping/post-item", {
                          state: { from: "trade-offer" },
                        })
                      }
                    />
                  </div>

                  {/* Submit offer button */}
                  {offeredItems.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Button
                        onClick={handleSubmitOffer}
                        disabled={isSubmitting}
                        className="w-full h-12 text-base font-bold bg-swap-primary hover:bg-swap-primary/90 text-white rounded-xl shadow-lg"
                      >
                        <ArrowRightLeft className="w-5 h-5 mr-2" />
                        {isSubmitting
                          ? t("swapping:tradeOffer.sending")
                          : `${t("swapping:tradeOffer.sendOffer")} (${offeredItems.length} ${offeredItems.length !== 1 ? t("swapping:tradeOffer.items") : t("swapping:tradeOffer.item")})`}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}

          {fetchedItem?.ownerId ? (
            <AlsoUserHas ownerId={fetchedItem?.ownerId} />
          ) : null}
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
    </>
  );
}
