export interface TradeOfferItem {
  id: string;
  name: string;
  images?: string[];
  image?: string;
  estimatedValue?: number | null;
  category?: string;
  condition?: string;
}

export interface TradeOffer {
  offerId: string;
  offererId: number;
  responderId: number;
  offererItems: TradeOfferItem[];
  responderItems: TradeOfferItem[];
  fairnessRatio: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  createdAt: string;
  expiresAt: string;
}

export interface PaginatedTradeOffersResponse {
  content: TradeOffer[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  empty: boolean;
  first: boolean;
  last: boolean;
}

export type TradeOfferDirection = "RECEIVED" | "SENT";
export type TradeOfferStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
