import { useAuth } from "@/context/useAuth";
import { useCallback, useMemo } from "react";
import type { Product } from "../ProductCatalog";
import type { ServerCartItem } from "../types/cart";
import {
  useAddToCart,
  useCheckout,
  useClearCart,
  useGetCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "./useCartQuery";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number;
  stockQuantity: number;
}

function serverItemToCartItem(item: ServerCartItem): CartItem {
  return {
    id: item.id,
    product: {
      id: item.product_id,
      name: item.product_title,
      price: item.unit_price,
      image: item.product_image_url,
      store: "Alta",
      condition: "New",
      category: "",
      subcategory: "",
    },
    quantity: item.quantity,
    subtotal: item.subtotal,
    stockQuantity: item.stock_quantity,
  };
}

export default function useEcommerceCart() {
  const { isAuthenticated, login } = useAuth();

  const { data: cart, isLoading } = useGetCart();
  const addMutation = useAddToCart();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();
  const checkoutMutation = useCheckout();

  const items: CartItem[] = useMemo(
    () => (cart?.items ?? []).map(serverItemToCartItem),
    [cart?.items],
  );

  const totalItems = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const totalPrice = cart?.total ?? 0;

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (!isAuthenticated) {
        login();
        return;
      }
      addMutation.mutate({ product_id: product.id, quantity });
    },
    [isAuthenticated, login, addMutation],
  );

  const removeFromCart = useCallback(
    (productId: number) => {
      if (!isAuthenticated) {
        login();
        return;
      }
      const item = cart?.items.find((i) => i.product_id === productId);
      if (item) removeMutation.mutate(item.id);
    },
    [isAuthenticated, login, cart?.items, removeMutation],
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (!isAuthenticated) {
        login();
        return;
      }
      const item = cart?.items.find((i) => i.product_id === productId);
      if (!item) return;
      if (quantity <= 0) {
        removeMutation.mutate(item.id);
      } else {
        updateMutation.mutate({ itemId: item.id, quantity });
      }
    },
    [isAuthenticated, login, cart?.items, removeMutation, updateMutation],
  );

  const clearCart = useCallback(() => {
    if (!isAuthenticated) {
      login();
      return;
    }
    clearMutation.mutate();
  }, [isAuthenticated, login, clearMutation]);

  const checkout = useCallback(() => {
    if (!isAuthenticated) {
      login();
      return;
    }
    checkoutMutation.mutate();
  }, [isAuthenticated, login, checkoutMutation]);

  const isInCart = useCallback(
    (productId: number) =>
      cart?.items?.some((i) => i.product_id === productId) ?? false,
    [cart?.items],
  );

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    isInCart,
    isLoading,
    isCheckingOut: checkoutMutation.isPending,
    isMutating:
      addMutation.isPending ||
      updateMutation.isPending ||
      removeMutation.isPending ||
      clearMutation.isPending,
  };
}
