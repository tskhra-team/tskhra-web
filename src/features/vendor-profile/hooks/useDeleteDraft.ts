import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorProductApi } from "../api/vendorProductApi";

export default function useDeleteDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      supplierId,
      taskId,
    }: {
      supplierId: number;
      taskId: string;
    }) => vendorProductApi.deleteDraft(supplierId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMyProducts"] });
    },
  });
}
