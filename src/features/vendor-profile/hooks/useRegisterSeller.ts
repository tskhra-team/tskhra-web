import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sellerApi } from "../api/sellerApi";
import type { RegisterSellerRequest } from "../types";

export default function useRegisterSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterSellerRequest) =>
      sellerApi.registerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getSellerProfiles"] });
    },
  });
}
