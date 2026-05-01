import { publicInstancePython } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export interface ProductBrand {
  id: number;
  name: string;
  logo_url: string;
}

export interface EcommerceProduct {
  id: number;
  brand: ProductBrand;
  price: number;
  title: string;
  description: string;
  cover_image_url: string;
  stock_quantity: number;
  sku: string;
  images: string[];
}

export interface ProductsResponse {
  items: EcommerceProduct[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ProductFilters {
  category_id?: number | null;
  supplier_id?: number | null;
  page?: number;
  limit?: number;
  min_price?: number | null;
  max_price?: number | null;
  sort_by?: string;
  in_stock?: boolean;
  option_ids?: number[];
  brand_ids?: number[];
}

const getEcommerceProducts = async (filters: ProductFilters) => {
  const params: Record<string, unknown> = {};

  if (filters.category_id != null) params.category_id = filters.category_id;
  if (filters.supplier_id != null) params.supplier_id = filters.supplier_id;
  if (filters.page != null) params.page = filters.page;
  if (filters.limit != null) params.limit = filters.limit;
  if (filters.min_price != null) params.min_price = filters.min_price;
  if (filters.max_price != null) params.max_price = filters.max_price;
  if (filters.sort_by) params.sort_by = filters.sort_by;
  if (filters.in_stock != null) params.in_stock = filters.in_stock;
  if (filters.option_ids && filters.option_ids.length > 0)
    params.option_ids = filters.option_ids;
  if (filters.brand_ids && filters.brand_ids.length > 0)
    params.brand_ids = filters.brand_ids;

  const response = await publicInstancePython.get<ProductsResponse>("/", {
    params,
  });

  return response.data;
};

const useGetEcommerceProducts = (
  filters: ProductFilters,
  enabled = true
) => {
  return useQuery<ProductsResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getEcommerceProducts(filters),
    queryKey: ["getEcommerceProducts", filters],
    staleTime: 100 * 60 * 1000,
    enabled,
  });
};

export default useGetEcommerceProducts;
