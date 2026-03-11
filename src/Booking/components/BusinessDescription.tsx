import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type BusinessDescriptionProps = {
  description: string | null;
};

export default function BusinessDescription({
  description,
}: BusinessDescriptionProps) {
  const { t } = useTranslation("booking");

  return (
    <Card className=" rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <div className="rounded-full bg-primary text-[#100b2e]"></div>
          {t("businessDetails.sections.about")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed text-base wrap-break-word">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
