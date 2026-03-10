import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type SubCategoriesResponse = Record<string, string[]>;

const getSubEcommerceCategories = async () => {
  // TODO: Update endpoint when ecommerce API is ready
  const response = await publicInstance.get("/categories/ecommerce");

  return response.data;
};

const useGetSubEcommerceCategories = () => {
  return useQuery<SubCategoriesResponse, AxiosError<ErrorResponse>>({
    queryFn: getSubEcommerceCategories,
    queryKey: ["getSubEcommerceCategories"],
    staleTime: 100 * 60 * 1000,
    enabled: false, // Disabled until API endpoint is ready
  });
};

export default useGetSubEcommerceCategories;
