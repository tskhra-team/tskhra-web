import { SwapItemCard } from "@/Swapping/SwapItemCard";
import useGetOwnersAllItems from "@/Swapping/TradeOffer/useGetOwnersAllItem";
import { useTranslation } from "react-i18next";

export default function AlsoUserHas({ ownerId }: { ownerId: number }) {
  const { t } = useTranslation(["swapping"]);
  const { data: items } = useGetOwnersAllItems(ownerId);
  return (
    <div className="mt-10 max-w-7xl mx-auto">
      <h1
        className="text-xl md:text-3xl font-bold text-swap-text flex items-center gap-3 mb-8"
        style={{ fontFamily: "'Archivo Black', sans-serif" }}
      >
        {t("swapping:tradeOffer.alsoUserHas")}
      </h1>
      <div className="grid grid-cols-3 max-w-5xl mx-auto gap-5">
        {items?.content.map((item) => (
          <SwapItemCard item={item} />
        ))}
      </div>
    </div>
  );
}
