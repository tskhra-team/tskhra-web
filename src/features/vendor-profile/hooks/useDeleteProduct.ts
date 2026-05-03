import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorProductApi } from "../api/vendorProductApi";

export default function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      supplierId,
      productId,
    }: {
      supplierId: number;
      productId: number;
    }) => vendorProductApi.deleteProduct(supplierId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMyProducts"] });
    },
  });
}
