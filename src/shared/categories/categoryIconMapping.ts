import {
  FaBalanceScale,
  FaBath,
  FaBicycle,
  FaBook,
  FaBookOpen,
  FaBookReader,
  FaBriefcase,
  FaBroom,
  FaCalendarAlt,
  FaCamera,
  FaCampground,
  FaCar,
  FaCarSide,
  FaChild,
  FaCogs,
  FaCouch,
  FaDollarSign,
  FaDumbbell,
  FaFemale,
  FaFileAlt,
  FaFootballBall,
  FaGamepad,
  FaGift,
  FaGraduationCap,
  FaHeartbeat,
  FaHome,
  FaLaptop,
  FaMale,
  FaMobileAlt,
  FaMountain,
  FaMusic,
  FaPaintRoller,
  FaPalette,
  FaPaw,
  FaPlayCircle,
  FaPlug,
  FaShieldAlt,
  FaShippingFast,
  FaShoePrints,
  FaShoppingCart,
  FaStethoscope,
  FaSuitcase,
  FaTabletAlt,
  FaTools,
  FaTree,
  FaTruck,
  FaTshirt,
  FaTv,
  FaUtensils,
  FaVideo,
  FaWrench,
} from "react-icons/fa";
import type { IconType } from "react-icons";

// Mapping for booking categories and subcategories
export const bookingCategoryIcons: Record<string, IconType> = {
  // Main categories (from API)
  "Legal and Finance": FaBalanceScale,
  "Beauty and Personal Care": FaHeartbeat,
  "Health": FaStethoscope,
  "Home Services": FaHome,
  "Cleaning": FaBroom,
  "Auto Services": FaCar,
  "Education": FaGraduationCap,
  "Fitness and Sports": FaDumbbell,
  "Pets": FaPaw,
  "Events": FaCalendarAlt,
  "IT and Technology": FaLaptop,
  "Transport": FaTruck,

  // Beauty and Personal Care subcategories
  "Hair Care Services": FaHeartbeat,
  "Nail Care Services": FaHeartbeat,
  "Aesthetic Cosmetology": FaHeartbeat,
  "Makeup Services": FaPalette,
  "Spa and Relaxation Procedures": FaHeartbeat,

  // Legal and Finance subcategories
  "Legal Services": FaBalanceScale,
  "Notary Services": FaFileAlt,
  "Accounting and Audit": FaBriefcase,
  "Business Consulting": FaBriefcase,

  // Pets subcategories
  "Veterinary Services": FaStethoscope,
  "Pet Grooming and Care": FaPaw,
  "Pet Training and Behavior Correction": FaPaw,
  "Pet Boarding": FaHome,

  // Auto Services subcategories
  "Vehicle Maintenance": FaWrench,
  "Chassis and Suspension Repair": FaTools,
  "Auto Electrics and Diagnostics": FaPlug,
  "Car Wash and Polishing": FaCar,

  // Health subcategories
  "Physiotherapy and Rehabilitation": FaStethoscope,
  "Psychological Counseling": FaHeartbeat,
  "Nursing and Ambulatory Care": FaStethoscope,
  "Dietetics and Nutrition": FaUtensils,

  // Education subcategories
  "Foreign Language Teaching": FaBook,
  "Exact and Natural Sciences": FaGraduationCap,
  "Music and Arts Education": FaMusic,
  "Professional Training and Retraining": FaBriefcase,

  // Events subcategories
  "Photo and Video Production": FaCamera,
  "Event Planning and Organization": FaCalendarAlt,
  "Musical and Visual Entertainment": FaMusic,
  "Festive Decoration and Floristry": FaTree,
  "Catering": FaUtensils,

  // Home Services subcategories
  "Plumbing": FaWrench,
  "Electrical Works": FaPlug,
  "HVAC Services": FaCogs,
  "Home Appliance Repair": FaTools,
  "Disinfection Services": FaShieldAlt,

  // Fitness and Sports subcategories
  "Personal Trainer and Fitness": FaDumbbell,
  "Wellness Exercises": FaHeartbeat,
  "Swimming Pool Services": FaHeartbeat,
  "Martial Arts Training": FaDumbbell,

  // Cleaning subcategories
  "Residential Cleaning": FaBroom,
  "Commercial Cleaning": FaBroom,
  "Dry Cleaning (Furniture/Carpets)": FaCouch,
  "Facade and Window Cleaning": FaBroom,

  // Transport subcategories
  "Freight Transport and Logistics": FaTruck,
  "Passenger Transportation": FaCarSide,
  "Courier and Postal Services": FaShippingFast,
  "Special Equipment Services": FaCogs,

  // IT and Technology subcategories
  "Computer Hardware Services": FaLaptop,
  "Software and Web Services": FaLaptop,
  "Mobile Device Repair": FaMobileAlt,
  "Network Infrastructure Installation": FaPlug,
};

// Mapping for ecommerce categories
export const ecommerceCategoryIcons: Record<string, IconType> = {
  // Main categories
  "Electronics": FaMobileAlt,
  "Fashion & Clothing": FaTshirt,
  "Home & Garden": FaHome,
  "Books & Media": FaBook,
  "Sports & Outdoors": FaFootballBall,
  "Products & Marketplace": FaShoppingCart,
  "Media & Technology": FaPlayCircle,

  // Electronics subcategories
  "Phones & Tablets": FaTabletAlt,
  "Laptops & Computers": FaLaptop,
  "TV & Audio": FaTv,
  "Cameras & Photo": FaCamera,
  "Gaming Consoles": FaGamepad,
  "Accessories": FaPlug,

  // Fashion subcategories
  "Men's Clothing": FaMale,
  "Women's Clothing": FaFemale,
  "Kids' Clothing": FaChild,
  "Shoes": FaShoePrints,
  "Bags & Accessories": FaSuitcase,

  // Home & Garden subcategories
  "Furniture": FaCouch,
  "Kitchen & Dining": FaUtensils,
  "Bedding & Bath": FaBath,
  "Home Decor": FaPaintRoller,
  "Garden & Outdoor": FaTree,

  // Books & Media subcategories
  "Fiction": FaBookOpen,
  "Non-Fiction": FaFileAlt,
  "Textbooks": FaGraduationCap,
  "Comics & Manga": FaBookReader,
  "Movies & Music": FaMusic,

  // Sports subcategories
  "Sports Equipment": FaFootballBall,
  "Exercise & Fitness": FaDumbbell,
  "Outdoor Gear": FaMountain,
  "Camping & Hiking": FaCampground,
  "Cycling": FaBicycle,

  // Products & Marketplace subcategories
  "Food Products": FaUtensils,
  "Gifts": FaGift,
  "Buying Selling": FaDollarSign,
  "Auto Parts": FaCar,
  "Tires": FaCar,

  // Media & Technology subcategories
  "Audio Video Photo": FaVideo,
};

// Mapping for swapping categories
export const swappingCategoryIcons: Record<string, IconType> = {
  ...ecommerceCategoryIcons, // Swapping shares most categories with ecommerce
};

// Get icon for a category based on platform
export function getCategoryIcon(categoryName: string, platform: "booking" | "ecommerce" | "swapping"): IconType | undefined {
  const iconMaps = {
    booking: bookingCategoryIcons,
    ecommerce: ecommerceCategoryIcons,
    swapping: swappingCategoryIcons,
  };

  return iconMaps[platform][categoryName];
}
