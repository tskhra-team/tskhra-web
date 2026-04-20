import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CatalogItemCard } from "@/Swapping/SwapCatalog/CatalogItemCard";
import useGetAllItems from "@/Swapping/SwapCatalog/useGetAllItems";
import useGetSearchedItems from "@/Swapping/SwapCatalog/useGetSearchedItems";
import { Package } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const getVisiblePages = (totalPages: number, currentPage: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }).map((_, i) => i);
  }

  if (currentPage <= 2) {
    return [0, 1, 2, 3, 4, "ellipsis-end", totalPages - 1];
  }

  if (currentPage >= totalPages - 3) {
    return [
      0,
      "ellipsis-start",
      totalPages - 5,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
    ];
  }

  return [
    0,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages - 1,
  ];
};

const SIZE = 12;

export default function SwapCatalogCards() {
  const { t } = useTranslation(["swapping"]);
  const [searchParams, setSearchParams] = useSearchParams();

  // set default pages
  useEffect(() => {
    if (!searchParams.has("page")) {
      setSearchParams(
        (prev) => {
          prev.set("page", "1");
          return prev;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams]);

  const urlPage = Number(searchParams.get("page") || "1");
  const apiPage = Math.max(0, urlPage - 1);

  const setPage = useCallback(
    (updater: number | ((prev: number) => number)) => {
      const newApiPage =
        typeof updater === "function" ? updater(apiPage) : updater;
      const newUrlPage = newApiPage + 1;

      setSearchParams((prev) => {
        prev.set("page", String(newUrlPage));
        return prev;
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [apiPage, setSearchParams],
  );

  // check if we has any filtest on url
  const hasFilters = Array.from(searchParams.keys()).some(
    (key) => key !== "page",
  );

  // get all data from url
  const query = searchParams.get("s") || undefined;

  // THIS IS SHOULD BE REPLACED WITH RIGTH USING SC AND C
  const sc = searchParams.get("sc");
  const categoryId = sc ? Number(sc) : undefined;

  const cityIdParam = searchParams.get("cityId");
  const cityId = cityIdParam ? Number(cityIdParam) : undefined;

  const condition = (searchParams.get("condition") as any) || undefined;
  const tradeRange = (searchParams.get("tradeRange") as any) || undefined;

  const {
    data: allItems,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useGetAllItems(apiPage, SIZE, !hasFilters); // tip: it would be good to add this prop  { enabled: !hasFilters }

  const {
    data: searchedItems,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
  } = useGetSearchedItems({
    query,
    categoryId, // here i sending sc but in future it should be c
    cityId,
    condition,
    tradeRange,
    page: apiPage,
    size: SIZE,
    enabled: hasFilters,
  });

  // choose actual data
  const items = hasFilters ? searchedItems : allItems;
  const isLoading = hasFilters ? isLoadingSearch : isLoadingAll;
  const isError = hasFilters ? isErrorSearch : isErrorAll;

  const totalPages = items?.totalPages ?? 0;

  const visiblePages = useMemo(
    () => getVisiblePages(totalPages, apiPage),
    [totalPages, apiPage],
  );

  return (
    <div className="w-full">
      {items && !items.empty && (
        <p className="text-muted-foreground mb-4">
          {items.totalElements} {t("swapping:catalog.items", "items")}
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: SIZE }).map((_, i) => (
            <Card
              key={i}
              className="h-115 animate-pulse bg-muted rounded-3xl"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {t("swapping:catalog.error", "Failed to load items")}
          </h2>
          <p className="text-muted-foreground">
            {t(
              "swapping:catalog.errorDescription",
              "Something went wrong. Please try again later.",
            )}
          </p>
        </div>
      ) : items?.empty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {t("swapping:catalog.noItems", "No items available")}
          </h2>
          <p className="text-muted-foreground">
            {t(
              "swapping:catalog.noItemsDescription",
              "Check back later for new items to swap!",
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items?.content.map((item) => (
            <CatalogItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className={
                  apiPage === 0
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {visiblePages.map((pageIndex, index) => {
              if (typeof pageIndex === "string") {
                return (
                  <PaginationItem key={`${pageIndex}-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={pageIndex}>
                  <PaginationLink
                    onClick={() => setPage(pageIndex)}
                    isActive={apiPage === pageIndex}
                    className="cursor-pointer"
                  >
                    {pageIndex + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                className={
                  apiPage === totalPages - 1
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
