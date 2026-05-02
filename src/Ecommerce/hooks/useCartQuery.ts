import { useAuth } from "@/context/useAuth";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { cartApi } from "../api/cartApi";
import type {
  AddItemRequest,
  CartApiError,
  CheckoutResponse,
  ServerCart,
  ServerCartItem,
} from "../types/cart";

export const CART_QUERY_KEY = ["ecommerce", "cart"] as const;

function useCartErrorHandler() {
  const { t } = useTranslation("ecommerce");

  return (error: AxiosError<CartApiError>) => {
    const code = error.response?.data?.error_code;
    switch (code) {
      case "VALIDATION_ERROR":
        toast.error(t("cart.errors.outOfStock"));
        break;
      case "CONFLICT":
        toast.error(t("cart.errors.conflict"));
        break;
      case "NOT_FOUND":
        toast.error(t("cart.errors.notFound"));
        break;
      case "EXTERNAL_SERVICE_ERROR":
        toast.error(t("cart.errors.serviceError"));
        break;
      default:
        toast.error(t("cart.errors.generic"));
    }
  };
}

export function useGetCart() {
  const { isAuthenticated } = useAuth();

  return useQuery<ServerCart, AxiosError<CartApiError>>({
    queryKey: [...CART_QUERY_KEY],
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const onError = useCartErrorHandler();

  return useMutation<ServerCartItem, AxiosError<CartApiError>, AddItemRequest>({
    mutationFn: (data) => cartApi.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY] });
    },
    onError,
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const onError = useCartErrorHandler();

  return useMutation<
    ServerCartItem,
    AxiosError<CartApiError>,
    { itemId: string; quantity: number },
    { previous: ServerCart | undefined }
  >({
    mutationFn: ({ itemId, quantity }) =>
      cartApi.updateItem(itemId, { quantity }),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: [...CART_QUERY_KEY] });
      const previous = queryClient.getQueryData<ServerCart>([...CART_QUERY_KEY]);

      if (previous) {
        queryClient.setQueryData<ServerCart>([...CART_QUERY_KEY], {
          ...previous,
          items: previous.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity, subtotal: item.unit_price * quantity }
              : item,
          ),
          total: previous.items.reduce(
            (sum, item) =>
              sum +
              (item.id === itemId
                ? item.unit_price * quantity
                : item.subtotal),
            0,
          ),
        });
      }

      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([...CART_QUERY_KEY], context.previous);
      }
      onError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const onError = useCartErrorHandler();

  return useMutation<
    { message: string },
    AxiosError<CartApiError>,
    string,
    { previous: ServerCart | undefined }
  >({
    mutationFn: (itemId) => cartApi.removeItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: [...CART_QUERY_KEY] });
      const previous = queryClient.getQueryData<ServerCart>([...CART_QUERY_KEY]);

      if (previous) {
        const filtered = previous.items.filter((item) => item.id !== itemId);
        queryClient.setQueryData<ServerCart>([...CART_QUERY_KEY], {
          ...previous,
          items: filtered,
          total: filtered.reduce((sum, item) => sum + item.subtotal, 0),
        });
      }

      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([...CART_QUERY_KEY], context.previous);
      }
      onError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const onError = useCartErrorHandler();

  return useMutation<{ message: string }, AxiosError<CartApiError>>({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY] });
    },
    onError,
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  const onError = useCartErrorHandler();
  const { t } = useTranslation("ecommerce");

  return useMutation<CheckoutResponse, AxiosError<CartApiError>>({
    mutationFn: cartApi.checkout,
    onSuccess: () => {
      toast.success(t("cart.checkoutSuccess"));
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY] });
    },
    onError,
  });
}
