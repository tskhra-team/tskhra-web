import type { CategoryItem } from "./types";

export const mockCategories: CategoryItem[] = [
  // ========== ECOMMERCE & SWAPPING CATEGORIES ==========
  {
    name: "Electronics",
    platforms: ["ecommerce"],
    childItems: [
      { name: "Phones & Tablets", platforms: ["ecommerce"] },
      { name: "Laptops & Computers", platforms: ["ecommerce"] },
      { name: "TV & Audio", platforms: ["ecommerce"] },
      { name: "Cameras & Photo", platforms: ["ecommerce"] },
      { name: "Gaming Consoles", platforms: ["ecommerce"] },
      { name: "Accessories", platforms: ["ecommerce"] },
    ],
  },
  {
    name: "Fashion & Clothing",
    platforms: ["ecommerce", "swapping"],
    childItems: [
      { name: "Men's Clothing", platforms: ["ecommerce", "swapping"] },
      { name: "Women's Clothing", platforms: ["ecommerce", "swapping"] },
      { name: "Kids' Clothing", platforms: ["ecommerce", "swapping"] },
      { name: "Shoes", platforms: ["ecommerce", "swapping"] },
      { name: "Bags & Accessories", platforms: ["ecommerce", "swapping"] },
    ],
  },
  {
    name: "Home & Garden",
    platforms: ["ecommerce", "swapping"],
    childItems: [
      { name: "Furniture", platforms: ["ecommerce", "swapping"] },
      { name: "Kitchen & Dining", platforms: ["ecommerce", "swapping"] },
      { name: "Bedding & Bath", platforms: ["ecommerce", "swapping"] },
      { name: "Home Decor", platforms: ["ecommerce", "swapping"] },
      { name: "Garden & Outdoor", platforms: ["ecommerce", "swapping"] },
    ],
  },
  {
    name: "Books & Media",
    platforms: ["ecommerce", "swapping"],
    childItems: [
      { name: "Fiction", platforms: ["ecommerce", "swapping"] },
      { name: "Non-Fiction", platforms: ["ecommerce", "swapping"] },
      { name: "Textbooks", platforms: ["ecommerce", "swapping"] },
      { name: "Comics & Manga", platforms: ["ecommerce", "swapping"] },
      { name: "Movies & Music", platforms: ["ecommerce", "swapping"] },
    ],
  },
  {
    name: "Sports & Outdoors",
    platforms: ["ecommerce", "swapping"],
    childItems: [
      { name: "Sports Equipment", platforms: ["ecommerce", "swapping"] },
      { name: "Exercise & Fitness", platforms: ["ecommerce", "swapping"] },
      { name: "Outdoor Gear", platforms: ["ecommerce", "swapping"] },
      { name: "Camping & Hiking", platforms: ["ecommerce", "swapping"] },
      { name: "Cycling", platforms: ["ecommerce", "swapping"] },
    ],
  },

  // ========== BOOKING CATEGORIES (Real Georgian Services) ==========
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
