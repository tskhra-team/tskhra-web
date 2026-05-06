import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ChainTrade } from "./types";

const getChainTrade = async (chainId: string) => {
  const response = await privateInstance.get(`/chain-trades/${chainId}`);
  return response.data;
};

const useGetChainTrade = (chainId: string | null) => {
  return useQuery<ChainTrade, AxiosError<ErrorResponse>>({
    queryFn: () => getChainTrade(chainId!),
    queryKey: ["getChainTrade", chainId],
    enabled: !!chainId,
  });
};

export default useGetChainTrade;
