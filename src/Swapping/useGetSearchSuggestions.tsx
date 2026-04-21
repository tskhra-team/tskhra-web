import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getSearchSuggestions = async (query: string, limit: number) => {
  const response = await publicInstance.get("/items/search/suggest", {
    params: {
      query,
      limit,
    },
  });
  return response.data;
};

const useGetSearchSuggestions = (
  query: string,
  limit: number,
  enabled?: boolean,
) => {
  return useQuery<Array<string>, AxiosError<ErrorResponse>>({
    queryFn: () => getSearchSuggestions(query, limit),
    queryKey: ["getSearchSuggestions", query, limit],
    enabled: enabled,
  });
};

export default useGetSearchSuggestions;
