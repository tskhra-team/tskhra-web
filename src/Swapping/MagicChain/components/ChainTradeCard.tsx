import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ChainConnector from "@/Swapping/MagicChain/components/ChainConnector";
import MiniChainLinkNode from "@/Swapping/MagicChain/components/MiniChainLinkNode";
import {
  MAGIC_GRADIENT,
  STATUS_CONFIG,
  type ChainTrade,
} from "@/Swapping/MagicChain/types";
import { Clock } from "lucide-react";
import { motion } from "motion/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function ChainTradeCard({ chain }: { chain: ChainTrade }) {
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();
  const style = STATUS_CONFIG[chain.status];
  const StatusIcon = style.icon;

  const expiresDate = new Date(chain.expiresAt);
  const createdDate = new Date(chain.createdAt);
  const now = new Date();
  const hoursLeft = Math.max(
    0,
    Math.round((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60)),
  );

  const acceptedCount = chain.links.filter((l) => l.accepted).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="p-5 rounded-2xl border-2 border-gray-100 hover:border-purple-200 transition-all cursor-pointer"
        onClick={() => {
          navigate(`/swapping/magic-chain/chain/${chain.chainId}`, {
            state: { fromHistory: true },
          });

          window.scrollTo({ top: 0 });
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge
              className={`border ${style.bgClass} ${style.colorClass} font-semibold text-xs`}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {t(`swapping:magicChain.detail.status.${chain.status}`)}
            </Badge>
            <span className="text-[10px] text-swap-text2 font-mono">
              {chain.chainId.slice(0, 8)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-swap-text2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {createdDate.toLocaleDateString()}
            </div>
            {chain.status === "PROPOSED" && hoursLeft > 0 && (
              <div className="flex items-center gap-1 text-amber-600">
                <Clock className="w-3 h-3" />
                {hoursLeft}h
              </div>
            )}
          </div>
        </div>

        <Separator className="mb-3" />

        {/* Mini chain visualization */}
        <div className="overflow-x-auto scrollbar-thin pb-1">
          <div className="flex items-center gap-0 min-w-max">
            {chain.links.map((link, index) => (
              <Fragment key={link.itemId}>
                <MiniChainLinkNode link={link} />
                {index < chain.links.length - 1 && (
                  <ChainConnector index={index} />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                background: MAGIC_GRADIENT,
                width: `${chain.links.length > 0 ? (acceptedCount / chain.links.length) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="text-[10px] font-semibold text-swap-text2">
            {acceptedCount}/{chain.links.length}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
