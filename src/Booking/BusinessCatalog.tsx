import { useBusinesses } from "@/api/hooks/useBusinesses";
import BusinessCatalogSkeleton from "@/Booking/BusinessCatalogSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { scrollToTop } from "@/utils";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function BusinessCatalog() {
  const navigate = useNavigate();
  const { t } = useTranslation("booking");
  const { data: businesses, isLoading, isFetching, isError } = useBusinesses();

  console.log("Businesses data:", businesses);

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
          <p className="text-destructive text-lg">{t("catalog.errorLoading")}</p>
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
        <p className="text-muted-foreground">
          {t("catalog.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses?.map((business) => {
          console.log("Individual business:", business);

          return (
            <Card
              key={business.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
              onClick={() => handkleClick(business.id)}
            >
              {/* Image Section */}
              <div className="w-full h-48 overflow-hidden relative">
                <img
                  src={business.mainImageUrl}
                  alt={business.businessName}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />

                {/* Call Type Tag Overlay */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
                    {t(`businessDetails.callType.${business.callType}`)}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col p-5">
                <CardTitle className="text-lg font-semibold mb-2 line-clamp-1 overflow-hidden text-ellipsis">
                  {business.businessName}
                </CardTitle>

                {business.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3 grow">
                    {business.description}
                  </p>
                )}

                {/* City */}
                <div className="flex items-center gap-1 mb-4 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{business.city}</span>
                </div>

                {/* Button Section */}
                <div className="flex justify-end mt-auto pt-3 border-t">
                  <Button
                    className="bg-slate-800 hover:bg-slate-900 text-white px-6 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handkleClick(business.id);
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
    </div>
  );
}
