import { privateInstance } from "@/api";
import type { Item } from "@/Swapping/MyItems/useGetMyItems";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getItemById = async (id: string) => {
  const response = await privateInstance.get(`/items/${id}`);
  return response.data as Item;
};

const useGetItemById = (id: string | null) => {
  return useQuery<Item, AxiosError<ErrorResponse>>({
    queryFn: () => getItemById(id!),
    queryKey: ["getItemById", id],
    enabled: !!id,
  });
};

export default useGetItemById;
