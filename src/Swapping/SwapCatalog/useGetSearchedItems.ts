import { privateInstance } from "@/api";
import type { PaginatedItemsResponse } from "@/Swapping/MyItems/useGetMyItems";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface SearchedItemsRequest {
  query?: string;
  categoryId?: number;
  cityId?: number;
  condition?: "NEW" | "LIKE_NEW" | "USED" | "DAMAGED";
  tradeRange?: "CITY_WIDE" | "COUNTRY_WIDE";
  page?: number;
  size?: number;
}

const getSearchedItems = async ({
  query,
  categoryId,
  cityId,
  condition,
  tradeRange,
  page,
  size,
}: SearchedItemsRequest) => {
  const response = await privateInstance.get("/items/search", {
    params: {
      query,
      categoryId,
      cityId,
      condition,
      tradeRange,
      page,
      size,
    },
  });

  return response.data;
};

const useGetSearchedItems = ({
  query,
  categoryId,
  cityId,
  condition,
  tradeRange,
  page,
  size,
  enabled = true,
}: SearchedItemsRequest & { enabled?: boolean }) => {
  return useQuery<PaginatedItemsResponse, AxiosError<ErrorResponse>>({
    queryFn: () =>
      getSearchedItems({
        query,
        categoryId,
        cityId,
        condition,
        tradeRange,
        page,
        size,
      }),
    queryKey: [
      "getSearchedItems",
      query,
      categoryId,
      cityId,
      condition,
      tradeRange,
      page,
      size,
    ],

    enabled: enabled,

    staleTime: 60 * 1000,
  });
};

export default useGetSearchedItems;
