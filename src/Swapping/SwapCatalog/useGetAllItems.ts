import { privateInstance } from "@/api";
import type { PaginatedItemsResponse } from "@/Swapping/MyItems/useGetMyItems";
import type { ErrorResponse } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getAllItems = async (page: number, size: number) => {
  const response = await privateInstance.get("/items", {
    params: { page, size },
  });

  return response.data;
};

const useGetAllItems = (page: number, size: number, enabled?: boolean) => {
  return useQuery<PaginatedItemsResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getAllItems(page, size),
    queryKey: ["getAllItems", page, size],
    placeholderData: keepPreviousData,
    enabled: enabled,
  });
};

export default useGetAllItems;
