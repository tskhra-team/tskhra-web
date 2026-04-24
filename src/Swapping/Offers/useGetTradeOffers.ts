import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  PaginatedTradeOffersResponse,
  TradeOfferDirection,
  TradeOfferStatus,
} from "./types";

const getTradeOffers = async (
  direction: TradeOfferDirection,
  status: TradeOfferStatus | undefined,
  page: number,
  size: number,
) => {
  const response = await privateInstance.get<PaginatedTradeOffersResponse>(
    "/trade-offers/me",
    {
      params: { direction, ...(status && { status }), page, size },
    },
  );
  return response.data;
};

const useGetTradeOffers = (
  direction: TradeOfferDirection,
  status: TradeOfferStatus | undefined,
  page: number,
  size: number,
) => {
  return useQuery<PaginatedTradeOffersResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getTradeOffers(direction, status, page, size),
    queryKey: ["getTradeOffers", direction, status ?? "ALL", page, size],
    placeholderData: keepPreviousData,
  });
};

export default useGetTradeOffers;
