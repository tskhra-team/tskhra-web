import { privateInstance } from "@/api";
import type { PaginatedItemsResponse } from "@/Swapping/MyItems/useGetMyItems";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getOwnersAllItems = async (userId: number) => {
  const response = await privateInstance.get(`/items/user/${userId}`);
  return response.data;
};

const useGetOwnersAllItems = (userId: number | undefined) => {
  return useQuery<PaginatedItemsResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getOwnersAllItems(userId!),
    queryKey: ["getOwnersAllItems", userId],
    enabled: userId != null,
  });
};

export default useGetOwnersAllItems;
