import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PackageOpen } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { OfferCard } from "./OfferCard";
import type { TradeOffer } from "./types";

interface OffersColumnProps {
  title: string;
  offers: TradeOffer[] | undefined;
  isLoading: boolean;
  isEmpty: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  skeletonCount: number;
}

function getVisiblePages(totalPages: number, currentPage: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }).map((_, i) => i);
  }
  if (currentPage <= 1) return [0, 1, 2, 3, 4];
  if (currentPage >= totalPages - 2)
    return [totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
}

export function OffersColumn({
  title,
  offers,
  isLoading,
  isEmpty,
  page,
  totalPages,
  onPageChange,
  skeletonCount,
}: OffersColumnProps) {
  const { t } = useTranslation(["swapping"]);
  const visiblePages = useMemo(
    () => getVisiblePages(totalPages, page),
    [totalPages, page],
  );

  return (
    <div className="flex flex-col min-h-0">
      <h2 className="text-xl font-bold mb-4 text-swap-text">{title}</h2>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[calc(100vh-260px)]">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <Card
                key={i}
                className="h-40 animate-pulse bg-muted rounded-2xl"
              />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PackageOpen className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              {t("swapping:offers.noOffers")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers?.map((offer, idx) => (
              <OfferCard key={offer.offerId} offer={offer} index={idx} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(0, page - 1))}
                className={
                  page === 0
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {visiblePages.map((pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  onClick={() => onPageChange(pageIndex)}
                  isActive={page === pageIndex}
                  className="cursor-pointer"
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                className={
                  page === totalPages - 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
