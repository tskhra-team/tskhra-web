import { privateInstancePython } from "@/api";
import type {
  AddItemRequest,
  CheckoutResponse,
  ServerCart,
  ServerCartItem,
  UpdateItemRequest,
} from "../types/cart";

export const cartApi = {
  getCart: () =>
    privateInstancePython.get<ServerCart>("/").then((r) => r.data),

  addItem: (data: AddItemRequest) =>
    privateInstancePython.post<ServerCartItem>("/items", data).then((r) => r.data),

  clearCart: () =>
    privateInstancePython.delete<{ message: string }>("/items").then((r) => r.data),

  updateItem: (itemId: string, data: UpdateItemRequest) =>
    privateInstancePython.put<ServerCartItem>(`/items/${itemId}`, data).then((r) => r.data),

  removeItem: (itemId: string) =>
    privateInstancePython.delete<{ message: string }>(`/items/${itemId}`).then((r) => r.data),

  checkout: () =>
    privateInstancePython.post<CheckoutResponse>("/checkout").then((r) => r.data),
};
