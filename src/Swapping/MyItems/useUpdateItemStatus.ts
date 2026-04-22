import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface UpdateItemStatusParams {
  itemId: string;
  action: "hide" | "unhide";
}

const updateItemStatus = async ({ itemId, action }: UpdateItemStatusParams) => {
  const response = await privateInstance.put(`/items/${itemId}/${action}`);
  return response.data;
};

const useUpdateItemStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, UpdateItemStatusParams>({
    mutationFn: updateItemStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMyItems"] });
    },
  });
};

export default useUpdateItemStatus;
