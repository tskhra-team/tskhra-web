import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getMainSwappingCategories = async () => {
  // TODO: Update endpoint when swapping API is ready
  const response = await publicInstance.get("/categories/swapping/main");

  return response.data;
};

const useGetMainSwappingCategories = () => {
  return useQuery<Array<string>, AxiosError<ErrorResponse>>({
    queryFn: getMainSwappingCategories,
    queryKey: ["getMainSwappingCategories"],
    staleTime: 100 * 60 * 1000,
    enabled: false, // Disabled until API endpoint is ready
  });
};

export default useGetMainSwappingCategories;
