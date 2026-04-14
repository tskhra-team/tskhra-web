import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "ecommerce_favorites";

function getSnapshot(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
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

function addFavorite(productId: number) {
  const current = getSnapshot();
  if (!current.includes(productId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, productId]));
    emitChange();
  }
}

function removeFavorite(productId: number) {
  const current = getSnapshot();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(current.filter((id) => id !== productId)),
  );
  emitChange();
}

function toggleFavorite(productId: number) {
  const current = getSnapshot();
  if (current.includes(productId)) {
    removeFavorite(productId);
  } else {
    addFavorite(productId);
  }
}

export default function useEcommerceFavorites() {
  const favoriteIds = useSyncExternalStore(
    subscribe,
    () => cachedSnapshot,
    () => [],
  );

  return {
    favoriteIds,
    isFavorite: useCallback(
      (id: number) => favoriteIds.includes(id),
      [favoriteIds],
    ),
    toggleFavorite,
    addFavorite,
    removeFavorite,
  };
}
