/**
 * Maps category names to their SVG icon filenames from the backend
 * Icons are served from: http://10.227.164.247:9000/ui-assets/{filename}
 */

export const categoryIconFileMap: Record<string, string> = {
  // Main categories
  "Legal and Finance": "scale.svg",
  "Beauty and Personal Care": "heart.svg",
  "Health": "stethoscope.svg",
  "Home Services": "house.svg",
  "Cleaning": "brush-cleaning.svg",
  "Auto Services": "car.svg",
  "Education": "graduation-cap.svg",
  "Fitness and Sports": "dumbbell.svg",
  "Pets": "paw-print.svg",
  "Events": "calendar-1.svg",
  "IT and Technology": "laptop.svg",
  "Transport": "van.svg",

  // Subcategories - Beauty and Personal Care
  "Hair Care Services": "heart.svg",
  "Nail Care Services": "heart.svg",
  "Aesthetic Cosmetology": "heart.svg",
  "Makeup Services": "palette.svg",
  "Spa and Relaxation Procedures": "heart.svg",

  // Subcategories - Legal and Finance
  "Legal Services": "scale.svg",
  "Notary Services": "file-alt.svg",
  "Accounting and Audit": "briefcase.svg",
  "Business Consulting": "briefcase.svg",

  // Subcategories - Pets
  "Veterinary Services": "stethoscope.svg",
  "Pet Grooming and Care": "paw-print.svg",
  "Pet Training and Behavior Correction": "paw-print.svg",
  "Pet Boarding": "house.svg",

  // Subcategories - Auto Services
  "Vehicle Maintenance": "wrench.svg",
  "Chassis and Suspension Repair": "tools.svg",
  "Auto Electrics and Diagnostics": "plug.svg",
  "Car Wash and Polishing": "car.svg",

  // Subcategories - Health
  "Physiotherapy and Rehabilitation": "stethoscope.svg",
  "Psychological Counseling": "heart.svg",
  "Nursing and Ambulatory Care": "stethoscope.svg",
  "Dietetics and Nutrition": "utensils.svg",

  // Subcategories - Education
  "Foreign Language Teaching": "book.svg",
  "Exact and Natural Sciences": "graduation-cap.svg",
  "Music and Arts Education": "music.svg",
  "Professional Training and Retraining": "briefcase.svg",

  // Subcategories - Events
  "Photo and Video Production": "camera.svg",
  "Event Planning and Organization": "calendar-1.svg",
  "Musical and Visual Entertainment": "music.svg",
  "Festive Decoration and Floristry": "tree.svg",
  "Catering": "utensils.svg",

  // Subcategories - Home Services
  "Plumbing": "wrench.svg",
  "Electrical Works": "plug.svg",
  "HVAC Services": "cogs.svg",
  "Home Appliance Repair": "tools.svg",
  "Disinfection Services": "shield-alt.svg",

  // Subcategories - Fitness and Sports
  "Personal Trainer and Fitness": "dumbbell.svg",
  "Wellness Exercises": "heart.svg",
  "Swimming Pool Services": "heart.svg",
  "Martial Arts Training": "dumbbell.svg",

  // Subcategories - Cleaning
  "Residential Cleaning": "brush-cleaning.svg",
  "Commercial Cleaning": "brush-cleaning.svg",
  "Dry Cleaning (Furniture/Carpets)": "couch.svg",
  "Facade and Window Cleaning": "brush-cleaning.svg",

  // Subcategories - Transport
  "Freight Transport and Logistics": "truck.svg",
  "Passenger Transportation": "car-side.svg",
  "Courier and Postal Services": "shipping-fast.svg",
  "Special Equipment Services": "cogs.svg",

  // Subcategories - IT and Technology
  "Computer Hardware Services": "laptop.svg",
  "Software and Web Services": "laptop.svg",
  "Mobile Device Repair": "mobile-alt.svg",
  "Network Infrastructure Installation": "plug.svg",
};

export function getCategoryIconFilename(categoryName: string): string | undefined {
  return categoryIconFileMap[categoryName];
}
