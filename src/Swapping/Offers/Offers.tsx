import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { OffersColumn } from "./OffersColumn";
import useGetTradeOffers from "./useGetTradeOffers";

const PAGE_SIZE = 12;

export default function Offers() {
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();

  const [incomingPage, setIncomingPage] = useState(0);
  const [outgoingPage, setOutgoingPage] = useState(0);

  const {
    data: incoming,
    isLoading: incomingLoading,
  } = useGetTradeOffers("RECEIVED", "PENDING", incomingPage, PAGE_SIZE);

  const {
    data: outgoing,
    isLoading: outgoingLoading,
  } = useGetTradeOffers("SENT", "PENDING", outgoingPage, PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <Button
        variant="link"
        className="mb-2"
        onClick={() => navigate("/swapping/catalog")}
      >
        <ArrowLeft />
        {t("swapping:postItem.back")}
      </Button>

      <h1 className="text-3xl font-bold text-swap-text">
        {t("swapping:offers.title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <OffersColumn
          title={t("swapping:offers.incoming")}
          offers={incoming?.content}
          isLoading={incomingLoading}
          isEmpty={incoming?.empty ?? true}
          page={incomingPage}
          totalPages={incoming?.totalPages ?? 0}
          onPageChange={setIncomingPage}
          skeletonCount={3}
        />

        <OffersColumn
          title={t("swapping:offers.outgoing")}
          offers={outgoing?.content}
          isLoading={outgoingLoading}
          isEmpty={outgoing?.empty ?? true}
          page={outgoingPage}
          totalPages={outgoing?.totalPages ?? 0}
          onPageChange={setOutgoingPage}
          skeletonCount={3}
        />
      </div>
    </div>
  );
}
