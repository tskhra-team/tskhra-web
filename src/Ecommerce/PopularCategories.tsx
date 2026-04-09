import {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  Gamepad2,
  Baby,
  Car,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { key: "electronics", icon: Laptop, itemCount: 2_340 },
  { key: "fashion", icon: Shirt, itemCount: 5_120 },
  { key: "home", icon: Home, itemCount: 1_890 },
  { key: "sports", icon: Dumbbell, itemCount: 980 },
  { key: "books", icon: BookOpen, itemCount: 3_450 },
  { key: "gaming", icon: Gamepad2, itemCount: 1_560 },
  { key: "kids", icon: Baby, itemCount: 2_100 },
  { key: "automotive", icon: Car, itemCount: 760 },
];

const CATEGORY_NAMES: Record<string, { en: string; ka: string }> = {
  electronics: { en: "Electronics", ka: "ელექტრონიკა" },
  fashion: { en: "Fashion", ka: "მოდა" },
  home: { en: "Home & Garden", ka: "სახლი და ბაღი" },
  sports: { en: "Sports & Fitness", ka: "სპორტი" },
  books: { en: "Books & Media", ka: "წიგნები" },
  gaming: { en: "Gaming", ka: "გეიმინგი" },
  kids: { en: "Kids & Baby", ka: "საბავშვო" },
  automotive: { en: "Automotive", ka: "ავტო" },
};

export default function PopularCategories() {
  const { t, i18n } = useTranslation("ecommerce");
  const navigate = useNavigate();
  const lang = i18n.language === "ka" ? "ka" : "en";

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-14">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#0f0f2d] text-white text-xs font-semibold uppercase tracking-wider mb-3">
            {t("categories.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f0f2d] tracking-tight">
            {t("categories.title")}
          </h2>
          <p className="text-[#0f0f2d]/50 mt-2 max-w-md mx-auto text-sm">
            {t("categories.description")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => navigate(`/ecommerce?category=${cat.key}`)}
              className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl bg-[#f8f8fa] hover:bg-[#0f0f2d] transition-colors duration-300 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-white group-hover:bg-white/15 flex items-center justify-center transition-colors duration-300">
                <cat.icon
                  className="w-5 h-5 text-[#0f0f2d] group-hover:text-white transition-colors duration-300"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h3 className="font-semibold text-[#0f0f2d] group-hover:text-white text-sm sm:text-base transition-colors duration-300">
                  {CATEGORY_NAMES[cat.key][lang]}
                </h3>
                <p className="text-[#0f0f2d]/40 group-hover:text-white/50 text-xs mt-1 transition-colors duration-300">
                  {cat.itemCount.toLocaleString()} {t("categories.items")}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
