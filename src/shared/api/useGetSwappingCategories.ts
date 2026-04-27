import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type SubCategory = {
  id: number;
  name: string;
  iconUrl: string | null;
  children: SubCategory[];
};

export type Category = {
  id: number;
  name: string;
  iconUrl: string | null;
  children: SubCategory[];
};

const getSwappingCategories = async (): Promise<Category[]> => {
  const response = await publicInstance.get("/trade-categories/tree");

  return response.data;
};

const useGetSwappingCategories = () => {
  return useQuery<Category[], AxiosError<ErrorResponse>>({
    queryFn: () => getSwappingCategories(),
    queryKey: ["getSwappingCategories"],
    staleTime: 100 * 60 * 1000,
  });
};

export default useGetSwappingCategories;
