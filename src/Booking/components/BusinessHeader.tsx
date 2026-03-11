import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type BusinessHeaderProps = {
  businessName: string;
  category: string;
  callType: string;
};

export default function BusinessHeader({
  businessName,
  category,
  callType,
}: BusinessHeaderProps) {
  const { t } = useTranslation("booking");
  const navigate = useNavigate();

  const getCallTypeBadge = () => {
    switch (callType.toLowerCase()) {
      case "outcall":
        return (
          <Badge variant="secondary">
            {t("businessDetails.callType.outcall")}
          </Badge>
        );
      case "onsite":
        return (
          <Badge variant="default">
            {t("businessDetails.callType.onsite")}
          </Badge>
        );
      case "both":
        return (
          <Badge variant="outline">{t("businessDetails.callType.both")}</Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <button
          onClick={() => navigate("/")}
          className="hover:text-primary transition-colors font-medium"
        >
          {t("businessDetails.breadcrumb.home")}
        </button>
        <span className="text-muted-foreground/50">•</span>
        <button
          onClick={() => navigate("/booking")}
          className="hover:text-primary transition-colors font-medium"
        >
          {t("businessDetails.breadcrumb.booking")}
        </button>
        <span className="text-muted-foreground/50">•</span>
        <span className="text-[#100b2e] font-semibold">{businessName}</span>
      </div>

      {/* Business Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-4xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
            {businessName}
          </h1>
          {getCallTypeBadge()}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="w-5 h-5 text-primary/70" />
          <span className="text-base">{category}</span>
        </div>
      </div>
    </>
  );
}
