import BusinessCatalogSkeleton from "@/Booking/BusinessCatalogSkeleton";
import useGetAllBookingBusinesses from "@/Booking/useGetAllBookingBusinesses";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { PaginationControls } from "@/shared/pagination/Pagination";
import { scrollToTop } from "@/utils";
import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function BusinessCatalog() {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation("booking");
  const [searchParams] = useSearchParams();
  const size = 12;

  const categoryFilter = searchParams.get('category');
  const subcategoryFilter = searchParams.get('subcategory');

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
    setPage(0);
  }, [categoryFilter, subcategoryFilter]);

  // Filter businesses based on category and subcategory
  const { filteredBusinesses, paginatedBusinesses, totalFilteredPages } = useMemo(() => {
    if (!businesses?.content) return { filteredBusinesses: null, paginatedBusinesses: null, totalFilteredPages: 0 };

    let filtered = businesses.content;

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
    <div className="container mx-auto px-2 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("catalog.title")}</h1>
        <p className="text-muted-foreground">{t("catalog.subtitle")}</p>
      </div>

      {filteredBusinesses && filteredBusinesses.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-64 gap-4">
          <p className="text-muted-foreground text-lg">
            No businesses found for the selected filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBusinesses?.map((business) => {
          return (
            <Card
              key={business.businessId}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
              onClick={() => handkleClick(business.businessId)}
            >
              {/* Image Section */}
              <div className="w-full h-48 overflow-hidden relative">
                <img
                  src={business.mainImage}
                  alt={business.businessName}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />

                {/* Call Type Tag Overlay */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
                    {t(`${business.callType}`)}
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
                  {business.description || '\u00A0'}
                </p>

                {/* City */}
                <div className="flex items-center gap-1 mb-4 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{business.city}</span>
                  <span>{business.addressDetail}</span>
                </div>

                {/* Button Section */}
                <div className="flex justify-end mt-auto pt-3 border-t">
                  <Button
                    className="bg-slate-800 hover:bg-slate-900 text-white px-6 rounded-full cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handkleClick(business.businessId);
                    }}
                  >
                    {t("catalog.viewDetails")}
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
              setPage(newPage);
              scrollToTop();
            }}
          />
        </div>
      )}
    </div>
  );
}
