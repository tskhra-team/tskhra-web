import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ChainConnector from "@/Swapping/MagicChain/components/ChainConnector";
import ChainLinkNode from "@/Swapping/MagicChain/components/ChainLinkNode";
import { MAGIC_GRADIENT, type Chain } from "@/Swapping/MagicChain/types";
import { Zap } from "lucide-react";
import { motion } from "motion/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

export default function ChainCard({
  chain,
  chainIndex,
  onAccept,
  isAccepting,
  isDisabled,
}: {
  chain: Chain;
  chainIndex: number;
  onAccept: () => void;
  isAccepting: boolean;
  isDisabled: boolean;
}) {
  const { t } = useTranslation(["swapping"]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: chainIndex * 0.1 }}
    >
      <Card className="p-5 rounded-2xl border-2 border-purple-100 hover:border-purple-200 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge
              className="border-transparent text-white text-xs"
              style={{ background: MAGIC_GRADIENT }}
            >
              {t("swapping:magicChain.chainLabel", {
                number: chainIndex + 1,
              })}
            </Badge>
            <span className="text-xs text-swap-text2">
              {chain.length} {t("swapping:magicChain.steps")}
            </span>
          </div>
          <Button
            size="sm"
            onClick={onAccept}
            disabled={isDisabled}
            className="h-8 text-xs font-bold text-white rounded-lg cursor-pointer"
            style={{ background: MAGIC_GRADIENT }}
          >
            <Zap className="w-3.5 h-3.5 mr-1" />
            {isAccepting
              ? t("swapping:magicChain.accepting")
              : t("swapping:magicChain.accept")}
          </Button>
        </div>

        <Separator className="mb-4" />

        <div className="overflow-x-auto scrollbar-thin pb-2">
          <div className="flex items-center gap-0 min-w-max">
            {chain.links.map((link, linkIndex) => (
              <Fragment key={link.itemId}>
                <ChainLinkNode
                  name={link.itemName}
                  category={t(
                    `swapping:categories.${link.categoryName}`,
                    link.categoryName,
                  )}
                  value={link.estimatedValue}
                />
                {linkIndex < chain.links.length - 1 && <ChainConnector />}
              </Fragment>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
