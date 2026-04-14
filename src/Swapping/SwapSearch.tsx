import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useGetSubBookingCategories from "@/shared/api/useGetSubBookingCategories";
import { ChevronRight, Grid, Search, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function SwapSearch() {
  const { t, i18n } = useTranslation(["swapping"]);
  const { data: categories } = useGetSubBookingCategories(
    i18n.language.toUpperCase(),
  );

  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [open, setOpen] = useState(false);

  const handleCategorySelect = (categoryName: string, categoryId: number) => {
    const cat = categories?.find((c) => c.id === categoryId);
    if (cat?.subcategories?.length) {
      setExpandedCategoryId(
        expandedCategoryId === categoryId ? null : categoryId,
      );
    } else {
      setSelectedCategory(categoryName);
      setSelectedSubCategory("");
      setOpen(false);
    }
  };

  const handleSubCategorySelect = (
    categoryName: string,
    subCategoryName: string,
  ) => {
    setSelectedCategory(categoryName);
    setSelectedSubCategory(subCategoryName);
    setOpen(false);
  };

  const displayCategory = selectedSubCategory
    ? `${selectedCategory} · ${selectedSubCategory}`
    : selectedCategory;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="px-8  md:px-20 mb-10 mt-10 md:mt-30"
      id="target-section"
    >
      <div
        className="p-2 rounded-2xl md:rounded-full backdrop-blur-xl bg-white/80 border-2 shadow-2xl flex flex-col md:flex-row items-center gap-2"
        style={{ borderColor: "var(--swap-secondary)" }}
      >
        {/* Search Input */}
        <div className="flex-1 flex items-center gap-3 px-5 py-3 w-full border-b md:border-b-0 md:border-r border-gray-200">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("swapping:hero.searchPlaceholder")}
            className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 font-medium text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="shrink-0 p-0.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer border-none bg-transparent"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Category Popover */}
        <div className="flex-1 w-full block">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center gap-3 px-5 py-3 cursor-pointer bg-transparent border-none outline-none text-left">
                <Grid className="w-5 h-5 text-gray-400 shrink-0" />
                <span
                  className={`flex-1 font-medium text-base truncate ${
                    displayCategory ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {displayCategory || t("swapping:hero.categoryPlaceholder")}
                </span>
                {displayCategory ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory("");
                      setSelectedSubCategory("");
                      setExpandedCategoryId(null);
                    }}
                    className="shrink-0 p-0.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                ) : (
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      open ? "rotate-90" : ""
                    }`}
                  />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 max-h-80 overflow-y-auto rounded-xl"
              align="start"
              sideOffset={8}
            >
              <div className="p-2">
                {categories?.map((cat) => {
                  const isExpanded = expandedCategoryId === cat.id;
                  const hasSubcategories = cat.subcategories?.length > 0;

                  return (
                    <div key={cat.id}>
                      <button
                        onClick={() => handleCategorySelect(cat.name, cat.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent text-left"
                      >
                        {cat.iconUrl ? (
                          <img
                            src={cat.iconUrl}
                            alt={cat.name}
                            className="w-5 h-5 rounded object-cover"
                          />
                        ) : (
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ background: "var(--swap-primary)" }}
                          >
                            {cat.name.charAt(0)}
                          </div>
                        )}
                        <span className="flex-1 text-sm font-medium text-gray-800">
                          {cat.name}
                        </span>
                        {hasSubcategories && (
                          <ChevronRight
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* Subcategories */}
                      <AnimatePresence>
                        {isExpanded && hasSubcategories && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 pl-3 border-l-2 border-gray-200 space-y-0.5 py-1">
                              {cat.subcategories.map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() =>
                                    handleSubCategorySelect(cat.name, sub.name)
                                  }
                                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent text-left"
                                >
                                  {sub.iconUrl ? (
                                    <img
                                      src={sub.iconUrl}
                                      alt={sub.name}
                                      className="w-4 h-4 rounded object-cover"
                                    />
                                  ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                  )}
                                  <span className="text-sm text-gray-600">
                                    {sub.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 md:flex-none px-5 py-3 rounded-full font-medium flex items-center justify-center gap-2 text-white border-none cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)",
              fontSize: "0.95rem",
            }}
          >
            <Sparkles className="w-4 h-4" />
            Magic Chain
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 md:flex-none px-6 py-3 rounded-full text-white font-medium flex items-center justify-center gap-2 border-none cursor-pointer"
            style={{
              background: "var(--swap-primary)",
              fontSize: "0.95rem",
            }}
          >
            <Search className="w-4 h-4" />
            {t("swapping:hero.findSwaps")}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
