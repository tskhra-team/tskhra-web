import { useMutation } from "@tanstack/react-query";
import { sellerApi } from "../api/sellerApi";
import type { VerifyIdentificationRequest } from "../types";

export default function useVerifyIdentification() {
  return useMutation({
    mutationFn: (data: VerifyIdentificationRequest) =>
      sellerApi.verifyIdentification(data),
  });
}
