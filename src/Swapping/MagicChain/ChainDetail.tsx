import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ChainConnector from "@/Swapping/MagicChain/components/ChainConnector";
import {
  MAGIC_GRADIENT,
  STATUS_CONFIG,
  type ChainTradeLink,
} from "@/Swapping/MagicChain/types";
import useGetChainTrade from "@/Swapping/MagicChain/useGetChainTrade";
import {
  ArrowLeft,
  Clock,
  Link2,
  Package,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function ChainTradeLinkNode({
  link,
  index,
}: {
  link: ChainTradeLink;
  index: number;
}) {
  const { t } = useTranslation(["swapping"]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="shrink-0 w-44 rounded-xl border-2 bg-white overflow-hidden border-gray-200"
    >
      <div className="h-16 w-full overflow-hidden bg-gray-50 flex items-center justify-center">
        <Package className="w-6 h-6 text-gray-300" />
      </div>

      <div className="p-3 space-y-2">
        <p className="text-xs font-semibold text-swap-text line-clamp-1">
          {link.itemName}
        </p>

        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              link.accepted ? "bg-green-500" : "bg-amber-400"
            }`}
          />
          <span className="text-[10px] text-swap-text2">
            {link.accepted
              ? t("swapping:magicChain.detail.accepted")
              : t("swapping:magicChain.detail.pending")}
          </span>
        </div>

        {link.confirmed && (
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-green-600" />
            <span className="text-[10px] text-green-600 font-medium">
              {t("swapping:magicChain.detail.confirmed")}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ChainDetail() {
  const { chainId } = useParams<{ chainId: string }>() as {
    chainId: string;
  };
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();
  const location = useLocation();
  const isFromHistory = location.state?.fromHistory === true;

  const handleBack = () => {
    if (isFromHistory) {
      navigate(-1);
    } else {
      navigate("/swapping/magic-chain");
    }
  };

  const { data: chain, isLoading, isError } = useGetChainTrade(chainId);

  if (isLoading) {
    return (
      <div className="bg-swap-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !chain) {
    return (
      <div className="bg-swap-bg min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center"
        >
          <Link2 className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {t("swapping:magicChain.detail.notFound")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t("swapping:magicChain.detail.notFoundHint")}
          </p>
          <Button
            onClick={() => navigate("/swapping/magic-chain")}
            className="text-white cursor-pointer"
            style={{ background: MAGIC_GRADIENT }}
          >
            {t("swapping:magicChain.back")}
          </Button>
        </motion.div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[chain.status];
  const StatusIcon = statusConfig.icon;

  const expiresDate = new Date(chain.expiresAt);
  const createdDate = new Date(chain.createdAt);
  const now = new Date();
  const hoursLeft = Math.max(
    0,
    Math.round((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60)),
  );

  return (
    <div className="bg-swap-bg min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8"
      >
        {/* Back to discovery */}
        <Button variant="link" onClick={handleBack}>
          <ArrowLeft />
          {isFromHistory
            ? t("swapping:magicChain.backToHistory")
            : t("swapping:magicChain.backToItems")}
        </Button>

        {/* Status card */}
        <Card
          className={`p-5 rounded-2xl border-2 ${statusConfig.bgClass} transition-all`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: MAGIC_GRADIENT }}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-swap-text">
                  {t("swapping:magicChain.detail.chainTitle")}
                </h2>
                <p className="text-xs text-swap-text2 font-mono">
                  {chain.chainId.slice(0, 8)}...
                </p>
              </div>
            </div>

            <Badge
              className={`border ${statusConfig.bgClass} ${statusConfig.colorClass} font-semibold text-xs`}
            >
              <StatusIcon className="w-3.5 h-3.5 mr-1" />
              {t(`swapping:magicChain.detail.status.${chain.status}`)}
            </Badge>
          </div>
        </Card>

        {/* Meta info */}
        <div className="flex gap-4 text-xs text-swap-text2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {t("swapping:magicChain.detail.created")}{" "}
              {createdDate.toLocaleDateString()}
            </span>
          </div>
          {chain.status === "PROPOSED" && hoursLeft > 0 && (
            <div className="flex items-center gap-1.5 text-amber-600">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {t("swapping:magicChain.detail.expiresIn", {
                  hours: hoursLeft,
                })}
              </span>
            </div>
          )}
        </div>

        {/* Chain visualization */}
        <Card className="p-5 rounded-2xl border-2 border-purple-100">
          <h3 className="text-sm font-bold text-swap-text mb-4">
            {t("swapping:magicChain.detail.tradeChain")}
          </h3>

          <Separator className="mb-4" />

          <div className="overflow-x-auto scrollbar-thin pb-2">
            <div className="flex items-center gap-0 min-w-max">
              {chain.links.map((link, index) => (
                <Fragment key={link.itemId}>
                  <ChainTradeLinkNode link={link} index={index} />
                  {index < chain.links.length - 1 && <ChainConnector />}
                </Fragment>
              ))}
            </div>
          </div>
        </Card>

        {/* Progress */}
        <Card className="p-5 rounded-2xl border-2 border-gray-100">
          <h3 className="text-sm font-bold text-swap-text mb-3">
            {t("swapping:magicChain.detail.progress")}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: MAGIC_GRADIENT }}
                initial={{ width: 0 }}
                animate={{
                  width: `${chain.links.length > 0 ? (chain.links.filter((l) => l.accepted).length / chain.links.length) * 100 : 0}%`,
                }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
            <span className="text-xs font-semibold text-swap-text2">
              {chain.links.filter((l) => l.accepted).length}/
              {chain.links.length}
            </span>
          </div>
          <p className="text-xs text-swap-text2">
            {t("swapping:magicChain.detail.progressHint")}
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
