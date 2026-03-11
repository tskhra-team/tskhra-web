import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type SubCategoriesResponse = Record<string, string[]>;

const getSubSwappingCategories = async () => {
  // TODO: Update endpoint when swapping API is ready
  const response = await publicInstance.get("/categories/swapping");

  return response.data;
};

const useGetSubSwappingCategories = () => {
  return useQuery<SubCategoriesResponse, AxiosError<ErrorResponse>>({
    queryFn: getSubSwappingCategories,
    queryKey: ["getSubSwappingCategories"],
    staleTime: 100 * 60 * 1000,
    enabled: false, // Disabled until API endpoint is ready
  });
};

export default useGetSubSwappingCategories;
