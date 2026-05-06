import { Button } from "@/components/ui/button";
import queryClient from "@/query/queryClient";
import ChainCard from "@/Swapping/MagicChain/components/ChainCard";
import ChainDiscoverAnimation from "@/Swapping/MagicChain/components/ChainDiscoverAnimation";
import { MAGIC_GRADIENT, type Chain } from "@/Swapping/MagicChain/types";
import useCreateChainTrade from "@/Swapping/MagicChain/useCreateChainTrade";
import useDiscoverChains from "@/Swapping/MagicChain/useDiscoverChains";
import { ArrowLeft, Link2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MIN_ANIMATION_MS = 3500;

export default function DiscoverView() {
  const { itemId } = useParams<{ itemId: string }>() as { itemId: string };
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();

  const [acceptingChainIndex, setAcceptingChainIndex] = useState<number | null>(
    null,
  );
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    setAnimationDone(false);
    const timer = setTimeout(() => setAnimationDone(true), MIN_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [itemId]);

  const {
    data: chains = [],
    isLoading: isDiscovering,
    isSuccess: hasLoaded,
  } = useDiscoverChains({ itemId });

  const showLoading = isDiscovering || !hasLoaded || !animationDone;

  const { mutate: createChainTrade, isPending: isAccepting } =
    useCreateChainTrade();

  const handleAcceptChain = (chain: Chain, index: number) => {
    setAcceptingChainIndex(index);
    const itemIds = chain.links.map((link) => link.itemId);

    createChainTrade(
      { itemIds },
      {
        onSuccess: (data) => {
          navigate(`/swapping/magic-chain/chain/${data.chainId}`);
          window.scrollTo({ top: 0 });
          queryClient.invalidateQueries({ queryKey: ["discoverChains"] });
        },
        onError: () => {
          toast.error(t("swapping:magicChain.acceptFailed"));
          setAcceptingChainIndex(null);
        },
      },
    );
  };

  return (
    <div className="bg-swap-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showLoading && (
          <Button
            variant="link"
            className="mb-10"
            disabled={isDiscovering || isAccepting}
            onClick={() => navigate("/swapping/magic-chain")}
          >
            <ArrowLeft />
            {t("swapping:magicChain.backToItems")}
          </Button>
        )}

        {showLoading && <ChainDiscoverAnimation />}

        {!showLoading && chains.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Link2 className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {t("swapping:magicChain.noChainsFound")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t("swapping:magicChain.noChainsHint")}
            </p>
            <Button
              disabled={isDiscovering || isAccepting}
              onClick={() => navigate("/swapping/magic-chain")}
              className="text-white cursor-pointer"
              style={{ background: MAGIC_GRADIENT }}
            >
              {t("swapping:magicChain.tryAgain")}
            </Button>
          </motion.div>
        )}

        {!showLoading && chains.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-swap-text">
                  {t("swapping:magicChain.chainsFound", {
                    count: chains.length,
                  })}
                </h2>
                <p className="text-swap-text2 text-sm mt-1">
                  {t("swapping:magicChain.chainsFoundHint")}
                </p>
              </div>
              <Button
                variant="outline"
                disabled={isDiscovering || isAccepting}
                onClick={() => navigate("/swapping/magic-chain")}
                className="border-purple-200 text-purple-600 hover:bg-purple-50 cursor-pointer disabled:opacity-50"
              >
                {t("swapping:magicChain.newSearch")}
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              {chains.map((chain, chainIndex) => {
                const uniqueKey = chain.links.map((l) => l.itemId).join("-");

                return (
                  <ChainCard
                    key={uniqueKey}
                    chain={chain}
                    chainIndex={chainIndex}
                    onAccept={() => handleAcceptChain(chain, chainIndex)}
                    isAccepting={
                      isAccepting && acceptingChainIndex === chainIndex
                    }
                    isDisabled={isAccepting}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
