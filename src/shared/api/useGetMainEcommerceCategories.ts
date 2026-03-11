import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getMainEcommerceCategories = async () => {
  // TODO: Update endpoint when ecommerce API is ready
  const response = await publicInstance.get("/categories/ecommerce/main");

  return response.data;
};

const useGetMainEcommerceCategories = () => {
  return useQuery<Array<string>, AxiosError<ErrorResponse>>({
    queryFn: getMainEcommerceCategories,
    queryKey: ["getMainEcommerceCategories"],
    staleTime: 100 * 60 * 1000,
    enabled: false, // Disabled until API endpoint is ready
  });
};

export default useGetMainEcommerceCategories;
