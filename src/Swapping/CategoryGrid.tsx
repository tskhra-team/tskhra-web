import { Skeleton } from "@/components/ui/skeleton";
import useGetSwappingCategories from "@/shared/api/useGetSwappingCategories";
import {
  BookOpen,
  Car,
  ChevronRight,
  Dumbbell,
  Guitar,
  HeartPlus,
  Home,
  Laptop,
  Package,
  Shirt,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CATEGORY_VISUALS: { icon: LucideIcon; count: string; color: string }[] = [
  { icon: Laptop, count: "12.5K", color: "var(--swap-primary)" },
  { icon: Shirt, count: "8.2K", color: "var(--swap-accent-orange)" },
  { icon: Home, count: "15.3K", color: "var(--swap-accent-gold)" },
  { icon: Dumbbell, count: "6.7K", color: "var(--swap-accent-green)" },
  { icon: BookOpen, count: "9.1K", color: "var(--swap-accent-taupe)" },
  { icon: Car, count: "11.4K", color: "var(--swap-primary)" },
  { icon: HeartPlus, count: "7.9K", color: "var(--swap-accent-orange)" },
  { icon: Guitar, count: "5.9K", color: "var(--swap-accent-gold)" },
];

const FALLBACK_COLORS = [
  "var(--swap-primary)",
  "var(--swap-accent-orange)",
  "var(--swap-accent-gold)",
  "var(--swap-accent-green)",
  "var(--swap-accent-taupe)",
];

function getVisuals(index: number) {
  return (
    CATEGORY_VISUALS[index] ?? {
      icon: Package,
      count: "—",
      color: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    }
  );
}

export function CategoryGrid() {
  const { t } = useTranslation(["swapping"]);
  const navigate = useNavigate();
  const { data: categories, isLoading } = useGetSwappingCategories();

  return (
    <div className="px-8 md:px-20 mt-40">
      <h1 className="text-3xl font-bold mb-10">
        {t("swapping:hero.popularCategories")}
      </h1>
      <div className="grid mb-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-3xl" />
          ))}

        {categories?.slice(0, 8).map((category, index) => {
          const { icon: Icon, count, color } = getVisuals(index);
          const subcategories = category.children.slice(0, 4);

          return (
            <motion.div
              key={category.id}
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
              onClick={() => {
                navigate(`/swapping/catalog?c=${category.id}&page=1`);
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth",
                });
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity"
                style={{ background: color }}
              />

              <div className="relative z-10 flex-1 flex flex-col">
                <motion.div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  style={{ background: color }}
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
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
                  {count} {t("swapping:hero.itemsAvailable")}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto mb-4">
                  {subcategories.map((sub) => (
                    <span
                      key={sub.id}
                      className="px-2 py-1 text-xs font-medium rounded-md"
                      style={{
                        backgroundColor: "var(--swap-overlay-subtle)",
                        color: "var(--swap-text2)",
                      }}
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>

                <div
                  className="flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0"
                  style={{ color }}
                >
                  {t("swapping:hero.exploreCategory")}{" "}
                  <ChevronRight className="w-4 h-4" />
                </div>

                <motion.div
                  className="mt-4 h-1 rounded-full absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: color }}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div
                className="absolute top-4 right-4 w-3 h-3 rounded-full opacity-60"
                style={{ background: color }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
