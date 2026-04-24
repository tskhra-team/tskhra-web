import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface CounterOfferRequest {
  responderId: number;
  offererItems: string[];
  responderItems: string[];
}

const createCounterOffer = async (
  offerId: string,
  data: CounterOfferRequest,
) => {
  const response = await privateInstance.post(
    `/trade-offers/${offerId}/counter`,
    data,
  );
  return response.data;
};

const useCreateCounterOffer = (offerId: string) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorResponse>, CounterOfferRequest>({
    mutationFn: (data) => createCounterOffer(offerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTradeOffers"] });
    },
  });
};

export default useCreateCounterOffer;
