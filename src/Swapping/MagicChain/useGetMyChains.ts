import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ChainTradeStatus, PaginatedChainTradesResponse } from "./types";

const getMyChains = async (
  status: ChainTradeStatus | null,
  page: number,
  size: number,
) => {
  const response = await privateInstance.get("/chain-trades/me", {
    params: { status, page, size },
  });
  return response.data;
};

const useGetMyChains = (
  status: ChainTradeStatus | null,
  page: number,
  size: number,
) => {
  return useQuery<PaginatedChainTradesResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getMyChains(status, page, size),
    queryKey: ["getMyChains", status, page, size],
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetMyChains;
