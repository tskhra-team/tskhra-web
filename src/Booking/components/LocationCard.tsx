import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

type LocationCardProps = {
  addressDetail: string;
  city: string;
};

export default function LocationCard({
  addressDetail,
  city,
}: LocationCardProps) {
  const { t } = useTranslation("booking");

  return (
    <Card className=" rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <div className="rounded-full bg-primary"></div>
          {t("businessDetails.sections.location")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <MapPin className="w-5 h-5 text-primary mt-0.5" />
          <div>
            {addressDetail && (
              <p className="font-semibold text-base">{addressDetail}</p>
            )}
            <p className="text-muted-foreground">{city}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
