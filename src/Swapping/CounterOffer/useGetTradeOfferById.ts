import { privateInstance } from "@/api";
import type { TradeOffer } from "@/Swapping/Offers/types";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getTradeOfferById = async (offerId: string) => {
  const response = await privateInstance.get<TradeOffer>(
    `/trade-offers/${offerId}`,
  );
  return response.data;
};

const useGetTradeOfferById = (offerId: string | null) => {
  return useQuery<TradeOffer, AxiosError<ErrorResponse>>({
    queryFn: () => getTradeOfferById(offerId!),
    queryKey: ["getTradeOfferById", offerId],
    enabled: !!offerId,
  });
};

export default useGetTradeOfferById;
