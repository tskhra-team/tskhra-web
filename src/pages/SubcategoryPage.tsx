import { useParams, Navigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/shared/categories/useCategories";
import { categoryNameToKey } from "@/shared/categories/categoryTranslations";
import { getPlatformColors } from "@/shared/categories/platformColors";
import type { Platform } from "@/shared/categories/types";
import { mockServices } from "@/Booking/mockSerrvices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, MapPin, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { scrollToTop } from "@/utils";
import Loader from "@/components/Loader";

export default function SubcategoryPage() {
  const { platform, categorySlug, subcategorySlug } = useParams<{
    platform: Platform;
    categorySlug: string;
    subcategorySlug: string;
  }>();
  const { data: categories, isLoading, error } = useCategories(platform as Platform);
  const { t } = useTranslation("categories");
  const colors = getPlatformColors(platform as Platform);
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 text-sm text-red-600">{error.message}</div>
      </div>
    );
  }

  // Find the category and subcategory by slug
  const category = categories?.find(
    (cat) => cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
  );

  if (!category) {
    return <Navigate to={`/${platform}`} replace />;
  }

  const subcategory = category.childItems?.find(
    (sub) => sub.name.toLowerCase().replace(/\s+/g, '-') === subcategorySlug
  );

  if (!subcategory) {
    return <Navigate to={`/${platform}/category/${categorySlug}`} replace />;
  }

  const categoryTranslationKey = categoryNameToKey[category.name];
  const categoryDisplayName = categoryTranslationKey
    ? t(categoryTranslationKey)
    : category.name;

  const subcategoryTranslationKey = categoryNameToKey[subcategory.name];
  const subcategoryDisplayName = subcategoryTranslationKey
    ? t(subcategoryTranslationKey)
    : subcategory.name;

  // Filter services by subcategory
  // TODO: Replace with actual API call filtered by subcategory
  const filteredServices = mockServices.filter(
    (service) => service.subcategoryId?.toLowerCase() === subcategory.name.toLowerCase()
  );

  const handleServiceClick = (id: string) => {
    scrollToTop();
    navigate(`/business/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          to={`/${platform}`}
          className="hover:text-foreground transition-colors capitalize"
        >
          {platform}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          to={`/${platform}/category/${categorySlug}`}
          className="hover:text-foreground transition-colors"
        >
          {categoryDisplayName}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-foreground">{subcategoryDisplayName}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: colors.active.text }}>
          {subcategoryDisplayName}
        </h1>
        <p className="text-muted-foreground">
          {filteredServices.length} {t('servicesAvailable', { defaultValue: 'services available' })}
        </p>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleServiceClick(service.id)}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={service.mainImageUrl}
                  alt={service.title}
                  loading="lazy"
                  width={800}
                  height={450}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl line-clamp-2">
                    {service.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {service.city}
                    {service.district && `, ${service.district}`}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{service.estimatedTime || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-lg">
                    <DollarSign className="w-5 h-5" />
                    <span>{service.price}</span>
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
          <p className="text-muted-foreground mb-4">
            {t('noServicesYet', { defaultValue: 'No services available in this category yet.' })}
          </p>
          <Button asChild variant="outline">
            <Link to={`/${platform}/category/${categorySlug}`}>
              {t('backToCategory', { defaultValue: 'Back to Category' })}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
