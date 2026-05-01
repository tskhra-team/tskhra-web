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
import useUpdateItemStatus from "@/Swapping/MyItems/useUpdateItemStatus";
import {
  ArrowRightLeft,
  Calendar,
  Crown,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const CONDITION_CONFIG: Record<string, { key: string; className: string }> = {
  NEW: { key: "conditionNew", className: "bg-green-700 text-white" },
  LIKE_NEW: { key: "conditionGood", className: "bg-blue-700 text-white" },
  USED: { key: "conditionFair", className: "bg-orange-600 text-white" },
  DAMAGED: { key: "conditionPoor", className: "bg-red-700 text-white" },
};

const TRADE_RANGE_KEYS: Record<string, string> = {
  CITY_WIDE: "tradeRangeCityWide",
  COUNTRY_WIDE: "tradeRangeCountryWide",
};

export function ItemCard({ item }: { item: Item }) {
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateItemStatus();
  const { showModal } = useModal();
  const { t } = useTranslation(["swapping", "modal"]);
  const isHidden = item.status !== "AVAILABLE";

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

  const condition = CONDITION_CONFIG[item.condition];

  return (
    <div
      className={`rounded-3xl bg-white shadow-xl overflow-hidden border-2 flex flex-col group cursor-default ${
        item.vip && !isHidden
          ? "border-amber-400 shadow-amber-100"
          : "border-swap-secondary"
      }`}
    >
      <div
        className={`relative h-56 w-full overflow-hidden ${isHidden ? "opacity-50 grayscale" : ""}`}
      >
        <CardImageSlider
          images={item.images ?? []}
          alt={item.name}
          objectFit="contain"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${condition?.className ?? "bg-gray-500 text-white"}`}
          >
            {t(`swapping:postItem.${condition?.key ?? "conditionNew"}`)}
          </span>
          {item.vip && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 bg-linear-to-r from-amber-400 to-yellow-500 text-amber-900">
              <Crown className="w-3 h-3" />
              VIP
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className={isHidden ? "opacity-50 grayscale" : ""}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3
                  className="text-lg mb-1 line-clamp-1 text-swap-text"
                  style={{ fontFamily: "'Archivo Black', sans-serif" }}
                >
                  {item.name}
                </h3>
              </TooltipTrigger>
              <TooltipContent side="top">{item.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="text-sm h-10 font-medium text-gray-800 overflow-hidden line-clamp-2 mb-4"
                  style={{ fontFamily: "'Work Sans', sans-serif" }}
                >
                  {item.description}
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-xs wrap-break-word"
              >
                {item.description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div
            className="mb-6 p-4 rounded-xl relative flex-1"
            style={{ backgroundColor: "var(--swap-secondary)" }}
          >
            <div
              className="text-xs uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5"
              style={{ color: "var(--swap-primary)" }}
            >
              <Search className="w-3.5 h-3.5" />
              {t("swapping:catalog.lookingFor", "Looking for")}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(item.desiredCategories?.length > 0
                ? item.desiredCategories
                : ["Electronics", "Fashion", "Books"]
              ).map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-swap-primary"
                  style={{
                    backgroundColor:
                      "var(--swap-primary-light, rgba(var(--swap-primary-rgb, 0,0,0), 0.1))",
                  }}
                >
                  {t(`swapping:categories.${cat}`, cat)}
                </span>
              ))}
            </div>
            <div className="absolute -right-3 -top-3 w-8 text-swap-primary h-8 rounded-full bg-white shadow-md flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <Button
              className="flex-1 h-10 bg-swap-primary hover:bg-swap-secondary hover:text-swap-primary"
              disabled={isUpdatingStatus}
              onClick={() =>
                updateStatus(
                  {
                    itemId: String(item.id),
                    action: isHidden ? "unhide" : "hide",
                  },
                  {
                    onSuccess: () => {
                      showModal(
                        "success",
                        t("modal:titles.successful"),
                        isHidden
                          ? t("modal:messages.itemHidden")
                          : t("modal:messages.itemUnhidden"),
                      );
                    },
                    onError: () => {
                      showModal(
                        "error",
                        t("modal:titles.somethingWentWrong"),
                        t("modal:messages.itemStatusError"),
                      );
                    },
                  },
                )
              }
            >
              {isUpdatingStatus ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : item.status === "AVAILABLE" ? (
                <EyeOff className="w-4 h-4 mr-1.5" />
              ) : (
                <Eye className="w-4 h-4 mr-1.5" />
              )}
              {isHidden
                ? t("swapping:myItems.unhide")
                : t("swapping:myItems.hide")}
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
          {!item.vip && (
            <Button
              className="w-full h-10 bg-amber-500 hover:bg-amber-600"
              onClick={() => {
                showModal(
                  "idle",
                  "Make this item VIP?",
                  "To make this item VIP u need to pay 20GEL/week",
                  "Chekout",
                  () => {
                    toast.error("This feature in developing stage", {
                      position: "top-center",
                    });
                  },
                  "Close",
                );
              }}
            >
              <Crown />
              {t("swapping:myItems.makeVip")}
            </Button>
          )}
        </div>

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
          <div className="flex gap-2 items-center text-swap-text2">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">
              {t(
                `swapping:postItem.${TRADE_RANGE_KEYS[item.tradeRange] ?? "tradeRangeCityWide"}`,
              )}
            </span>
          </div>
        </div>

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
