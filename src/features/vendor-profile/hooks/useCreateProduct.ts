import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorProductApi } from "../api/vendorProductApi";
import type { CreateProductRequest } from "../types";

type CreateProductParams = {
  supplierId: number;
  data: CreateProductRequest;
  images: File[];
};

export default function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ supplierId, data, images }: CreateProductParams) => {
      const createResult = await vendorProductApi.createProduct(
        supplierId,
        data,
      );
      const taskId = createResult.task_id;

      if (images.length > 0) {
        await vendorProductApi.uploadImages(supplierId, taskId, images);
      }

      await vendorProductApi.submitProduct(supplierId, taskId);
      return createResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMyProducts"] });
    },
  });
}
