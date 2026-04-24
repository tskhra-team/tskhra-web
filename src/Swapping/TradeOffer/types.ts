import type { Item } from "@/Swapping/MyItems/useGetMyItems";

export interface TradeItem {
  id: string;
  ownerId?: number;
  name: string;
  description: string;
  image: string;
  images: string[];
  estimatedValue: number | null;
  condition: string;
  category: string;
  tradeRange: "CITY_WIDE" | "COUNTRY_WIDE";
  city: string;
  createdAt: string;
  vipStatus: boolean;
}

export const CONDITION_KEYS: Record<string, string> = {
  NEW: "tradeOffer.conditionNew",
  LIKE_NEW: "tradeOffer.conditionLikeNew",
  USED: "tradeOffer.conditionUsed",
  DAMAGED: "tradeOffer.conditionDamaged",
};

export function mapItemToTradeItem(item: Item): TradeItem {
  return {
    id: item.id,
    ownerId: item.ownerId,
    name: item.name,
    description: item.description,
    image: item.images?.[0] ?? "",
    images: item.images ?? [],
    estimatedValue: item.estimatedValue,
    condition: item.condition,
    category: item.category,
    tradeRange: item.tradeRange as "CITY_WIDE" | "COUNTRY_WIDE",
    city: item.city,
    createdAt: item.createdAt,
    vipStatus: item.vip,
  };
}

export const MOCK_TARGET_ITEM: TradeItem = {
  id: "target-1",
  name: "iPhone 15 Pro Max",
  description:
    "256GB, Space Black, excellent condition with original box and all accessories included.",
  image: "",
  images: [],
  estimatedValue: 3500,
  condition: "LIKE_NEW",
  category: "Electronics",
  tradeRange: "CITY_WIDE",
  city: "Tbilisi",
  createdAt: new Date().toISOString(),
  vipStatus: false,
};
