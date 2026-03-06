import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type SubCategoriesResponse = Record<string, string[]>;

const getSubBookingCategories = async () => {
  const response = await publicInstance.get("/categories");

  return response.data;
};

const useGetSubBookingCategories = () => {
  return useQuery<SubCategoriesResponse, AxiosError<ErrorResponse>>({
    queryFn: getSubBookingCategories,
    queryKey: ["getSubBookingCategories"],
    staleTime: 100 * 60 * 1000,
  });
};

export default useGetSubBookingCategories;
