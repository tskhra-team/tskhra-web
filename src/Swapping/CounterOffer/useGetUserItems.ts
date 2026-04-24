import { privateInstance } from "@/api";
import type {
  Item,
  PaginatedItemsResponse,
} from "@/Swapping/MyItems/useGetMyItems";
import type { ErrorResponse } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getUserItems = async (userId: number, page: number, size: number) => {
  const response = await privateInstance.get<PaginatedItemsResponse>(
    `/items/user/${userId}`,
    { params: { page, size } },
  );
  return response.data;
};

const useGetUserItems = (
  userId: number | null,
  page: number,
  size: number,
) => {
  return useQuery<PaginatedItemsResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getUserItems(userId!, page, size),
    queryKey: ["getUserItems", userId, page, size],
    enabled: userId != null,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  });
};

export default useGetUserItems;
export type { Item };
