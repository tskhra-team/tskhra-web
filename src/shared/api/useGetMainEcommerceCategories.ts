import { publicInstancePython } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export interface EcommerceCategory {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  image_url: string;
  has_subcategories: boolean;
  product_count: number;
  brands: string[];
}

interface CategoriesResponse {
  categories: EcommerceCategory[];
}

const getEcommerceCategories = async (parentId?: number | null) => {
  const response = await publicInstancePython.get<CategoriesResponse>(
    "/ecommerce/products/categories",
    {
      params: parentId != null ? { parent_id: parentId } : undefined,
    }
  );

  return response.data.categories;
};

const useGetMainEcommerceCategories = () => {
  return useQuery<EcommerceCategory[], AxiosError<ErrorResponse>>({
    queryFn: () => getEcommerceCategories(),
    queryKey: ["getEcommerceCategories"],
    staleTime: 100 * 60 * 1000,
  });
};

export default useGetMainEcommerceCategories;
