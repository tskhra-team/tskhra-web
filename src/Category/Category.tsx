import useGetBookingBusinessesByCategory from "@/Booking/useGetBookingBusinessesByCategory";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoryNameToKey } from "@/shared/categories/categoryTranslations";
import { getPlatformColors } from "@/shared/categories/platformColors";
import type { Platform } from "@/shared/categories/types";
import { useCategories } from "@/shared/categories/useCategories";
import { scrollToTop } from "@/utils";
import { ChevronDown, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";

const ITEMS_PER_PAGE = 12;

export default function Category() {
  const { platform, categorySlug } = useParams<{ platform: Platform; categorySlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories(platform as Platform);
  const { t } = useTranslation("categories");
  const colors = getPlatformColors(platform as Platform);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Update active tab when URL params change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("all");
    }
    // Reset to page 1 when tab changes
    setCurrentPage(1);
  }, [searchParams]);

  // Find the category by slug
  const category = categories?.find(
    (cat) => cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
  );

  // Fetch all businesses for this category
  const { data: categoryBusinesses, isLoading: businessesLoading, error: businessesError } = useGetBookingBusinessesByCategory(
    category?.name || "",
    !!category // Only fetch if category exists
  );

  if (categoriesLoading || businessesLoading) {
    return <Loader />;
  }

  if (categoriesError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="p-4 sm:p-6 text-sm text-red-600">{categoriesError.message}</div>
      </div>
    );
  }

  if (businessesError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="p-4 sm:p-6 text-sm text-red-600">{businessesError.message}</div>
      </div>
    );
  }

  if (!category) {
    return <Navigate to={`/${platform}`} replace />;
  }

  const translationKey = categoryNameToKey[category.name];
  const categoryDisplayName = translationKey ? t(translationKey) : category.name;

  // Filter businesses by active subcategory (client-side filtering)
  // Note: activeTab comes from URL as slug (e.g., "nail-care-services")
  // We need to convert it back to the original name format for comparison
  const filteredBusinesses = activeTab === "all"
    ? categoryBusinesses || []
    : (categoryBusinesses || []).filter(
        (business) => {
          const businessSubCatSlug = business.subCategory?.toLowerCase().replace(/\s+/g, '-');
          return businessSubCatSlug === activeTab;
        }
      );

  // Pagination calculations
  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, endIndex);

  const handleServiceClick = (id: string) => {
    scrollToTop();
    navigate(`/business/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: colors.active.text }}>
          {categoryDisplayName}
        </h1>
        {/* <p className="text-muted-foreground">
          {(categoryBusinesses || []).length} {t('servicesAvailable', { defaultValue: 'businesses available' })}
        </p> */}
      </div>

      {/* Tabs for filtering by subcategory */}
      {category.childItems && category.childItems.length > 0 ? (
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          if (value === "all") {
            setSearchParams({});
          } else {
            setSearchParams({ tab: value });
          }
        }} className="mb-6 sm:mb-8">
          {/* Mobile: Collapsible category selector */}
          <div className="sm:hidden mb-6">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border rounded-md bg-background hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium">
                {activeTab === "all"
                  ? t('all', { defaultValue: 'All' })
                  : (() => {
                      const subcategory = category.childItems.find(
                        item => item.name.toLowerCase().replace(/\s+/g, '-') === activeTab
                      );
                      if (subcategory) {
                        const subTranslationKey = categoryNameToKey[subcategory.name];
                        return subTranslationKey ? t(subTranslationKey) : subcategory.name;
                      }
                      return t('all', { defaultValue: 'All' });
                    })()
                }
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMobileMenuOpen && (
              <div className="mt-2 border rounded-md bg-background overflow-hidden">
                <button
                  onClick={() => {
                    setActiveTab("all");
                    setSearchParams({});
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                    activeTab === "all" ? "bg-muted font-medium" : ""
                  }`}
                >
                  {t('all', { defaultValue: 'All' })}
                </button>
                {category.childItems.map((subcategory) => {
                  const subTranslationKey = categoryNameToKey[subcategory.name];
                  const subDisplayName = subTranslationKey ? t(subTranslationKey) : subcategory.name;
                  const subcategorySlug = subcategory.name.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <button
                      key={subcategory.name}
                      onClick={() => {
                        setActiveTab(subcategorySlug);
                        setSearchParams({ tab: subcategorySlug });
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                        activeTab === subcategorySlug ? "bg-muted font-medium" : ""
                      }`}
                    >
                      {subDisplayName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop: Horizontal tabs */}
          <TabsList variant="line" className="hidden sm:flex mb-6 sm:mb-8 flex-wrap h-auto gap-2 justify-start w-full overflow-x-auto">
            <TabsTrigger value="all" className="whitespace-nowrap">
              {t('all', { defaultValue: 'All' })}
            </TabsTrigger>
            {category.childItems.map((subcategory) => {
              const subTranslationKey = categoryNameToKey[subcategory.name];
              const subDisplayName = subTranslationKey ? t(subTranslationKey) : subcategory.name;
              const subcategorySlug = subcategory.name.toLowerCase().replace(/\s+/g, '-');
              return (
                <TabsTrigger key={subcategory.name} value={subcategorySlug} className="whitespace-nowrap">
                  {subDisplayName}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeTab}>
            {/* Business Catalog Grid */}
            {filteredBusinesses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {paginatedBusinesses.map((business) => (
                    <Card
                      key={business.businessId}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleServiceClick(business.businessId)}
                    >
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={business.mainImage}
                          alt={business.businessName}
                          loading="lazy"
                          width={800}
                          height={450}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>

                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg sm:text-xl line-clamp-2">
                            {business.businessName}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                          <span className="line-clamp-1">
                            {business.city}
                            {business.addressDetail && `, ${business.addressDetail}`}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 p-4 sm:p-6 pt-0 sm:pt-0">
                        {business.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                            {business.description}
                          </p>
                        )}

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                            <span className="line-clamp-1">{business.callType}</span>
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                            {business.subCategory}
                          </div>
                        </div>

                        <Button className="w-full text-sm" variant="outline">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="min-w-10"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 sm:p-12 text-center">
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t('noServicesYet', { defaultValue: 'No services available in this category yet.' })}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        /* No subcategories - show all businesses directly */
        <div>
          {filteredBusinesses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {paginatedBusinesses.map((business) => (
                  <Card
                    key={business.businessId}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleServiceClick(business.businessId)}
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={business.mainImage}
                        alt={business.businessName}
                        loading="lazy"
                        width={800}
                        height={450}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>

                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg sm:text-xl line-clamp-2">
                          {business.businessName}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-2">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="line-clamp-1">
                          {business.city}
                          {business.addressDetail && `, ${business.addressDetail}`}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 p-4 sm:p-6 pt-0 sm:pt-0">
                      {business.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {business.description}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                          <span className="line-clamp-1">{business.callType}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                          {business.subCategory}
                        </div>
                      </div>

                      <Button className="w-full text-sm" variant="outline">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="min-w-10"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">
                {t('noServicesYet', { defaultValue: 'No services available in this category yet.' })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
