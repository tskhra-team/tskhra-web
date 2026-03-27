import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type SubCategory = {
  id: number;
  name: string;
  iconUrl: string | null;
  subcategories: SubCategory[];
};

export type Category = {
  id: number;
  name: string;
  iconUrl: string | null;
  subcategories: SubCategory[];
};

const getSubBookingCategories = async (lang: string): Promise<Category[]> => {
  const response = await publicInstance.get("/categories", {
    params: { lang },
  });

  return response.data;
};

const useGetSubBookingCategories = (lang: string) => {
  return useQuery<Category[], AxiosError<ErrorResponse>>({
    queryFn: () => getSubBookingCategories(lang),
    queryKey: ["getSubBookingCategories", lang],
    staleTime: 100 * 60 * 1000,
  });
};

export default useGetSubBookingCategories;
