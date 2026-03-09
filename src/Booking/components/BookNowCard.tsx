import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type BookNowCardProps = {
  businessName: string;
  onBookNowClick: () => void;
};

export default function BookNowCard({
  businessName,
  onBookNowClick,
}: BookNowCardProps) {
  const { t } = useTranslation("booking");

  return (
    <Card className="rounded-2xl border-primary/20 from-primary/5 to-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl break-all leading-tight whitespace-normal">
          {businessName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full cursor-pointer  hover:shadow-xl transition-all duration-300 text-base font-semibold rounded-xl h-12 bg-[#ff6439] hover:bg-[#100b2e]"
          size="lg"
          onClick={onBookNowClick}
        >
          {t("businessDetails.buttons.bookNow")}
        </Button>
      </CardContent>
    </Card>
  );
}
