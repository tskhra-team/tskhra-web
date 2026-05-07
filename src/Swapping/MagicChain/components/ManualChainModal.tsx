import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import useCreateChainTrade from "@/Swapping/MagicChain/useCreateChainTrade";
import type { Item } from "@/Swapping/MyItems/useGetMyItems";
import useGetSearchedItems from "@/Swapping/SwapCatalog/useGetSearchedItems";
import { Link2, Loader2, Package, Search, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useDeferredValue, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MAGIC_GRADIENT } from "../types";

export default function ManualChainModal({
  open,
  onOpenChange,
  myItem,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  myItem: Item;
}) {
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [targetItem, setTargetItem] = useState<Item | null>(null);

  const { data: searchResults, isLoading: isSearching } = useGetSearchedItems({
    query: deferredQuery || undefined,
    page: 0,
    size: 12,
    enabled: open && deferredQuery.length >= 2,
  });

  const { mutate: createChain, isPending: isCreating } = useCreateChainTrade();

  // @ts-ignore
  const handleCreateChain = useCallback(() => {
    if (!targetItem) return;
    createChain(
      { itemIds: [myItem.id, targetItem.id] },
      {
        onSuccess: (data) => {
          toast.success(t("swapping:magicChain.manual.chainCreated"));
          onOpenChange(false);
          navigate(`/swapping/magic-chain/chain/${data.chainId}`);
        },
        onError: () => {
          toast.error(t("swapping:magicChain.manual.chainFailed"));
        },
      },
    );
  }, [targetItem, myItem.id, createChain, onOpenChange, navigate, t]);

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setQuery("");
      setTargetItem(null);
    }
    onOpenChange(isOpen);
  };

  const filteredResults = searchResults?.content.filter(
    (item) => item.id !== myItem.id && item.ownerId !== myItem.ownerId,
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0 border-0 rounded-2xl shadow-2xl">
        <div
          className="relative px-6 pt-6 pb-4"
          style={{
            background:
              "linear-gradient(135deg, #7c3aed08, #a855f712, #c084fc08)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-lg font-bold text-swap-text">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ background: MAGIC_GRADIENT }}
              >
                <Link2 className="w-4 h-4" />
              </div>
              {t("swapping:magicChain.manual.title")}
            </DialogTitle>
          </DialogHeader>
          <p className="text-swap-text2 text-xs mt-1.5">
            {t("swapping:magicChain.manual.subtitle")}
          </p>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center gap-3">
            <ChainItemCard
              item={myItem}
              label={t("swapping:magicChain.you")}
              accentColor="var(--swap-magic-start)"
            />

            <div className="flex flex-col items-center gap-1 shrink-0">
              <motion.div
                animate={
                  targetItem
                    ? { scale: [1, 1.15, 1], opacity: 1 }
                    : { opacity: 0.35 }
                }
                transition={{
                  duration: 0.6,
                  repeat: targetItem ? 0 : Infinity,
                  repeatType: "reverse",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{ background: MAGIC_GRADIENT }}
                >
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
              </motion.div>
              <div
                className="w-0.5 h-4 rounded-full"
                style={{ background: MAGIC_GRADIENT }}
              />
            </div>

            <AnimatePresence mode="wait">
              {targetItem ? (
                <motion.div
                  key={targetItem.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="relative flex-1 min-w-0"
                >
                  <ChainItemCard
                    item={targetItem}
                    label={t("swapping:magicChain.manual.target")}
                    accentColor="var(--swap-magic-end)"
                  />
                  <button
                    onClick={() => setTargetItem(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0 h-30 rounded-xl border-2 border-dashed border-purple-200 flex flex-col items-center justify-center gap-1.5 bg-purple-50/40"
                >
                  <Search className="w-5 h-5 text-purple-300" />
                  <p className="text-xs text-purple-400 font-medium text-center px-2">
                    {t("swapping:magicChain.manual.searchHint")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-swap-text2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("swapping:magicChain.manual.searchPlaceholder")}
              className="pl-9 h-10 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-4 min-h-0 max-h-70">
          {isSearching && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
            </div>
          )}

          {!isSearching &&
            deferredQuery.length >= 2 &&
            filteredResults &&
            filteredResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm text-swap-text2">
                  {t("swapping:magicChain.manual.noResults")}
                </p>
              </div>
            )}

          {!isSearching && filteredResults && filteredResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {filteredResults.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  <SearchResultCard
                    item={item}
                    isSelected={targetItem?.id === item.id}
                    onSelect={() =>
                      setTargetItem(targetItem?.id === item.id ? null : item)
                    }
                  />
                </motion.div>
              ))}
            </div>
          )}

          {!isSearching && deferredQuery.length < 2 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Search className="w-10 h-10 text-gray-200 mb-2" />
              <p className="text-sm text-swap-text2">
                {t("swapping:magicChain.manual.typeToSearch")}
              </p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {targetItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-6 pb-5 pt-2"
            >
              <Button
                onClick={() => toast.warning("Its not working, sorry :(")}
                disabled={isCreating}
                className="w-full h-12 text-base font-bold text-white rounded-xl shadow-lg cursor-pointer"
                style={{ background: MAGIC_GRADIENT }}
              >
                {isCreating ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Link2 className="w-5 h-5 mr-2" />
                )}
                {isCreating
                  ? t("swapping:magicChain.manual.creating")
                  : t("swapping:magicChain.manual.makeChain")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function ChainItemCard({
  item,
  label,
  accentColor,
}: {
  item: Item;
  label: string;
  accentColor: string;
}) {
  const { t } = useTranslation(["swapping"]);

  return (
    <div className="flex-1 min-w-0">
      <p
        className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
        style={{ color: accentColor }}
      >
        {label}
      </p>
      <div className="rounded-xl border-2 border-gray-100 bg-white overflow-hidden shadow-sm">
        <div className="h-18 w-full overflow-hidden bg-gray-50">
          {item.images?.[0] ? (
            <ImageWithFallback
              src={item.images[0]}
              alt={item.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-2">
          <p className="text-xs font-semibold text-swap-text line-clamp-1">
            {item.name}
          </p>
          <p className="text-[10px] text-swap-text2 mt-0.5">
            {t(`swapping:categories.${item.category}`, item.category)}
          </p>
          {item.estimatedValue != null && (
            <p
              className="text-[10px] font-bold mt-0.5"
              style={{ color: accentColor }}
            >
              {item.estimatedValue} ₾
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchResultCard({
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-150 border-2 bg-white ${
        isSelected
          ? "border-swap-magic-mid shadow-md"
          : "border-gray-100 hover:border-purple-200"
      }`}
      style={
        isSelected
          ? { boxShadow: "0 4px 20px rgba(168, 85, 247, 0.18)" }
          : undefined
      }
    >
      <div className="h-16 w-full overflow-hidden bg-gray-50">
        {item.images?.[0] ? (
          <ImageWithFallback
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-5 h-5 text-gray-300" />
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-[11px] font-semibold text-swap-text line-clamp-1">
          {item.name}
        </p>
        <p className="text-[10px] text-swap-text2 line-clamp-1">
          {t(`swapping:categories.${item.category}`, item.category)}
        </p>
        {item.estimatedValue != null && (
          <p className="text-[10px] font-bold text-swap-magic-mid mt-0.5">
            {item.estimatedValue} ₾
          </p>
        )}
      </div>
    </motion.div>
  );
}
