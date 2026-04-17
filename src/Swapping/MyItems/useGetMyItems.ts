import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export interface Item {
  id: string;
  ownerId: number;
  name: string;
  description: string;
  category: string;
  city: string;
  condition: string;
  tradeRange: string;
  estimatedValue: number | null;
  createdAt: string;
  images: string[];
  desiredCategories: string[];
  vip: boolean;
}

export interface PaginatedItemsResponse {
  content: Item[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  empty: boolean;
  first: boolean;
  last: boolean;
}

const getMyItems = async (page: number, size: number) => {
  const response = await privateInstance.get("/items/me", {
    params: { page, size },
  });

  return response.data;
};

const useGetMyItems = (page: number, size: number) => {
  return useQuery<PaginatedItemsResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getMyItems(page, size),
    queryKey: ["getMyItems", page, size],
    placeholderData: keepPreviousData,
  });
};

export default useGetMyItems;
