import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { DiscoverChainsRequest, DiscoverChainsResponse } from "./types";

const discoverChains = async (data: DiscoverChainsRequest) => {
  const response = await privateInstance.post("/chain-trades/discover", data);
  return response.data;
};

const useDiscoverChains = (requestData: DiscoverChainsRequest) => {
  return useQuery<DiscoverChainsResponse, AxiosError<ErrorResponse>>({
    queryKey: ["discoverChains", requestData.itemId],
    queryFn: () => discoverChains(requestData),
    enabled: !!requestData.itemId,
    retry: false,
  });
};

export default useDiscoverChains;
