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

  const { data: incoming, isLoading: incomingLoading } = useGetTradeOffers(
    "RECEIVED",
    "PENDING",
    incomingPage,
    PAGE_SIZE,
  );

  const { data: outgoing, isLoading: outgoingLoading } = useGetTradeOffers(
    "SENT",
    "PENDING",
    outgoingPage,
    PAGE_SIZE,
  );

  return (
    <div className="bg-swap-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
        <Button
          variant="link"
          className="mb-10"
          onClick={() => navigate("/swapping/catalog")}
        >
          <ArrowLeft />
          {t("swapping:postItem.back")}
        </Button>

        <h1 className="text-3xl font-bold text-swap-text mb-10">
          {t("swapping:offers.title")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <OffersColumn
            title={t("swapping:offers.incoming")}
            direction="RECEIVED"
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
            direction="SENT"
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
    </div>
  );
}
