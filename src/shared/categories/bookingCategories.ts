import type { CategoryItem } from "./types";
import {
  FaCar,
  FaWrench,
  FaCarSide,
  FaTruckPickup,
  FaHome,
  FaCouch,
  FaHammer,
  FaBroom,
  FaLock,
  FaBriefcase,
  FaBalanceScale,
  FaLaptop,
  FaBullhorn,
  FaShippingFast,
  FaHeartbeat,
  FaDumbbell,
  FaStethoscope,
  FaCalendarAlt,
  FaGlassCheers,
  FaMusic,
  FaPlane,
  FaGraduationCap,
  FaBook,
  FaPalette,
  FaIndustry,
  FaPrint,
  FaCogs,
  FaTruck,
} from "react-icons/fa";

export const bookingCategories: CategoryItem[] = [
  {
    name: "Automotive Services",
    icon: FaCar,
    platforms: ["booking"],
    childItems: [
      { name: "Auto-Moto Service", icon: FaWrench, platforms: ["booking"] },
      { name: "Car Rental", icon: FaCarSide, platforms: ["booking"] },
      { name: "Tow Truck Service", icon: FaTruckPickup, platforms: ["booking"] },
    ],
  },
  {
    name: "Home & Property",
    icon: FaHome,
    platforms: ["booking"],
    childItems: [
      { name: "Furniture & Interior", icon: FaCouch, platforms: ["booking"] },
      { name: "Construction & Repair", icon: FaHammer, platforms: ["booking"] },
      { name: "Cleaning & Organization", icon: FaBroom, platforms: ["booking"] },
      { name: "Locks & Safes", icon: FaLock, platforms: ["booking"] },
    ],
  },
  {
    name: "Professional Services",
    icon: FaBriefcase,
    platforms: ["booking"],
    childItems: [
      { name: "Legal & Financial Services", icon: FaBalanceScale, platforms: ["booking"] },
      { name: "Computer Services", icon: FaLaptop, platforms: ["booking"] },
      { name: "Advertising Services", icon: FaBullhorn, platforms: ["booking"] },
      { name: "Courier Service", icon: FaShippingFast, platforms: ["booking"] },
    ],
  },
  {
    name: "Personal Care & Wellness",
    icon: FaHeartbeat,
    platforms: ["booking"],
    childItems: [
      { name: "Beauty Fitness Sports", icon: FaDumbbell, platforms: ["booking"] },
      { name: "Medicine Healthcare", icon: FaStethoscope, platforms: ["booking"] },
    ],
  },
  {
    name: "Events & Entertainment",
    icon: FaCalendarAlt,
    platforms: ["booking"],
    childItems: [
      { name: "Event Services", icon: FaGlassCheers, platforms: ["booking"] },
      { name: "Entertainment", icon: FaMusic, platforms: ["booking"] },
      { name: "Travel Tourism", icon: FaPlane, platforms: ["booking"] },
    ],
  },
  {
    name: "Education & Learning",
    icon: FaGraduationCap,
    platforms: ["booking"],
    childItems: [
      { name: "Education", icon: FaBook, platforms: ["booking"] },
      { name: "Art", icon: FaPalette, platforms: ["booking"] },
    ],
  },
  {
    name: "Business & Equipment",
    icon: FaIndustry,
    platforms: ["booking"],
    childItems: [
      { name: "Business Equipment", icon: FaPrint, platforms: ["booking"] },
      { name: "Special Equipment Service", icon: FaCogs, platforms: ["booking"] },
      { name: "Transportation Service", icon: FaTruck, platforms: ["booking"] },
    ],
  },
];
