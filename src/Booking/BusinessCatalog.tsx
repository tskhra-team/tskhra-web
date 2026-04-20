import BusinessCard from "@/Booking/BusinessCard";
import BusinessCatalogSkeleton from "@/Booking/BusinessCatalogSkeleton";
import useGetAllBookingBusinesses from "@/Booking/useGetAllBookingBusinesses";
import { Button } from "@/components/ui/button";
import useGetSubBookingCategories from "@/shared/api/useGetSubBookingCategories";
import { PaginationControls } from "@/shared/pagination/Pagination";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function BusinessCatalog() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("booking");
  const [searchParams, setSearchParams] = useSearchParams();
  const catalogRef = useRef<HTMLDivElement>(null);
  const size = 12;

  const categoryFilter = searchParams.get("category");
  const subcategoryFilter = searchParams.get("subcategory");
  const page = parseInt(searchParams.get("page") || "0", 10);

  const lang = i18n.language.toUpperCase();

  // Always fetch all businesses for client-side pagination
  const {
    data: allBusinessesData,
    isLoading,
    isFetching,
    isError,
  } = useGetAllBookingBusinesses(true, lang);

  // Fetch EN categories for filtering (business API returns English names)
  const { data: categoriesData } = useGetSubBookingCategories("EN");

  // Use all businesses as data source
  const businesses = {
    content: allBusinessesData || [],
    totalPages: 1,
    totalElements: allBusinessesData?.length || 0,
  };

  // Reset to page 0 when filters change
  useEffect(() => {
    if ((categoryFilter || subcategoryFilter) && page !== 0) {
      const params = new URLSearchParams(searchParams);
      params.set("page", "0");
      setSearchParams(params, { replace: true });
    }
  }, [categoryFilter, subcategoryFilter, page, searchParams, setSearchParams]);

  // Filter businesses based on category and subcategory
  const { filteredBusinesses, paginatedBusinesses, totalFilteredPages } =
    useMemo(() => {
      if (!businesses?.content)
        return {
          filteredBusinesses: null,
          paginatedBusinesses: null,
          totalFilteredPages: 0,
        };

      // Reverse to show last added first
      let filtered = [...businesses.content].reverse();

      // Filter by main category (using ID to find EN subcategory names)
      if (categoryFilter && !subcategoryFilter) {
        const matchedCategory = categoriesData?.find(
          (cat) => String(cat.id) === categoryFilter,
        );

        if (matchedCategory) {
          const subNames = matchedCategory.subcategories.map((sub) =>
            sub.name.toLowerCase(),
          );
          filtered = filtered.filter((business) =>
            subNames.includes(business.subCategory.toLowerCase()),
          );
        }
      }

      // Filter by subcategory (using ID to find EN subcategory name)
      if (subcategoryFilter) {
        let matchedSubName: string | undefined;
        categoriesData?.forEach((cat) => {
          const found = cat.subcategories.find(
            (sub) => String(sub.id) === subcategoryFilter,
          );
          if (found) matchedSubName = found.name.toLowerCase();
        });

        if (matchedSubName) {
          filtered = filtered.filter(
            (business) => business.subCategory.toLowerCase() === matchedSubName,
          );
        }
      }

      // Calculate pagination for filtered results
      const totalPages = Math.ceil(filtered.length / size);
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginated = filtered.slice(startIndex, endIndex);

      return {
        filteredBusinesses: filtered,
        paginatedBusinesses: paginated,
        totalFilteredPages: totalPages,
      };
    }, [
      businesses,
      categoryFilter,
      subcategoryFilter,
      page,
      size,
      categoriesData,
    ]);

  // Show skeleton on initial load or when refetching without data
  if (isLoading || (isFetching && !businesses)) {
    return <BusinessCatalogSkeleton />;
  }

  if (isError) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center min-h-100 gap-4">
          <p className="text-destructive text-lg">
            {t("catalog.errorLoading")}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            {t("catalog.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={catalogRef} data-catalog className="lg:px-16 xl:px-0">
      <div className="mb-8 mt-10 lg:mt-20">
        <h1 className="text-3xl font-bold mb-2">{t("catalog.title")}</h1>
        <p className="text-muted-foreground">{t("catalog.subtitle")}</p>

        {/* Clear Filters Button - only show when filters are active */}
        {(categoryFilter || subcategoryFilter) && (
          <div className="mt-4">
            <Button
              onClick={() => {
                navigate("/booking");
                catalogRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <span>✕</span>
              {t("catalog.clearFilters", { defaultValue: "Clear Filters" })}
            </Button>
          </div>
        )}
      </div>

      {filteredBusinesses && filteredBusinesses.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-64 gap-4">
          <p className="text-muted-foreground text-lg">
            {t("catalog.noBusinessesFound")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {paginatedBusinesses?.map((business) => {
            return (
              <BusinessCard key={business.businessId} business={business} />
            );
          })}
        </div>
      )}

      {/* Pagination - show when there's more than one page */}
      {totalFilteredPages > 1 && (
        <div className="mt-8">
          <PaginationControls
            currentPage={page}
            totalPages={totalFilteredPages}
            onPageChange={(newPage) => {
              const params = new URLSearchParams(searchParams);
              params.set("page", String(newPage));
              setSearchParams(params);
              catalogRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            previousLabel={t("pagination.previous")}
            nextLabel={t("pagination.next")}
          />
        </div>
      )}
    </div>
  );
}
