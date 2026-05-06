import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ChainTrade, CreateChainTradeRequest } from "./types";

const createChainTrade = async (data: CreateChainTradeRequest) => {
  const response = await privateInstance.post("/chain-trades", data);
  return response.data;
};

const useCreateChainTrade = () => {
  return useMutation<
    ChainTrade,
    AxiosError<ErrorResponse>,
    CreateChainTradeRequest
  >({
    mutationFn: createChainTrade,
  });
};

export default useCreateChainTrade;
