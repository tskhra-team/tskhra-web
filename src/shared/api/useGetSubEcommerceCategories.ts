import { publicInstancePython } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { EcommerceCategory } from "./useGetMainEcommerceCategories";

interface CategoriesResponse {
  categories: EcommerceCategory[];
}

const getSubEcommerceCategories = async (parentId: number) => {
  const response = await publicInstancePython.get<CategoriesResponse>(
    "/ecommerce/products/categories",
    {
      params: { parent_id: parentId },
    }
  );

  return response.data.categories;
};

const useGetSubEcommerceCategories = (parentId: number | null) => {
  return useQuery<EcommerceCategory[], AxiosError<ErrorResponse>>({
    queryFn: () => getSubEcommerceCategories(parentId!),
    queryKey: ["getSubEcommerceCategories", parentId],
    staleTime: 100 * 60 * 1000,
    enabled: parentId != null,
  });
};

export default useGetSubEcommerceCategories;
