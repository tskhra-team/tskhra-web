import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/shared/pagination/Pagination";
import ChainTradeCard from "@/Swapping/MagicChain/components/ChainTradeCard";
import {
  MAGIC_GRADIENT,
  type ChainTradeStatus,
} from "@/Swapping/MagicChain/types";
import useGetMyChains from "@/Swapping/MagicChain/useGetMyChains";
import { ArrowLeft, Link2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

const STATUS_TABS: (ChainTradeStatus | null)[] = [
  null,
  "PROPOSED",
  "ACTIVE",
  "COMPLETED",
  "EXPIRED",
];

export default function MyChains() {
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const statusParam = searchParams.get("status") ?? "all";
  const activeStatus: ChainTradeStatus | null =
    statusParam === "all" ? null : (statusParam as ChainTradeStatus);
  const page = Math.max(0, Number(searchParams.get("page") ?? "1") - 1);
  const size = 6;

  const setActiveStatus = useCallback(
    (status: ChainTradeStatus | null) => {
      setSearchParams({
        status: status ?? "all",
        page: "1",
      });
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (updater: number | ((prev: number) => number)) => {
      const newPage = typeof updater === "function" ? updater(page) : updater;
      setSearchParams((prev) => {
        prev.set("page", String(newPage + 1));
        return prev;
      });
    },
    [page, setSearchParams],
  );

  const { data, isLoading } = useGetMyChains(activeStatus, page, size);

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="bg-swap-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="link"
          className="mb-10"
          onClick={() => navigate("/swapping/magic-chain")}
        >
          <ArrowLeft />
          {t("swapping:magicChain.backToItems")}
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ background: MAGIC_GRADIENT }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-swap-text">
            {t("swapping:magicChain.myChainsTitle")}
          </h1>
        </div>
        <p className="text-swap-text2 text-sm mb-8">
          {t("swapping:magicChain.myChainsSubtitle")}
        </p>

        {/* Status tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1">
          {STATUS_TABS.map((status) => {
            const isActive = activeStatus === status;
            return (
              <Button
                key={status ?? "all"}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={`rounded-full text-xs cursor-pointer shrink-0 ${
                  isActive
                    ? "text-white border-transparent"
                    : "border-purple-200 text-purple-600 hover:bg-purple-50"
                }`}
                style={isActive ? { background: MAGIC_GRADIENT } : undefined}
                onClick={() => setActiveStatus(status)}
              >
                {status
                  ? t(`swapping:magicChain.detail.status.${status}`)
                  : t("swapping:magicChain.statusAll")}
              </Button>
            );
          })}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && data?.empty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Link2 className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {t("swapping:magicChain.noChainsYet")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t("swapping:magicChain.noChainsYetHint")}
            </p>
            <Button
              className="text-white cursor-pointer"
              style={{ background: MAGIC_GRADIENT }}
              onClick={() => navigate("/swapping/magic-chain")}
            >
              {t("swapping:magicChain.discoverChains")}
            </Button>
          </motion.div>
        )}

        {/* Chain list */}
        {!isLoading && !data?.empty && (
          <div className="flex flex-col gap-4">
            {data?.content.map((chain) => (
              <ChainTradeCard key={chain.chainId} chain={chain} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8">
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
