import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import {
  ArrowRightLeft,
  Ban,
  Check,
  CheckCheck,
  Clock,
  Loader2,
  Scale,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type {
  TradeOffer,
  TradeOfferDirection,
  TradeOfferItem,
  TradeOfferStatus,
} from "./types";
import {
  useAcceptOffer,
  useCancelOffer,
  useConfirmOffer,
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
        {items.map((item, i) => (
          <div
            key={item.id ?? `fallback-key-${i}`}
            className="flex flex-col items-center gap-1 w-16 overflow-hidden"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-swap-bg shrink-0 bg-gray-100">
              {getItemImage(item) ? (
                <ImageWithFallback
                  src={getItemImage(item)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div
                  key={item.id}
                  className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]"
                >
                  No img
                </div>
              )}
            </div>
            <span className="text-[10px] text-swap-text2 text-center leading-tight line-clamp-2 break-all">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<TradeOfferStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  ACCEPTED: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  REJECTED: "bg-red-500/10 text-red-500 border-red-500/30",
  CANCELED: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  COUNTERED: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  EXPIRED: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  COMPLETED: "bg-swap-accent-green/10 text-swap-accent-green border-swap-accent-green/30",
  WITHDRAWN: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

function hasActions(status: TradeOfferStatus) {
  return status === "PENDING" || status === "ACCEPTED";
}

function AcceptedActions({ offerId }: { offerId: string }) {
  const { t } = useTranslation(["swapping"]);
  const { mutate: confirm, isPending: confirming, isSuccess: confirmed } = useConfirmOffer();
  const { mutate: cancel, isPending: canceling } = useCancelOffer();
  const busy = confirming || canceling || confirmed;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        disabled={busy}
        onClick={() =>
          confirm(offerId, {
            onSuccess: () => toast.success(t("swapping:offers.confirmed")),
            onError: () => toast.error(t("swapping:offers.actionFailed")),
          })
        }
        className={`gap-1 text-xs h-8 ${confirmed ? "bg-swap-accent-green/50 text-white cursor-not-allowed" : "bg-swap-accent-green hover:bg-swap-accent-green/90 text-white"}`}
      >
        {confirming ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <CheckCheck className="w-3.5 h-3.5" />
        )}
        {confirmed ? t("swapping:offers.confirmed") : t("swapping:offers.confirm")}
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={() =>
          cancel(offerId, {
            onSuccess: () => toast.success(t("swapping:offers.canceled")),
            onError: () => toast.error(t("swapping:offers.actionFailed")),
          })
        }
        className="border-swap-primary/30 text-swap-primary hover:bg-swap-primary/5 gap-1 text-xs h-8"
      >
        {canceling ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Ban className="w-3.5 h-3.5" />
        )}
        {t("swapping:offers.cancel")}
      </Button>
    </div>
  );
}

function IncomingActions({
  offerId,
  offer,
}: {
  offerId: string;
  offer: TradeOffer;
}) {
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();
  const { mutate: accept, isPending: accepting } = useAcceptOffer();
  const { mutate: reject, isPending: rejecting } = useRejectOffer();
  const busy = accepting || rejecting;

  return (
    <div className="flex flex-wrap gap-2">
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
      <Button
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={() =>
          navigate(`/swapping/counter-offer/${offerId}`, {
            state: { offer },
          })
        }
        className="border-purple-500/30 text-purple-500 hover:bg-purple-500/5 gap-1 text-xs h-8"
      >
        <ArrowRightLeft className="w-3.5 h-3.5" />
        {t("swapping:offers.counterOffer")}
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
  const offerId = offer.id ?? "";
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

  const isActionable = hasActions(offer.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Card
        className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
          isActionable
            ? "border-l-4 border-l-swap-primary border-swap-primary/15 hover:border-swap-primary/30 hover:shadow-md"
            : "border-swap-bg hover:border-swap-primary/10 opacity-75 hover:opacity-100"
        }`}
      >
        <div className="flex items-start gap-3">
          <ItemThumbnails
            items={offer.offererItems}
            label={t("swapping:offers.offering")}
          />

          <div className="flex flex-col items-center justify-center pt-6 shrink-0">
            <ArrowRightLeft className="w-5 h-5 text-swap-primary" />
          </div>

          <ItemThumbnails
            items={offer.responderItems}
            label={t("swapping:offers.requesting")}
          />
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-swap-bg">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`text-[10px] font-semibold ${STATUS_STYLES[offer.status]}`}
            >
              {t(`swapping:offers.status${offer.status.charAt(0)}${offer.status.slice(1).toLowerCase()}`)}
            </Badge>

            <div className="flex items-center gap-1">
              <Scale className={`w-3.5 h-3.5 ${fairnessColor}`} />
              <span className={`text-xs font-semibold ${fairnessColor}`}>
                {fairnessPercent}%
              </span>
            </div>

            {offer.status === "PENDING" && (
              <Badge
                variant="outline"
                className={`text-[10px] gap-1 ${isExpiringSoon ? "border-swap-accent-orange text-swap-accent-orange" : "text-swap-text2"}`}
              >
                <Clock className="w-3 h-3" />
                {timeRemaining}
              </Badge>
            )}
          </div>

          <span className="text-[10px] text-swap-text2">
            {formatDate(offer.createdAt)}
          </span>
        </div>

        {hasActions(offer.status) && (
          <div className="flex flex-wrap justify-end mt-3 pt-3 border-t border-swap-bg">
            {offer.status === "ACCEPTED" ? (
              <AcceptedActions offerId={offerId} />
            ) : direction === "RECEIVED" ? (
              <IncomingActions offerId={offerId} offer={offer} />
            ) : (
              <OutgoingActions offerId={offerId} />
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
