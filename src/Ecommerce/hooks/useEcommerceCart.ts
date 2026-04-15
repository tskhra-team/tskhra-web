import { useCallback, useSyncExternalStore } from "react";
import type { Product } from "../ProductCatalog";

// ── Types ──────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

// ── External store (same pattern as useEcommerceFavorites) ─────────────

const STORAGE_KEY = "ecommerce_cart";

function getSnapshot(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

let cachedSnapshot = getSnapshot();
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function emitChange() {
  cachedSnapshot = getSnapshot();
  listeners.forEach((l) => l());
}

function persist(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emitChange();
}

function addToCart(product: Product, quantity = 1) {
  const current = getSnapshot();
  const existing = current.find((item) => item.product.id === product.id);
  if (existing) {
    persist(
      current.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      ),
    );
  } else {
    persist([...current, { product, quantity }]);
  }
}

function removeFromCart(productId: number) {
  const current = getSnapshot();
  persist(current.filter((item) => item.product.id !== productId));
}

function updateQuantity(productId: number, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const current = getSnapshot();
  persist(
    current.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    ),
  );
}

function clearCart() {
  persist([]);
}

// ── Hook ───────────────────────────────────────────────────────────────

export default function useEcommerceCart() {
  const items = useSyncExternalStore(subscribe, () => cachedSnapshot, () => []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart: useCallback(
      (productId: number) => items.some((item) => item.product.id === productId),
      [items],
    ),
  };
}
