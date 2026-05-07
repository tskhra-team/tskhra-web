import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { OffersColumn } from "./OffersColumn";
import type { TradeOfferStatus } from "./types";
import useGetTradeOffers from "./useGetTradeOffers";

const PAGE_SIZE = 6;

const STATUS_FILTERS: (TradeOfferStatus | undefined)[] = [
  undefined,
  "PENDING",
  "ACCEPTED",
  "COMPLETED",
  "REJECTED",
  "CANCELED",
  "COUNTERED",
  "EXPIRED",
  "WITHDRAWN",
];

function getStatusLabel(
  status: TradeOfferStatus | undefined,
  t: (key: string) => string,
) {
  if (!status) return t("swapping:offers.statusAll");
  return t(
    `swapping:offers.status${status.charAt(0)}${status.slice(1).toLowerCase()}`,
  );
}

export default function Offers() {
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();

  const [activeStatus, setActiveStatus] = useState<
    TradeOfferStatus | undefined
  >("PENDING");
  const [incomingPage, setIncomingPage] = useState(0);
  const [outgoingPage, setOutgoingPage] = useState(0);

  const handleStatusChange = (status: TradeOfferStatus | undefined) => {
    setActiveStatus(status);
    setIncomingPage(0);
    setOutgoingPage(0);
  };

  const { data: incoming, isLoading: incomingLoading } = useGetTradeOffers(
    "RECEIVED",
    activeStatus,
    incomingPage,
    PAGE_SIZE,
  );

  const { data: outgoing, isLoading: outgoingLoading } = useGetTradeOffers(
    "SENT",
    activeStatus,
    outgoingPage,
    PAGE_SIZE,
  );

  return (
    <div className="bg-swap-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="link"
          className="mb-10"
          onClick={() => navigate("/swapping/catalog")}
        >
          <ArrowLeft />
          {t("swapping:postItem.back")}
        </Button>

        <h1 className="text-3xl font-bold text-swap-text mb-6">
          {t("swapping:offers.title")}
        </h1>

        <Tabs
          value={activeStatus ?? "ALL"}
          onValueChange={(v) =>
            handleStatusChange(
              v === "ALL" ? undefined : (v as TradeOfferStatus),
            )
          }
          className="mb-8"
        >
          <TabsList
            variant="line"
            className="flex w-full! justify-start bg-white/40 backdrop-blur-md border border-swap-primary/20 rounded-xl p-1.5 gap-0 h-auto overflow-x-auto scrollbar-hide"
          >
            {STATUS_FILTERS.map((status) => {
              const value = status ?? "ALL";
              const isActive = (activeStatus ?? "ALL") === value;
              return (
                <TabsTrigger key={value} value={value} asChild>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className={`relative cursor-pointer rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold tracking-wide uppercase transition-colors duration-200 shrink-0 border-none bg-transparent shadow-none after:hidden data-[state=active]:text-white data-[state=active]:bg-transparent ${
                      isActive
                        ? "text-white"
                        : "text-swap-text2/70 hover:text-swap-text"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="offersTabIndicator"
                        className="absolute inset-0 rounded-lg bg-swap-primary shadow-md shadow-swap-primary/20 "
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.5,
                        }}
                      />
                    )}
                    <span className="relative z-10">
                      {getStatusLabel(status, t)}
                    </span>
                  </motion.button>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <OffersColumn
              title={t("swapping:offers.incoming")}
              direction="RECEIVED"
              offers={incoming?.content}
              isLoading={incomingLoading}
              isEmpty={incoming?.empty ?? true}
              page={incomingPage}
              totalPages={incoming?.totalPages ?? 0}
              totalElements={incoming?.totalElements ?? 0}
              onPageChange={setIncomingPage}
              skeletonCount={3}
            />
          </div>

          <div className="hidden md:block w-px bg-swap-primary/30 self-stretch" />
          <hr className="md:hidden border-swap-primary/30" />

          <div className="flex-1 min-w-0">
            <OffersColumn
              title={t("swapping:offers.outgoing")}
              direction="SENT"
              offers={outgoing?.content}
              isLoading={outgoingLoading}
              isEmpty={outgoing?.empty ?? true}
              page={outgoingPage}
              totalPages={outgoing?.totalPages ?? 0}
              totalElements={outgoing?.totalElements ?? 0}
              onPageChange={setOutgoingPage}
              skeletonCount={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
