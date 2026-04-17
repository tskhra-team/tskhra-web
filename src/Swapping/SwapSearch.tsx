import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useGetSubBookingCategories from "@/shared/api/useGetSubBookingCategories";
import { ChevronDown, Grid, Search, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

interface SwapSearchProps {
  style?: object;
  animation?: boolean;
}

export function SwapSearch({ style, animation = true }: SwapSearchProps) {
  const { t, i18n } = useTranslation(["swapping"]);
  const { data: categories } = useGetSubBookingCategories(
    i18n.language.toUpperCase(),
  );

  // routing and parametres
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const anchorRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("s") || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    searchParams.get("c") || "",
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>(
    searchParams.get("sc") || "",
  );

  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get("s") || "");
    setSelectedCategoryId(searchParams.get("c") || "");
    setSelectedSubCategoryId(searchParams.get("sc") || "");
  }, [searchParams]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setIsScrolledToBottom(
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10,
    );
  }, []);

  // saving id not name
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId("");
    setOpen(false);

    //this for focus on search input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const handleSubCategorySelect = (
    categoryId: string,
    subCategoryId: string,
  ) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(subCategoryId);
    setOpen(false);

    //this for focus on search input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  // search names by id in url
  const selectedCatObj = categories?.find(
    (c) => String(c.id) === String(selectedCategoryId),
  );
  const selectedSubCatObj = selectedCatObj?.subcategories?.find(
    (s) => String(s.id) === String(selectedSubCategoryId),
  );

  const displayCategoryName = selectedCatObj?.name || "";
  const displaySubCategoryName = selectedSubCatObj?.name || "";

  const displayCategory = displaySubCategoryName
    ? `${displayCategoryName} · ${displaySubCategoryName}`
    : displayCategoryName;

  const showOverlay = open || (!!displayCategory && isActive);

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем всплытие, чтобы не моргал фон

    // 1. Очищаем локальные стейты
    setSearchQuery("");
    setSelectedCategoryId("");
    setSelectedSubCategoryId("");
    setIsActive(false);

    // 2. Берем текущие параметры URL
    const params = new URLSearchParams(searchParams);

    // 3. Удаляем только параметры поиска и категорий
    params.delete("s");
    params.delete("c");
    params.delete("sc");

    // 4. Пушим чистый URL
    navigate({
      pathname: "/swapping/catalog",
      search: params.toString(),
    });
  };

  const handleSearchSubmit = () => {
    // 1. Передаем searchParams внутрь, чтобы СОХРАНИТЬ текущие фильтры!
    const params = new URLSearchParams(searchParams);

    // 2. Добавляем или УДАЛЯЕМ параметры (если юзер стер текст в поиске)
    if (searchQuery) {
      params.set("s", searchQuery);
    } else {
      params.delete("s");
    }

    if (selectedCategoryId) {
      params.set("c", String(selectedCategoryId));
    } else {
      params.delete("c");
    }

    if (selectedSubCategoryId) {
      params.set("sc", String(selectedSubCategoryId));
    } else {
      params.delete("sc");
    }

    setIsActive(false);
    setOpen(false);

    navigate({
      pathname: "/swapping/catalog",
      search: params.toString(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  // Проверяем, есть ли активные параметры в поиске или категориях
  const hasActiveSearchOrCategory = searchQuery || selectedCategoryId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animation ? 1.2 : 0, duration: animation ? 0.6 : 0 }}
      className="px-8 md:px-20 mb-10 mt-10 md:mt-30 relative z-20 "
      style={style}
      id="target-section"
    >
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-[-1]"
            onClick={() => {
              setOpen(false);
              setIsActive(false);
            }}
          />
        )}
      </AnimatePresence>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div
            ref={anchorRef}
            onMouseDown={() => setIsActive(true)}
            className="p-2 rounded-2xl md:rounded-full backdrop-blur-xl bg-white/80 border-2 shadow-2xl flex flex-col md:flex-row items-center gap-2"
            style={{ borderColor: "var(--swap-secondary)" }}
          >
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-3 px-5 py-3 w-full border-b md:border-b-0 md:border-r border-gray-200">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown} //
                placeholder={t("swapping:hero.searchPlaceholder")}
                className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 font-medium text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => setSearchQuery("")}
                  className="shrink-0 p-0.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer border-none bg-transparent"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Category Trigger */}
            <PopoverTrigger asChild>
              <button className="flex-1 w-full flex items-center gap-3 px-5 py-3 cursor-pointer bg-transparent border-none outline-none text-left">
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
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategoryId("");
                      setSelectedSubCategoryId("");
                      setIsActive(false);
                    }}
                    className="shrink-0 p-0.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                ) : (
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            </PopoverTrigger>

            {/* Buttons */}
            <div className="flex gap-2 w-full md:w-auto">
              {hasActiveSearchOrCategory && (
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={handleClearAll}
                  className="px-3 py-2 text-sm font-semibold text-gray-400 hover:text-gray-800 transition-colors cursor-pointer bg-transparent border-none"
                >
                  Clear All
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseDown={(e) => e.stopPropagation()}
                className="flex-1 md:flex-none px-5 py-3 rounded-full font-medium flex items-center justify-center gap-2 text-white border-none cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, var(--swap-magic-start), var(--swap-magic-mid), var(--swap-magic-end))",
                  fontSize: "0.95rem",
                }}
              >
                <Sparkles className="w-4 h-4" />
                Magic Chain
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={handleSearchSubmit}
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
        </PopoverAnchor>

        <PopoverContent
          className="p-0 max-h-[70vh] overflow-hidden rounded-xl relative"
          align="center"
          sideOffset={12}
          style={{
            width: anchorRef.current?.offsetWidth,
          }}
        >
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 overflow-y-auto max-h-[70vh]"
          >
            {categories?.map((cat) => (
              <div key={cat.id} className="space-y-1">
                <button
                  onClick={() => handleCategorySelect(String(cat.id))}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-none text-left ${
                    String(cat.id) === String(selectedCategoryId)
                      ? "bg-gray-100"
                      : "bg-transparent"
                  }`}
                >
                  {cat.iconUrl ? (
                    <img
                      src={cat.iconUrl}
                      alt={cat.name}
                      className="w-6 h-6 rounded object-cover"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: "var(--swap-primary)" }}
                    >
                      {cat.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-800">
                    {cat.name}
                  </span>
                </button>

                {cat.subcategories?.length > 0 && (
                  <div className="ml-2 pl-3 border-l-2 border-gray-200 space-y-0.5">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() =>
                          handleSubCategorySelect(
                            String(cat.id),
                            String(sub.id),
                          )
                        }
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer border-none text-left ${
                          String(sub.id) === String(selectedSubCategoryId)
                            ? "bg-gray-100"
                            : "bg-transparent"
                        }`}
                      >
                        <span
                          className={`text-sm ${String(sub.id) === String(selectedSubCategoryId) ? "text-gray-800 font-medium" : "text-gray-500 hover:text-gray-800"}`}
                        >
                          {sub.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            className={`pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white to-transparent rounded-b-xl transition-opacity duration-300 ${
              isScrolledToBottom ? "opacity-0" : "opacity-100"
            }`}
          />
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}
