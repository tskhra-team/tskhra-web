import { privateInstanceSeller } from "@/api";
import type {
  CreateProductRequest,
  UpdateDraftRequest,
  UpdateProductRequest,
} from "../types";

export const vendorProductApi = {
  createProduct: (supplierId: number, data: CreateProductRequest) =>
    privateInstanceSeller
      .post(`/${supplierId}/products/`, data)
      .then((r) => r.data),

  getMyProducts: (supplierId: number, page = 1, limit = 20) =>
    privateInstanceSeller
      .get(`/${supplierId}/products/`, { params: { page, limit } })
      .then((r) => r.data),

  updateDraft: (
    supplierId: number,
    taskId: string,
    data: UpdateDraftRequest,
  ) =>
    privateInstanceSeller
      .patch(`/${supplierId}/products/${taskId}/draft`, data)
      .then((r) => r.data),

  deleteDraft: (supplierId: number, taskId: string) =>
    privateInstanceSeller
      .delete(`/${supplierId}/products/${taskId}/draft`)
      .then((r) => r.data),

  updateProduct: (
    supplierId: number,
    productId: number,
    data: UpdateProductRequest,
  ) =>
    privateInstanceSeller
      .put(`/${supplierId}/products/${productId}`, data)
      .then((r) => r.data),

  deleteProduct: (supplierId: number, productId: number) =>
    privateInstanceSeller
      .delete(`/${supplierId}/products/${productId}`)
      .then((r) => r.data),

  uploadImages: (supplierId: number, taskId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return privateInstanceSeller
      .post(`/${supplierId}/products/${taskId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  deleteImages: (supplierId: number, taskId: string, imageUrls: string[]) =>
    privateInstanceSeller
      .delete(`/${supplierId}/products/${taskId}/images`, {
        data: { image_urls: imageUrls },
      })
      .then((r) => r.data),

  submitProduct: (supplierId: number, taskId: string) =>
    privateInstanceSeller
      .post(`/${supplierId}/products/${taskId}/submit`)
      .then((r) => r.data),
};
