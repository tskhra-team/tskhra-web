import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const tradeOfferAction = async (offerId: string, action: string) => {
  const response = await privateInstance.put(
    `/trade-offers/${offerId}/${action}`,
  );
  return response.data;
};

export function useAcceptOffer() {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorResponse>, string>({
    mutationFn: (offerId) => tradeOfferAction(offerId, "accept"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTradeOffers"] });
    },
  });
}

export function useRejectOffer() {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorResponse>, string>({
    mutationFn: (offerId) => tradeOfferAction(offerId, "reject"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTradeOffers"] });
    },
  });
}

export function useWithdrawOffer() {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorResponse>, string>({
    mutationFn: (offerId) => tradeOfferAction(offerId, "withdraw"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTradeOffers"] });
    },
  });
}
