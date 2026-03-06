import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getMainBookingCategories = async () => {
  const response = await publicInstance.get("/categories/main");

  return response.data;
};

const useGetMainBookingCategories = () => {
  return useQuery<Array<string>, AxiosError<ErrorResponse>>({
    queryFn: getMainBookingCategories,
    queryKey: ["getMainBookingCategories"],
    staleTime: 100 * 60 * 1000,
  });
};

export default useGetMainBookingCategories;
