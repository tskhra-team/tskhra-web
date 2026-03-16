import { Card, CardContent } from "@/components/ui/card";
import BusinessPickerSkeleton from "@/features/my-businesses/BusinessPickerSkeleton";
import type { MyBusinessResponse } from "@/features/my-businesses/useGetMyBusinesses";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type BusinessPickerProps = {
  businesses: MyBusinessResponse[];
  isLoading: boolean;
};

export default function BusinessPicker({
  businesses,
  isLoading,
}: BusinessPickerProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard");

  if (isLoading) {
    return <BusinessPickerSkeleton />;
  }

  const handleBusinessClick = (businessId: string) => {
    navigate(`/my-businesses?businessId=${businessId}&section=chart`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("businessPicker.title")}
        </h2>
        <p className="text-muted-foreground mt-2">
          {t("businessPicker.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {businesses.map((business) => (
          <Card
            key={business.businessId}
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-101 overflow-hidden"
            onClick={() => handleBusinessClick(business.businessId)}
          >
            <CardContent className="p-0">
              <div className="aspect-square w-full overflow-hidden bg-muted">
                <img
                  src={business.mainImage}
                  alt={business.businessName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {business.businessName}
                </h3>
                <p className="text-sm text-muted-foreground capitalize mt-1">
                  {business.callType.toLowerCase()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
