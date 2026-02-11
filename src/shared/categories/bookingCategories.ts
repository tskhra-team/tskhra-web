import type { CategoryItem } from "./types";

export const bookingCategories: CategoryItem[] = [
  {
    name: "Automotive Services",
    platforms: ["booking"],
    childItems: [
      { name: "Auto-Moto Service", platforms: ["booking"] },
      { name: "Car Rental", platforms: ["booking"] },
      { name: "Tow Truck Service", platforms: ["booking"] },
    ],
  },
  {
    name: "Home & Property",
    platforms: ["booking"],
    childItems: [
      { name: "Furniture & Interior", platforms: ["booking"] },
      { name: "Construction & Repair", platforms: ["booking"] },
      { name: "Cleaning & Organization", platforms: ["booking"] },
      { name: "Locks & Safes", platforms: ["booking"] },
    ],
  },
  {
    name: "Professional Services",
    platforms: ["booking"],
    childItems: [
      { name: "Legal & Financial Services", platforms: ["booking"] },
      { name: "Computer Services", platforms: ["booking"] },
      { name: "Advertising Services", platforms: ["booking"] },
      { name: "Courier Service", platforms: ["booking"] },
    ],
  },
  {
    name: "Personal Care & Wellness",
    platforms: ["booking"],
    childItems: [
      { name: "Beauty Fitness Sports", platforms: ["booking"] },
      { name: "Medicine Healthcare", platforms: ["booking"] },
    ],
  },
  {
    name: "Events & Entertainment",
    platforms: ["booking"],
    childItems: [
      { name: "Event Services", platforms: ["booking"] },
      { name: "Entertainment", platforms: ["booking"] },
      { name: "Travel Tourism", platforms: ["booking"] },
    ],
  },
  {
    name: "Education & Learning",
    platforms: ["booking"],
    childItems: [
      { name: "Education", platforms: ["booking"] },
      { name: "Art", platforms: ["booking"] },
    ],
  },
  {
    name: "Business & Equipment",
    platforms: ["booking"],
    childItems: [
      { name: "Business Equipment", platforms: ["booking"] },
      { name: "Special Equipment Service", platforms: ["booking"] },
      { name: "Transportation Service", platforms: ["booking"] },
    ],
  },
  {
    name: "On-Call Services",
    platforms: ["booking"],
    childItems: [
      { name: "Workers on Call", platforms: ["booking"] },
      { name: "Craftsmen on Call", platforms: ["booking"] },
      { name: "Pet Care", platforms: ["booking"] },
      { name: "Security Protection", platforms: ["booking"] },
    ],
  },
  {
    name: "Products & Marketplace",
    platforms: ["booking"],
    childItems: [
      { name: "Food Products", platforms: ["booking"] },
      { name: "Gifts", platforms: ["booking"] },
      { name: "Buying Selling", platforms: ["booking"] },
    ],
  },
  {
    name: "Media & Technology",
    platforms: ["booking"],
    childItems: [
      { name: "Audio Video Photo", platforms: ["booking"] },
    ],
  },
  {
    name: "Children's Services",
    platforms: ["booking"],
    childItems: [
      { name: "Children's World", platforms: ["booking"] },
    ],
  },
  {
    name: "Outdoor & Recreation",
    platforms: ["booking"],
    childItems: [
      { name: "Weapons Hunting Fishing", platforms: ["booking"] },
    ],
  },
];
