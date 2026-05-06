export interface ChainLink {
  position: number;
  itemId: string;
  itemName: string;
  ownerId: number;
  imageUrl: string;
  categoryName: string;
  estimatedValue: number;
}

export interface Chain {
  links: ChainLink[];
  length: number;
}

export type DiscoverChainsResponse = Chain[];

export interface DiscoverChainsRequest {
  itemId: string;
}

export interface CreateChainTradeRequest {
  itemIds: string[];
}

export interface ChainTradeLink {
  position: number;
  giverId: number;
  itemId: string;
  itemName: string;
  imageUrl: string;
  receiverId: number;
  accepted: boolean;
  confirmed: boolean;
}

export type ChainTradeStatus = "PROPOSED" | "ACTIVE" | "COMPLETED" | "EXPIRED";

export interface ChainTrade {
  chainId: string;
  status: ChainTradeStatus;
  initiatorId: number;
  links: ChainTradeLink[];
  expiresAt: string;
  createdAt: string;
}

export interface PaginatedChainTradesResponse {
  content: ChainTrade[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  empty: boolean;
  first: boolean;
  last: boolean;
}

import {
  CheckCircle2,
  Clock,
  Shield,
  XCircle,
  type LucideIcon,
} from "lucide-react";

export const STATUS_CONFIG: Record<
  ChainTradeStatus,
  { icon: LucideIcon; colorClass: string; bgClass: string; dotClass: string }
> = {
  PROPOSED: {
    icon: Clock,
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50 border-amber-200",
    dotClass: "bg-amber-400",
  },
  ACTIVE: {
    icon: CheckCircle2,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50 border-blue-200",
    dotClass: "bg-blue-500",
  },
  COMPLETED: {
    icon: Shield,
    colorClass: "text-green-600",
    bgClass: "bg-green-50 border-green-200",
    dotClass: "bg-green-500",
  },
  EXPIRED: {
    icon: XCircle,
    colorClass: "text-gray-500",
    bgClass: "bg-gray-50 border-gray-200",
    dotClass: "bg-gray-400",
  },
};

export const MAGIC_GRADIENT =
  "linear-gradient(135deg, var(--swap-magic-start), var(--swap-magic-mid), var(--swap-magic-end))";
