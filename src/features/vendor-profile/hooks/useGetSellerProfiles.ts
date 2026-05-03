import { useQuery } from "@tanstack/react-query";
import { sellerApi } from "../api/sellerApi";

export default function useGetSellerProfiles(enabled = true) {
  return useQuery({
    queryFn: sellerApi.getProfiles,
    queryKey: ["getSellerProfiles"],
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
