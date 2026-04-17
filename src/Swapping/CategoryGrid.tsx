import {
  BookOpen,
  Car,
  ChevronRight,
  Dumbbell,
  Home,
  Laptop,
  Palette,
  Shirt,
  Utensils,
} from "lucide-react";
import { motion } from "motion/react";

const categories = [
  {
    icon: Shirt,
    name: "Fashion",
    count: "12.5K",
    color: "var(--swap-primary)",
    subcategories: ["Vintage", "Sneakers", "Streetwear", "Bags"],
  },
  {
    icon: Laptop,
    name: "Electronics",
    count: "8.2K",
    color: "var(--swap-accent-orange)",
    subcategories: ["Phones", "Laptops", "Cameras", "Gaming"],
  },
  {
    icon: Home,
    name: "Home & Garden",
    count: "15.3K",
    color: "var(--swap-accent-gold)",
    subcategories: ["Furniture", "Decor", "Plants", "Tools"],
  },
  {
    icon: Palette,
    name: "Art & Crafts",
    count: "6.7K",
    color: "var(--swap-accent-green)",
    subcategories: ["Paintings", "Supplies", "Handmade", "Prints"],
  },
  {
    icon: Dumbbell,
    name: "Sports",
    count: "9.1K",
    color: "var(--swap-accent-taupe)",
    subcategories: ["Bikes", "Weights", "Apparel", "Rackets"],
  },
  {
    icon: BookOpen,
    name: "Books & Media",
    count: "11.4K",
    color: "var(--swap-primary)",
    subcategories: ["Fiction", "Vinyl", "Textbooks", "Comics"],
  },
  {
    icon: Utensils,
    name: "Kitchen",
    count: "7.8K",
    color: "var(--swap-accent-orange)",
    subcategories: ["Appliances", "Cookware", "Coffee", "Tableware"],
  },
  {
    icon: Car,
    name: "Automotive",
    count: "5.9K",
    color: "var(--swap-accent-gold)",
    subcategories: ["Parts", "Motorcycles", "Accessories", "Tools"],
  },
];

export function CategoryGrid() {
  return (
    <div className="px-8 md:px-20 mt-40">
      <h1 className=" text-3xl font-bold mb-10">Popular Categories</h1>
      <div className="grid mb-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{
              y: -10,
              transition: { duration: 0.3 },
            }}
            className="relative p-6 md:p-8 rounded-3xl backdrop-blur-md bg-white/70 border-2 shadow-xl overflow-hidden group cursor-pointer flex flex-col h-full"
            style={{ borderColor: "var(--swap-secondary)" }}
          >
            {/* Hover Background Effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity"
              style={{ background: category.color }}
            />

            <div className="relative z-10 flex-1 flex flex-col">
              <motion.div
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{ background: category.color }}
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <category.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </motion.div>

              <h3
                className="mb-1"
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "1.25rem",
                  color: "var(--swap-text)",
                }}
              >
                {category.name}
              </h3>

              <p
                style={{
                  color: "var(--swap-text2)",
                  fontSize: "0.875rem",
                  marginBottom: "1.5rem",
                }}
              >
                {category.count} items available
              </p>

              {/* Subcategories */}
              <div className="flex flex-wrap gap-2 mt-auto mb-4">
                {category.subcategories.map((sub) => (
                  <span
                    key={sub}
                    className="px-2 py-1 text-xs font-medium rounded-md"
                    style={{
                      backgroundColor: "var(--swap-overlay-subtle)",
                      color: "var(--swap-text2)",
                    }}
                  >
                    {sub}
                  </span>
                ))}
              </div>

              <div
                className="flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0"
                style={{ color: category.color }}
              >
                Explore Category <ChevronRight className="w-4 h-4" />
              </div>

              <motion.div
                className="mt-4 h-1 rounded-full absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: category.color }}
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Corner accent */}
            <div
              className="absolute top-4 right-4 w-3 h-3 rounded-full opacity-60"
              style={{ background: category.color }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
