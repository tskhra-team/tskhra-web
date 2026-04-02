import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BusinessPickerSkeleton from "@/features/my-businesses/BusinessPickerSkeleton";
import type { MyBusinessResponse } from "@/features/my-businesses/useGetMyBusinesses";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useState } from "react";

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
  const [isTour, setIsTour] = useState(false);
  const driverObj = driver({
    animate: true,
    showButtons: ["close"],
    // showProgress: true,
    steps: [
      {
        element: "#business-grid-tour",
        popover: {
          title: t("tour.businessGridTitle"),
          description: t("tour.businessGridDesc"),
          side: "top",
          align: "center",
        },
      },
    ],
  });

  if (isLoading) {
    return <BusinessPickerSkeleton />;
  }

  const handleBusinessClick = (businessId: string) => {
    driverObj.destroy();
    navigate(`/my-businesses?businessId=${businessId}&section=chart`, {
      state: {
        isTour: isTour,
      },
    });
  };

  const startDemonstration = () => {
    setIsTour(true);
    driverObj.drive();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("businessPicker.title")}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t("businessPicker.subtitle")}
          </p>
        </div>
        <Button onClick={startDemonstration}>{t("tutorial")}</Button>
      </div>

      <div
        id="business-grid-tour"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
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
