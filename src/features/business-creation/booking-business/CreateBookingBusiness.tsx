import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { scrollToTop } from "@/utils";
import { ArrowLeft, Briefcase, Check, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import IndividualBusinessForm from "./IndividualBusinessForm";
import ServiceForm from "./ServiceForm";

export default function CreateBookingBusiness() {
  const { t } = useTranslation("booking");
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedType = searchParams.get("type");
  const currentStep = searchParams.get("step");

  if (selectedType === "individual" || selectedType === "business") {
    return (
      <div className="min-h-screen bg-linsear-to-b from-background to-muted/20">
        <div className="container mx-auto py-8 px-4 max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => {
              setSearchParams((prevParams) => {
                prevParams.delete("type");
                prevParams.delete("step");
                return prevParams;
              });
            }}
            className="mb-6 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("businessCreation.backToSelection")}
          </Button>

          {selectedType === "individual" ? (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                  {t("businessCreation.individual.title")}
                </h1>
                {currentStep && (
                  <p className="text-lg text-muted-foreground">
                    {t("booking:form.step")} {currentStep}{" "}
                    {currentStep === "1" ? "of 2" : "of 2"}
                  </p>
                )}
              </div>
              {currentStep === "2" ? (
                <ServiceForm />
              ) : (
                <IndividualBusinessForm />
              )}
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight">
                  {t("businessCreation.commercial.title")}
                </h1>
              </div>
              <IndividualBusinessForm />{" "}
              {/*here should be BusinessServiceForm */}
            </>
          )}
        </div>
      </div>
    );
  }

  const handleClick = (type: string) => {
    setSearchParams((prevParams) => {
      prevParams.set("type", type);
      prevParams.set("step", "1");
      return prevParams;
    });
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => setSearchParams({})}
          className="mb-8 hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("businessCreation.backToSelection")}
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t("businessCreation.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("businessCreation.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Individual Service Card */}
          <Card className="relative group border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-linear-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-4 tracking-tight">
                {t("businessCreation.individual.title")}
              </h2>
              <p className="text-muted-foreground text-center mb-8 leading-relaxed">
                {t("businessCreation.individual.description")}
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed">
                    {t("businessCreation.individual.feature1")}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed">
                    {t("businessCreation.individual.feature2")}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed">
                    {t("businessCreation.individual.feature3")}
                  </span>
                </li>
              </ul>
              <Button
                onClick={() => handleClick("individual")}
                size="lg"
                className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
              >
                {t("businessCreation.getStarted")}
              </Button>
            </CardContent>
          </Card>

          {/* Business Service Card */}
          <Card className="relative border-2 border-border/30 bg-muted/30 backdrop-blur-sm">
            <div className="absolute -top-3 right-6 bg-muted-foreground text-background px-5 py-1.5 rounded-full text-sm font-semibold shadow-md">
              {t("businessCreation.comingSoon")}
            </div>
            <CardContent className="p-8 opacity-60">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-10 h-10 text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-4 tracking-tight text-muted-foreground">
                {t("businessCreation.commercial.title")}
              </h2>
              <p className="text-muted-foreground/80 text-center mb-8 leading-relaxed">
                {t("businessCreation.commercial.description")}
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-sm leading-relaxed text-muted-foreground/80">
                    {t("businessCreation.commercial.feature1")}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-sm leading-relaxed text-muted-foreground/80">
                    {t("businessCreation.commercial.feature2")}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-sm leading-relaxed text-muted-foreground/80">
                    {t("businessCreation.commercial.feature3")}
                  </span>
                </li>
              </ul>
              <Button
                disabled
                size="lg"
                className="w-full h-12 text-base font-semibold cursor-not-allowed"
              >
                {t("businessCreation.getStarted")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
