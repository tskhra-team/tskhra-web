import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import type { Service } from "@/Booking/types/booking.types";

type ServicesListProps = {
  services?: Service[];
  servicesLoading: boolean;
  onServiceClick: (service: Service) => void;
};

const ServicesList = forwardRef<HTMLDivElement, ServicesListProps>(
  ({ services, servicesLoading, onServiceClick }, ref) => {
    const { t } = useTranslation("booking");
    
    return (
      <Card
        ref={ref}
        className=" rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm"
      >
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <div className="rounded-full bg-primary"></div>
            {t("businessDetails.sections.servicesOffered")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {servicesLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("businessDetails.status.loading")}
            </div>
          ) : services && services.length > 0 ? (
            <div className="space-y-3">
              {services.map((service) => {
                const isInactive = service.status === "INACTIVE";

                return (
                  <div
                    key={service.id}
                    onClick={() => !isInactive && onServiceClick(service)}
                    className={`p-5 border border-border/50 rounded-xl transition-all duration-300 group ${
                      isInactive
                        ? "opacity-50 cursor-not-allowed bg-muted/30"
                        : "hover:bg-primary/5 hover:border-primary/30 hover:shadow-md cursor-pointer"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-semibold text-lg transition-colors ${
                        isInactive ? "text-muted-foreground" : "group-hover:text-primary"
                      }`}>
                        {service.name}
                      </h3>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          isInactive ? "text-muted-foreground" : "text-primary"
                        }`}>
                          ₾{service.price}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration >= 60
                            ? `${Math.floor(service.duration / 60)}${t("businessDetails.time.hours")} ${service.duration % 60 > 0 ? `${service.duration % 60}${t("businessDetails.time.minutes")}` : ""}`
                            : `${service.duration}${t("businessDetails.time.minutes")}`}
                        </p>
                      </div>
                    </div>
                    {service.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              {t("businessDetails.status.noServices")}
            </p>
          )}
        </CardContent>
      </Card>
    );
  },
);

ServicesList.displayName = "ServicesList";

export default ServicesList;
