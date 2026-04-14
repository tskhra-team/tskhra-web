import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const deleteItem = async (itemId: string) => {
  const response = await privateInstance.delete(`/items/items/${itemId}`);
  return response.data;
};

const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, string>({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMyItems"] });
    },
  });
};

export default useDeleteItem;
