import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import { ArrowRightLeft, Check, Clock, Loader2, Scale, X } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { TradeOffer, TradeOfferDirection, TradeOfferItem } from "./types";
import {
  useAcceptOffer,
  useRejectOffer,
  useWithdrawOffer,
} from "./useTradeOfferActions";

function getItemImage(item: TradeOfferItem): string {
  return item.images?.[0] ?? item.image ?? "";
}

function useTimeRemaining(expiresAt: string) {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ItemThumbnails({
  items,
  label,
}: {
  items: TradeOffer["offererItems"];
  label: string;
}) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-swap-text2 mb-2 truncate">
        {label}
      </p>
      <div className="flex gap-2 flex-wrap">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-1 w-16">
            <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-swap-bg shrink-0 bg-gray-100">
              {getItemImage(item) ? (
                <ImageWithFallback
                  src={getItemImage(item)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                  No img
                </div>
              )}
            </div>
            <span className="text-[10px] text-swap-text2 text-center leading-tight line-clamp-2">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IncomingActions({ offerId }: { offerId: string }) {
  const { t } = useTranslation(["swapping"]);
  const { mutate: accept, isPending: accepting } = useAcceptOffer();
  const { mutate: reject, isPending: rejecting } = useRejectOffer();
  const busy = accepting || rejecting;

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={busy}
        onClick={() =>
          accept(offerId, {
            onSuccess: () => toast.success(t("swapping:offers.accepted")),
            onError: () => toast.error(t("swapping:offers.actionFailed")),
          })
        }
        className="bg-swap-accent-green hover:bg-swap-accent-green/90 text-white gap-1 text-xs h-8"
      >
        {accepting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Check className="w-3.5 h-3.5" />
        )}
        {t("swapping:offers.accept")}
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={() =>
          reject(offerId, {
            onSuccess: () => toast.success(t("swapping:offers.rejected")),
            onError: () => toast.error(t("swapping:offers.actionFailed")),
          })
        }
        className="border-swap-primary/30 text-swap-primary hover:bg-swap-primary/5 gap-1 text-xs h-8"
      >
        {rejecting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <X className="w-3.5 h-3.5" />
        )}
        {t("swapping:offers.reject")}
      </Button>
    </div>
  );
}

function OutgoingActions({ offerId }: { offerId: string }) {
  const { t } = useTranslation(["swapping"]);
  const { mutate: withdraw, isPending } = useWithdrawOffer();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() =>
        withdraw(offerId, {
          onSuccess: () => toast.success(t("swapping:offers.withdrawn")),
          onError: () => toast.error(t("swapping:offers.actionFailed")),
        })
      }
      className="border-swap-primary/30 text-swap-primary hover:bg-swap-primary/5 gap-1 text-xs h-8"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <X className="w-3.5 h-3.5" />
      )}
      {t("swapping:offers.withdraw")}
    </Button>
  );
}

export function OfferCard({
  offer,
  index,
  direction,
}: {
  offer: TradeOffer;
  index: number;
  direction: TradeOfferDirection;
}) {
  const offerId = offer.id ?? offer.offerId ?? "";
  const { t } = useTranslation(["swapping"]);
  const timeRemaining = useTimeRemaining(offer.expiresAt);
  const isExpiringSoon =
    new Date(offer.expiresAt).getTime() - Date.now() < 1000 * 60 * 60 * 24;

  const fairnessPercent = Math.round(offer.fairnessRatio * 100);
  const fairnessColor =
    fairnessPercent >= 80
      ? "text-swap-accent-green"
      : fairnessPercent >= 50
        ? "text-swap-accent-gold"
        : "text-swap-accent-orange";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Card className="p-4 rounded-2xl border-2 border-swap-bg hover:border-swap-primary/20 transition-colors">
        <div className="flex items-start gap-3">
          <ItemThumbnails
            key={offer.id}
            items={offer.offererItems}
            label={t("swapping:offers.offering")}
          />

          <div className="flex flex-col items-center justify-center pt-6 shrink-0">
            <ArrowRightLeft className="w-5 h-5 text-swap-primary" />
          </div>

          <ItemThumbnails
            key={offer.id}
            items={offer.responderItems}
            label={t("swapping:offers.requesting")}
          />
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-swap-bg">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Scale className={`w-3.5 h-3.5 ${fairnessColor}`} />
              <span className={`text-xs font-semibold ${fairnessColor}`}>
                {fairnessPercent}%
              </span>
            </div>

            <Badge
              variant="outline"
              className={`text-[10px] gap-1 ${isExpiringSoon ? "border-swap-accent-orange text-swap-accent-orange" : "text-swap-text2"}`}
            >
              <Clock className="w-3 h-3" />
              {timeRemaining}
            </Badge>
          </div>

          <span className="text-[10px] text-swap-text2">
            {formatDate(offer.createdAt)}
          </span>
        </div>

        <div className="flex justify-end mt-3 pt-3 border-t border-swap-bg">
          {direction === "RECEIVED" ? (
            <IncomingActions offerId={offerId} />
          ) : (
            <OutgoingActions offerId={offerId} />
          )}
        </div>
      </Card>
    </motion.div>
  );
}
