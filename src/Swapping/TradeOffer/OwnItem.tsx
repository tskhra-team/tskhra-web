import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function OwnItem() {
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();

  return (
    <div className="h-150 bg-swap-bg flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-swap-secondary flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-swap-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-swap-text">
            {t("swapping:tradeOffer.ownItemTitle")}
          </h1>
          <p className="text-swap-text2">
            {t("swapping:tradeOffer.ownItemDescription")}
          </p>
        </div>

        <Button
          onClick={() => navigate("/swapping/catalog")}
          className="bg-swap-primary hover:bg-swap-primary/90 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("swapping:tradeOffer.backToCatalog")}
        </Button>
      </div>
    </div>
  );
}
