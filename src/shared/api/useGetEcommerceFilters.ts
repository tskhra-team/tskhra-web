import { publicInstancePython } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export interface FilterOption {
  option_id: number;
  option_value: string;
  product_count: number;
}

export interface FilterField {
  field_id: number;
  field_name: string;
  is_required: boolean;
  options: FilterOption[];
}

export interface FilterGroup {
  group_id: number;
  group_name: string;
  fields: FilterField[];
}

export interface FilterBrand {
  brand_id: number;
  brand_name: string;
  logo_url?: string;
  product_count?: number;
}

export interface FiltersResponse {
  filters: FilterGroup[];
  brands: FilterBrand[];
}

export interface FilterParams {
  category_id?: number | null;
  min_price?: number | null;
  max_price?: number | null;
  in_stock?: boolean;
}

const getEcommerceFilters = async (params: FilterParams) => {
  const queryParams: Record<string, unknown> = {};

  if (params.category_id != null) queryParams.category_id = params.category_id;
  if (params.min_price != null) queryParams.min_price = params.min_price;
  if (params.max_price != null) queryParams.max_price = params.max_price;
  if (params.in_stock != null) queryParams.in_stock = params.in_stock;

  const response = await publicInstancePython.get<FiltersResponse>("/ecommerce/products/filters", {
    params: queryParams,
  });

  return response.data;
};

const useGetEcommerceFilters = (params: FilterParams, enabled = true) => {
  return useQuery<FiltersResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getEcommerceFilters(params),
    queryKey: ["getEcommerceFilters", params],
    staleTime: 100 * 60 * 1000,
    enabled,
  });
};

export default useGetEcommerceFilters;
