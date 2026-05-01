import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type BookNowCardProps = {
  businessName: string;
  onBookNowClick: () => void;
  onChatbotClick: () => void;
};

export default function BookNowCard({
  businessName,
  onBookNowClick,
  onChatbotClick,
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
          className="w-full cursor-pointer text-base font-semibold rounded-xl h-12 bg-[#ff6439] hover:bg-[#100b2e] relative overflow-hidden"
          size="lg"
          onClick={onBookNowClick}
          style={{
            transition: "all 0.5s ease-out",
            boxShadow: "0 4px 14px -2px rgba(255, 100, 57, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "scale(1.05) translateY(-4px) rotate(0.5deg)";
            e.currentTarget.style.boxShadow =
              "0 20px 50px -10px rgba(255, 100, 57, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "scale(1) translateY(0) rotate(0deg)";
            e.currentTarget.style.boxShadow =
              "0 4px 14px -2px rgba(255, 100, 57, 0.3)";
          }}
        >
          {/* Decorative shine effect */}
          <div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)",
            }}
          />
          <span className="relative z-10">
            {t("businessDetails.buttons.bookNow")}
          </span>
        </Button>

        <Button
          className="w-full cursor-pointer text-base font-semibold rounded-xl h-12 text-white relative overflow-hidden"
          size="lg"
          onClick={onChatbotClick}
          style={{
            background:
              "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)",
            transition: "all 0.5s ease-out",
            boxShadow: "0 4px 14px -2px rgba(124, 58, 237, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "scale(1.05) translateY(-4px) rotate(0.5deg)";
            e.currentTarget.style.boxShadow =
              "0 20px 50px -10px rgba(124, 58, 237, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "scale(1) translateY(0) rotate(0deg)";
            e.currentTarget.style.boxShadow =
              "0 4px 14px -2px rgba(124, 58, 237, 0.3)";
          }}
        >
          <div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)",
            }}
          />
          <span className="relative z-10">AI Chat Bot</span>
        </Button>
      </CardContent>
    </Card>
  );
}
