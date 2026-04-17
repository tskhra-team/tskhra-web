import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Offers() {
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Button
        variant="link"
        className="mb-2"
        onClick={() => navigate("/swapping/catalog")}
      >
        <ArrowLeft />
        {t("swapping:postItem.back")}
      </Button>
      <div>Offers</div>
    </div>
  );
}
