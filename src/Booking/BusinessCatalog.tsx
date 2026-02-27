import { useBusinesses } from "@/api/hooks/useBusinesses";
import BusinessCatalogSkeleton from "@/Booking/BusinessCatalogSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { scrollToTop } from "@/utils";
import { Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BusinessCatalog() {
  const navigate = useNavigate();
  const { data: businesses, isLoading, isFetching, isError } = useBusinesses();

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
          <p className="text-destructive text-lg">Failed to load businesses</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">კატალოგი</h1>
        <p className="text-muted-foreground">
          Browse our collection of professional services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses?.map((business) => {
          // Get the first service for price and duration display
          const firstService = business.services[0];
          const displayPrice = firstService?.price || 0;
          const displayDuration = firstService?.time
            ? `${firstService.time} min`
            : "N/A";

          return (
            <Card
              key={business.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handkleClick(business.id)}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={business.mainImageUrl}
                  alt={business.businessName}
                  loading="lazy"
                  width={800}
                  height={450}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl line-clamp-2 break-all min-w-0">
                    {business.businessName}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {business.description || "No description available"}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{displayDuration}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-lg">
                    <DollarSign className="w-5 h-5" />
                    <span>{displayPrice}</span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
