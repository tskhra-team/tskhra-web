import { useQuery } from "@tanstack/react-query";
import { vendorProductApi } from "../api/vendorProductApi";
import type { VendorProductsResponse } from "../types";

export default function useGetMyProducts(
  supplierId: number | undefined,
  page = 1,
  limit = 20,
) {
  return useQuery<VendorProductsResponse>({
    queryFn: () => vendorProductApi.getMyProducts(supplierId!, page, limit),
    queryKey: ["getMyProducts", supplierId, page, limit],
    enabled: !!supplierId,
  });
}
