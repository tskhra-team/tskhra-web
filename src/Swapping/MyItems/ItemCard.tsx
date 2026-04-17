import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModal } from "@/context/ModalContext";
import { CardImageSlider } from "@/Swapping/CardImageSlider";
import useDeleteItem from "@/Swapping/MyItems/useDeleteItem";
import type { Item } from "@/Swapping/MyItems/useGetMyItems";
import {
  ArrowRightLeft,
  Calendar,
  Crown,
  Loader2,
  MapPin,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const CONDITION_LABELS: Record<string, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  USED: "Used",
  DAMAGED: "Damaged",
};

const TRADE_RANGE_LABELS: Record<string, string> = {
  CITY_WIDE: "City Wide",
  COUNTRY_WIDE: "Country Wide",
};

export function ItemCard({ item }: { item: Item }) {
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();
  const { showModal } = useModal();
  const { t } = useTranslation(["swapping", "modal"]);

  const handleDelete = () => {
    showModal(
      "warning",
      t("modal:titles.attention"),
      t("modal:messages.confirmDeleteItem"),
      t("modal:buttons.close"),
      () => {},
      t("modal:buttons.yesDelete"),
      () => {
        deleteItem(item.id, {
          onSuccess: () => {
            showModal(
              "success",
              t("modal:titles.successful"),
              t("modal:messages.itemDeletedSuccess"),
            );
          },
          onError: () => {
            showModal(
              "error",
              t("modal:titles.somethingWentWrong"),
              t("modal:messages.itemDidntDeleted"),
            );
          },
        });
      },
    );
  };

  const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`rounded-3xl bg-white shadow-xl overflow-hidden border-2 flex flex-col group cursor-default ${
        item.vip
          ? "border-amber-400 shadow-amber-100"
          : "border-swap-secondary"
      }`}
    >
      {/* Image Header */}
      <div className="relative h-56 w-full overflow-hidden">
        <CardImageSlider
          images={item.images ?? []}
          alt={item.name}
        />

        {/* Category + VIP badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-sm bg-swap-primary">
            {item.category}
          </span>
          {item.vip && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 bg-linear-to-r from-amber-400 to-yellow-500 text-amber-900">
              <Crown className="w-3 h-3" />
              VIP
            </span>
          )}
        </div>

        {/* Price pill on image */}
        {item.estimatedValue && (
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {item.estimatedValue}₾
            </span>
          </div>
        )}
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

        {/* Description box — styled like "LOOKING FOR" */}
        <div
          className="mb-6 p-4 rounded-xl relative flex-1"
          style={{ backgroundColor: "var(--swap-secondary)" }}
        >
          <div
            className="text-xs uppercase font-bold tracking-wider mb-1"
            style={{ color: "var(--swap-primary)" }}
          >
            {CONDITION_LABELS[item.condition] || item.condition}
          </div>
          <div
            className="text-sm font-medium text-gray-800 line-clamp-2"
            style={{ fontFamily: "'Work Sans', sans-serif" }}
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

        {/* Edit button — styled like "Make Offer" */}
        <div className="flex gap-2">
          <Button className="flex-1 bg-swap-primary hover:bg-swap-secondary hover:text-swap-primary">
            <Pencil className="w-4 h-4 mr-1.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="w-11 h-10 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Footer — price + trade range */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {item.estimatedValue && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-lg font-bold text-swap-primary cursor-help flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {item.estimatedValue} ₾
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {t("swapping:aiEstimatedPrice")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: "var(--swap-text2)" }}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            {TRADE_RANGE_LABELS[item.tradeRange] || item.tradeRange}
          </span>
        </div>

        {/* Location + Date */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {item.city}
          </div>
        </div>
      </div>
    </div>
  );
}
