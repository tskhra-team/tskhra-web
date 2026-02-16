import type { Platform } from "./types";

export interface PlatformColors {
  active: {
    background: string;
    text: string;
    icon: string;
  };
  inactive: {
    text: string;
    icon: string;
    hover: string;
  };
  subcategoryPanel: {
    background: string;
  };
}

export const platformColors: Record<Platform, PlatformColors> = {
  booking: {
    active: {
      background: "#FFF4ED", // Light orange background for active state
      text: "#C2410C", // Deep orange for text
      icon: "#EA580C", // Vibrant orange for icons
    },
    inactive: {
      text: "#6B7280", // Neutral gray for inactive text
      icon: "#9CA3AF", // Light gray for inactive icons
      hover: "#F3F4F6", // Subtle gray hover
    },
    subcategoryPanel: {
      background: "#fff", // Primary orange for panel
    },
  },
  ecommerce: {
    active: {
      background: "#EFF6FF", // Light blue background for active state
      text: "#1E40AF", // Deep blue for text
      icon: "#2563EB", // Vibrant blue for icons
    },
    inactive: {
      text: "#6B7280", // Neutral gray for inactive text
      icon: "#9CA3AF", // Light gray for inactive icons
      hover: "#F3F4F6", // Subtle gray hover
    },
    subcategoryPanel: {
      background: "#3B82F6", // Primary blue for panel
    },
  },
  swapping: {
    active: {
      background: "#FEF2F2", // Light red background for active state
      text: "#B91C1C", // Deep red for text
      icon: "#DC2626", // Vibrant red for icons
    },
    inactive: {
      text: "#6B7280", // Neutral gray for inactive text
      icon: "#9CA3AF", // Light gray for inactive icons
      hover: "#F3F4F6", // Subtle gray hover
    },
    subcategoryPanel: {
      background: "#EF4444", // Primary red for panel
    },
  },
};

// Default colors (fallback)
export const defaultColors: PlatformColors = {
  active: {
    background: "#F3F4F6", // Gray 100
    text: "#374151", // Gray 700
    icon: "#4B5563", // Gray 600
  },
  inactive: {
    text: "#374151", // Gray 700
    icon: "#6B7280", // Gray 500
    hover: "#F9FAFB", // Gray 50
  },
  subcategoryPanel: {
    background: "#6B7280", // Gray 500
  },
};

export function getPlatformColors(platform?: Platform): PlatformColors {
  if (!platform) return defaultColors;
  return platformColors[platform] || defaultColors;
}
