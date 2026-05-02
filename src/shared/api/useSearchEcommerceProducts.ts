import { publicInstancePython } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ProductsResponse } from "./useGetEcommerceProducts";

export interface SearchFilters {
  q: string;
  page?: number;
  limit?: number;
  in_stock?: boolean;
  category_id?: number | null;
  min_price?: number | null;
  max_price?: number | null;
  sort_by?: string;
  option_ids?: number[];
  brand_ids?: number[];
}

const searchEcommerceProducts = async (filters: SearchFilters) => {
  const params: Record<string, unknown> = {};

  params.q = filters.q;
  if (filters.page != null) params.page = filters.page;
  if (filters.limit != null) params.limit = filters.limit;
  if (filters.in_stock != null) params.in_stock = filters.in_stock;
  if (filters.category_id != null) params.category_id = filters.category_id;
  if (filters.min_price != null) params.min_price = filters.min_price;
  if (filters.max_price != null) params.max_price = filters.max_price;
  if (filters.sort_by) params.sort_by = filters.sort_by;
  if (filters.option_ids && filters.option_ids.length > 0)
    params.option_ids = filters.option_ids;
  if (filters.brand_ids && filters.brand_ids.length > 0)
    params.brand_ids = filters.brand_ids;

  const response = await publicInstancePython.get<ProductsResponse>("/search", {
    params,
  });

  return response.data;
};

const useSearchEcommerceProducts = (
  filters: SearchFilters,
  enabled = true
) => {
  return useQuery<ProductsResponse, AxiosError<ErrorResponse>>({
    queryFn: () => searchEcommerceProducts(filters),
    queryKey: ["searchEcommerceProducts", filters],
    staleTime: 100 * 60 * 1000,
    enabled: enabled && filters.q.length >= 2,
  });
};

export default useSearchEcommerceProducts;
