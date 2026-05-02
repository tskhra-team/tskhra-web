import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@/shared/categories/useCategories";

export default function PopularCategories() {
  const { t } = useTranslation("ecommerce");
  const navigate = useNavigate();
  const { data: categories, isLoading } = useCategories("ecommerce");

  if (isLoading) {
    return (
      <section className="py-4 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-14">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <div className="animate-pulse h-6 w-32 bg-slate-200 rounded-full mx-auto mb-3" />
            <div className="animate-pulse h-8 w-64 bg-slate-200 rounded-lg mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse h-32 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-4 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-14">
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
          {categories.map((cat) => {
            const slug = cat.url || cat.name.toLowerCase().replace(/\s+/g, "-");

            return (
              <button
                key={cat.name}
                onClick={() => {
                  navigate(`/ecommerce/category/${slug}`);
                  window.scrollTo(0, 0);
                }}
                className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl bg-[#f8f8fa] hover:bg-[#0f0f2d] transition-colors duration-300 text-center cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-white/15 flex items-center justify-center transition-colors duration-300 overflow-hidden">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt=""
                      className="w-8 h-8 object-contain"
                    />
                  ) : cat.icon ? (
                    <cat.icon
                      className="w-5 h-5 text-[#0f0f2d] group-hover:text-white transition-colors duration-300"
                    />
                  ) : null}
                </div>

                <div>
                  <h3 className="font-semibold text-[#0f0f2d] group-hover:text-white text-sm sm:text-base transition-colors duration-300">
                    {cat.name}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
