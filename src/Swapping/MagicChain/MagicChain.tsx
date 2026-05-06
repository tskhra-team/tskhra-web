import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FixedButtons from "@/Swapping/MagicChain/components/FixedButtons";
import SelectableItemCard from "@/Swapping/MagicChain/components/SelectableItemCard";
import useGetMyItems from "@/Swapping/MyItems/useGetMyItems";
import { ArrowLeft, History, Package, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MAGIC_GRADIENT } from "./types";

export default function MagicChain() {
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { data: items, isLoading } = useGetMyItems(0, 50);

  const handleAutoChain = () => {
    if (!selectedItemId) return;
    navigate(`/swapping/magic-chain/discover/${selectedItemId}`);
  };

  return (
    <div className="bg-swap-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="link"
          className="mb-10"
          onClick={() => navigate("/swapping/catalog")}
        >
          <ArrowLeft />
          {t("swapping:magicChain.back")}
        </Button>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: MAGIC_GRADIENT }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-swap-text">
              {t("swapping:magicChain.title")}
            </h1>
          </div>
          <Button
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50 cursor-pointer"
            onClick={() => navigate("/swapping/magic-chain/me")}
          >
            <History className="w-4 h-4 mr-1.5" />
            {t("swapping:magicChain.myChains")}
          </Button>
        </div>
        <p className="text-swap-text2 text-sm mb-10">
          {t("swapping:magicChain.subtitle")}
        </p>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && items?.empty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Package className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {t("swapping:magicChain.noItems")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t("swapping:magicChain.noItemsHint")}
            </p>
            <Button
              className="text-white cursor-pointer"
              style={{ background: MAGIC_GRADIENT }}
              onClick={() => navigate("/swapping/post-item")}
            >
              {t("swapping:magicChain.addItem")}
            </Button>
          </motion.div>
        )}

        {!isLoading && !items?.empty && (
          <>
            <p className="text-xs uppercase font-bold tracking-widest text-swap-text2 mb-4">
              {t("swapping:magicChain.selectItem")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items?.content
                .filter((item) => item.status === "AVAILABLE")
                .map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <SelectableItemCard
                      item={item}
                      isSelected={selectedItemId === item.id}
                      onSelect={() =>
                        setSelectedItemId(
                          selectedItemId === item.id ? null : item.id,
                        )
                      }
                    />
                  </motion.div>
                ))}
            </div>
          </>
        )}

        <FixedButtons
          handleAutoChain={handleAutoChain}
          isPending={false}
          selectedItemId={selectedItemId}
          step="select"
        />
      </div>
    </div>
  );
}
