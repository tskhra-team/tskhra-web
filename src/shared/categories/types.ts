import type { IconType } from "react-icons";

export type Platform = "ecommerce" | "booking" | "swapping";

export type CategoryItem = {
  name: string;
  url?: string;
  icon?: IconType;
  iconUrl?: string;
  imageUrl?: string;
  platforms?: Platform[];
  childItems?: CategoryItem[];
};
