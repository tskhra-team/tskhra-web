export type Platform = "ecommerce" | "booking" | "swapping";

export type CategoryItem = {
  name: string;
  url?: string;
  iconUrl?: string;
  imageUrl?: string;
  platforms?: Platform[];
  childItems?: CategoryItem[];
};
