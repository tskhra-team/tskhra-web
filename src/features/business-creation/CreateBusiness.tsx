import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CreateBookingBusiness from "@/features/business-creation/booking-business/CreateBookingBusiness";
import { scrollToTop } from "@/utils";
import { Calendar, Check, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function CreateBusiness() {
  const { t } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedType = searchParams.get("business");

  if (selectedType === "ecommerce" || selectedType === "booking") {
    return (
      <div className="container mx-auto py-8 px-4">
        {selectedType === "ecommerce" ? (
          <>
            <div>{t("businessTypeSelection.ecommerce.comingSoonMessage")}</div>
          </>
        ) : (
          <>
            <CreateBookingBusiness />
          </>
        )}
      </div>
    );
  }

  const handleClick = (type: string) => {
    setSearchParams({ business: type });
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t("businessTypeSelection.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("businessTypeSelection.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Booking Business Card */}
          <Card className="relative group border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-linear-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-4 tracking-tight">
                {t("businessTypeSelection.booking.title")}
              </h2>
              <p className="text-muted-foreground text-center mb-8 leading-relaxed">
                {t("businessTypeSelection.booking.description")}
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed">
                    {t("businessTypeSelection.booking.feature1")}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed">
                    {t("businessTypeSelection.booking.feature2")}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed">
                    {t("businessTypeSelection.booking.feature3")}
                  </span>
                </li>
              </ul>
              <Button
                onClick={() => handleClick("booking")}
                size="lg"
                className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
              >
                {t("businessTypeSelection.getStarted")}
              </Button>
            </CardContent>
          </Card>

          {/* E-commerce Card */}
          <Card className="relative border-2 border-border/30 bg-muted/30 backdrop-blur-sm">
            <div className="absolute -top-3 right-6 bg-muted-foreground text-background px-5 py-1.5 rounded-full text-sm font-semibold shadow-md">
              {t("businessTypeSelection.comingSoon")}
            </div>
            <CardContent className="p-8 opacity-60">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="w-10 h-10 text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-4 tracking-tight text-muted-foreground">
                {t("businessTypeSelection.ecommerce.title")}
              </h2>
              <p className="text-muted-foreground/80 text-center mb-8 leading-relaxed">
                {t("businessTypeSelection.ecommerce.description")}
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-sm leading-relaxed text-muted-foreground/80">
                    {t("businessTypeSelection.ecommerce.feature1")}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-sm leading-relaxed text-muted-foreground/80">
                    {t("businessTypeSelection.ecommerce.feature2")}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-sm leading-relaxed text-muted-foreground/80">
                    {t("businessTypeSelection.ecommerce.feature3")}
                  </span>
                </li>
              </ul>
              <Button
                disabled
                size="lg"
                className="w-full h-12 text-base font-semibold cursor-not-allowed"
              >
                {t("businessTypeSelection.getStarted")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
