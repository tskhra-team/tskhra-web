import type { CategoryItem } from "./types";

export const mockCategories: CategoryItem[] = [
  {
    name: "Electronics",
    platforms: ["ecommerce"],
    childItems: [
      {
        name: "Phones & Tablets",
        platforms: ["ecommerce"],
      },
      {
        name: "Laptops & Computers",
        platforms: ["ecommerce"],
      },
      {
        name: "TV & Audio",
        platforms: ["ecommerce"],
      },
      {
        name: "Cameras & Photo",
        platforms: ["ecommerce"],
      },
      {
        name: "Gaming Consoles",
        platforms: ["ecommerce"],
      },
      {
        name: "Accessories",
        platforms: ["ecommerce"],
      },
    ],
  },
  {
    name: "Fashion & Clothing",
    platforms: ["ecommerce", "swapping"],
    childItems: [
      {
        name: "Men's Clothing",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Women's Clothing",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Kids' Clothing",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Shoes",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Bags & Accessories",
        platforms: ["ecommerce", "swapping"],
      },
    ],
  },
  {
    name: "Home & Garden",
    platforms: ["ecommerce", "swapping"],
    childItems: [
      {
        name: "Furniture",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Kitchen & Dining",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Bedding & Bath",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Home Decor",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Garden & Outdoor",
        platforms: ["ecommerce", "swapping"],
      },
    ],
  },
  {
    name: "Books & Media",
    platforms: ["ecommerce", "swapping"],
    childItems: [
      {
        name: "Fiction",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Non-Fiction",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Textbooks",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Comics & Manga",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Movies & Music",
        platforms: ["ecommerce", "swapping"],
      },
    ],
  },
  {
    name: "Sports & Outdoors",
    platforms: ["ecommerce", "swapping"],
    childItems: [
      {
        name: "Sports Equipment",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Exercise & Fitness",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Outdoor Gear",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Camping & Hiking",
        platforms: ["ecommerce", "swapping"],
      },
      {
        name: "Cycling",
        platforms: ["ecommerce", "swapping"],
      },
    ],
  },
  {
    name: "Beauty & Personal Care",
    platforms: ["ecommerce", "booking"],
    childItems: [
      {
        name: "Skincare",
        platforms: ["ecommerce"],
      },
      {
        name: "Makeup",
        platforms: ["ecommerce"],
      },
      {
        name: "Hair Care",
        platforms: ["ecommerce", "booking"],
      },
      {
        name: "Fragrances",
        platforms: ["ecommerce"],
      },
      {
        name: "Salon Services",
        platforms: ["booking"],
      },
    ],
  },
  {
    name: "Health & Wellness",
    platforms: ["booking"],
    childItems: [
      {
        name: "Medical Consultation",
        platforms: ["booking"],
      },
      {
        name: "Dental Services",
        platforms: ["booking"],
      },
      {
        name: "Physiotherapy",
        platforms: ["booking"],
      },
      {
        name: "Massage & Spa",
        platforms: ["booking"],
      },
      {
        name: "Mental Health",
        platforms: ["booking"],
      },
    ],
  },
  {
    name: "Professional Services",
    platforms: ["booking"],
    childItems: [
      {
        name: "Legal Services",
        platforms: ["booking"],
      },
      {
        name: "Accounting & Tax",
        platforms: ["booking"],
      },
      {
        name: "Real Estate",
        platforms: ["booking"],
      },
      {
        name: "Photography",
        platforms: ["booking"],
      },
      {
        name: "Tutoring",
        platforms: ["booking"],
      },
    ],
  },
  {
    name: "Home Services",
    platforms: ["booking"],
    childItems: [
      {
        name: "Cleaning Services",
        platforms: ["booking"],
      },
      {
        name: "Plumbing",
        platforms: ["booking"],
      },
      {
        name: "Electrical Services",
        platforms: ["booking"],
      },
      {
        name: "HVAC Services",
        platforms: ["booking"],
      },
      {
        name: "Landscaping",
        platforms: ["booking"],
      },
    ],
  },
  {
    name: "Automotive",
    platforms: ["booking", "swapping"],
    childItems: [
      {
        name: "Car Repair",
        platforms: ["booking"],
      },
      {
        name: "Oil Change",
        platforms: ["booking"],
      },
      {
        name: "Car Wash",
        platforms: ["booking"],
      },
      {
        name: "Auto Parts",
        platforms: ["swapping"],
      },
      {
        name: "Tires",
        platforms: ["booking", "swapping"],
      },
    ],
  },
];
