import BusinessCatalogSkeleton from "@/Booking/BusinessCatalogSkeleton";
import useGetAllBookingBusinesses from "@/Booking/useGetAllBookingBusinesses";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { SmartImage } from "@/components/SmartImage";
import { PaginationControls } from "@/shared/pagination/Pagination";
import { scrollToTop } from "@/utils";
import { MapPin } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function BusinessCatalog() {
  const navigate = useNavigate();
  const { t } = useTranslation("booking");
  const [searchParams, setSearchParams] = useSearchParams();
  const size = 12;

  const categoryFilter = searchParams.get('category');
  const subcategoryFilter = searchParams.get('subcategory');
  const page = parseInt(searchParams.get('page') || '0', 10);

  // Always fetch all businesses for client-side pagination
  const { data: allBusinessesData, isLoading, isFetching, isError } = useGetAllBookingBusinesses(true);

  // Use all businesses as data source
  const businesses = {
    content: allBusinessesData || [],
    totalPages: 1,
    totalElements: allBusinessesData?.length || 0
  };

  // Reset to page 0 when filters change
  useEffect(() => {
    if ((categoryFilter || subcategoryFilter) && page !== 0) {
      const params = new URLSearchParams(searchParams);
      params.set('page', '0');
      setSearchParams(params, { replace: true });
    }
  }, [categoryFilter, subcategoryFilter, page, searchParams, setSearchParams]);

  // Filter businesses based on category and subcategory
  const { filteredBusinesses, paginatedBusinesses, totalFilteredPages } = useMemo(() => {
    if (!businesses?.content) return { filteredBusinesses: null, paginatedBusinesses: null, totalFilteredPages: 0 };

    // Reverse to show last added first
    let filtered = [...businesses.content].reverse();

    // Filter by category if selected
    if (categoryFilter) {
      filtered = filtered.filter(
        (business) => business.category.toLowerCase().replace(/\s+/g, '-') === categoryFilter
      );
    }

    // Filter by subcategory if selected
    if (subcategoryFilter) {
      filtered = filtered.filter(
        (business) => business.subCategory.toLowerCase().replace(/\s+/g, '-') === subcategoryFilter
      );
    }

    // Calculate pagination for filtered results
    const totalPages = Math.ceil(filtered.length / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      filteredBusinesses: filtered,
      paginatedBusinesses: paginated,
      totalFilteredPages: totalPages
    };
  }, [businesses, categoryFilter, subcategoryFilter, page, size]);

  const handkleClick = (id: string) => {
    scrollToTop();
    navigate(`/business/${id}`);
  };

  // Show skeleton on initial load or when refetching without data
  if (isLoading || (isFetching && !businesses)) {
    return <BusinessCatalogSkeleton />;
  }

  if (isError) {
    return (
      <div className="container mx-auto px-2 py-8">
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
    <div className="container mx-auto px-2 py-8" data-catalog>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("catalog.title")}</h1>
        <p className="text-muted-foreground">{t("catalog.subtitle")}</p>

        {/* Clear Filters Button - only show when filters are active */}
        {(categoryFilter || subcategoryFilter) && (
          <div className="mt-4">
            <Button
              onClick={() => {
                navigate('/booking');
                scrollToTop();
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
            <Card
              key={business.businessId}
              className="group overflow-hidden transition-all duration-500 cursor-pointer flex flex-col"
              onClick={() => handkleClick(business.businessId)}
            >
              {/* Image Section */}
              <div className="w-full h-48 overflow-hidden relative">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-10" />

                <SmartImage
                  src={business.mainImage}
                  alt={business.businessName}
                  containerClassName="aspect-video w-full rounded-lg"
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-500 brightness-95 group-hover:brightness-105"
                />

                {/* Call Type Tag Overlay */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-slate-800 shadow-lg border border-white/40">
                    {t(`businessDetails.callType.${business.callType.toLowerCase()}`)}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col p-5">
                <CardTitle className="text-lg font-semibold mb-2 line-clamp-1 overflow-hidden text-ellipsis">
                  {business.businessName}
                </CardTitle>

                {/* Description - Fixed size for consistent UI */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">
                  {business.description || "\u00A0"}
                </p>

                {/* City */}
                <div className="flex items-center gap-1 mb-4 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{business.city}</span>
                  <span>{business.addressDetail}</span>
                </div>

                {/* Button Section */}
                <div className="flex justify-end mt-auto pt-3 border-t border-gray-100">
                  <Button
                    className="relative overflow-hidden bg-linear-to-r from-slate-700 to-slate-900 text-white px-8 py-2.5 rounded-full cursor-pointer font-semibold shadow-lg transition-all duration-500 border-2 border-slate-600/30 backdrop-blur-sm group-hover:shadow-2xl hover:from-slate-600 hover:to-slate-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handkleClick(business.businessId);
                    }}
                  >
                    <span className="relative z-10 tracking-wide">{t("catalog.viewDetails")}</span>
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-linear-to-r from-transparent via-white/25 to-transparent" />
                    {/* Inner subtle glow */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent" />
                    {/* Top highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
                  </Button>
                </div>
              </div>
            </Card>
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
              params.set('page', String(newPage));
              setSearchParams(params);
              scrollToTop();
            }}
          />
        </div>
      )}
    </div>
  );
}
