import { useParams, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useCategories } from "@/shared/categories/useCategories";
import { categoryNameToKey } from "@/shared/categories/categoryTranslations";
import { getPlatformColors } from "@/shared/categories/platformColors";
import type { Platform } from "@/shared/categories/types";
import useGetBookingBusinessesByCategory from "@/Booking/useGetBookingBusinessesByCategory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { scrollToTop } from "@/utils";
import Loader from "@/components/Loader";

export default function CategoryPage() {
  const { platform, categorySlug } = useParams<{ platform: Platform; categorySlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories(platform as Platform);
  const { t } = useTranslation("categories");
  const colors = getPlatformColors(platform as Platform);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all");

  // Update active tab when URL params change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("all");
    }
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
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 text-sm text-red-600">{categoriesError.message}</div>
      </div>
    );
  }

  if (businessesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 text-sm text-red-600">{businessesError.message}</div>
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

  const handleServiceClick = (id: string) => {
    scrollToTop();
    navigate(`/business/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: colors.active.text }}>
          {categoryDisplayName}
        </h1>
        <p className="text-muted-foreground">
          {(categoryBusinesses || []).length} {t('servicesAvailable', { defaultValue: 'businesses available' })}
        </p>
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
        }} className="mb-8">
          <TabsList variant="line" className="mb-6 overflow-x-auto flex-wrap h-auto">
            <TabsTrigger value="all">
              {t('all', { defaultValue: 'All' })}
            </TabsTrigger>
            {category.childItems.map((subcategory) => {
              const subTranslationKey = categoryNameToKey[subcategory.name];
              const subDisplayName = subTranslationKey ? t(subTranslationKey) : subcategory.name;
              const subcategorySlug = subcategory.name.toLowerCase().replace(/\s+/g, '-');
              return (
                <TabsTrigger key={subcategory.name} value={subcategorySlug}>
                  {subDisplayName}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeTab}>
            {/* Business Catalog Grid */}
            {filteredBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
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

                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl line-clamp-2">
                          {business.businessName}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {business.city}
                          {business.addressDetail && `, ${business.addressDetail}`}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {business.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {business.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{business.callType}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {business.subCategory}
                        </div>
                      </div>

                      <Button className="w-full" variant="outline">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
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

                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl line-clamp-2">
                        {business.businessName}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {business.city}
                        {business.addressDetail && `, ${business.addressDetail}`}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {business.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {business.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{business.callType}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {business.subCategory}
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
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
