import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface CreateTradeOfferRequest {
  responderId?: number;
  offererItems: string[];
  responderItems: string[];
}

interface CreateTradeOfferResponse {
  offerId: string;
}

const createTradeOffer = async (data: CreateTradeOfferRequest) => {
  const response = await privateInstance.post("/trade-offers", data);
  return response.data;
};

const useCreateTradeOffer = () => {
  return useMutation<
    CreateTradeOfferResponse,
    AxiosError<ErrorResponse>,
    CreateTradeOfferRequest
  >({
    mutationFn: createTradeOffer,
  });
};

export default useCreateTradeOffer;
