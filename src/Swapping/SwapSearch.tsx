import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useGetSubBookingCategories from "@/shared/api/useGetSubBookingCategories";
import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import useGetSearchedItems from "@/Swapping/SwapCatalog/useGetSearchedItems";

import { ChevronDown, Grid, Loader2, Search, Sparkles, X } from "lucide-react";
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

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const anchorRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("s") || "");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    searchParams.get("c") || "",
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>(
    searchParams.get("sc") || "",
  );

  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  // sinc with URL
  useEffect(() => {
    setSearchQuery(searchParams.get("s") || "");
    setSelectedCategoryId(searchParams.get("c") || "");
    setSelectedSubCategoryId(searchParams.get("sc") || "");
  }, [searchParams]);

  // debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: liveSearchData, isLoading: isLiveSearchLoading } =
    useGetSearchedItems({
      page: 0,
      size: 3,
      query: debouncedSearchQuery ? debouncedSearchQuery : undefined,
      categoryId: selectedSubCategoryId
        ? Number(selectedSubCategoryId)
        : selectedCategoryId
          ? Number(selectedCategoryId)
          : undefined,
      enabled: Boolean(
        debouncedSearchQuery.length > 0 ||
        selectedSubCategoryId ||
        selectedCategoryId,
      ),
    });

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setIsScrolledToBottom(
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10,
    );
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId("");
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const handleSubCategorySelect = (
    categoryId: string,
    subCategoryId: string,
  ) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(subCategoryId);
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

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

  const showOverlay = open || isActive || isSearchFocused;

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedCategoryId("");
    setSelectedSubCategoryId("");
    setIsActive(false);

    setIsSearchFocused(false);
    inputRef.current?.blur();

    const params = new URLSearchParams(searchParams);
    params.delete("s");
    params.delete("c");
    params.delete("sc");

    navigate({ pathname: "/swapping/catalog", search: params.toString() });
  };

  const handleSearchSubmit = () => {
    const params = new URLSearchParams(searchParams);

    if (searchQuery) params.set("s", searchQuery);
    else params.delete("s");

    if (selectedCategoryId) params.set("c", String(selectedCategoryId));
    else params.delete("c");

    if (selectedSubCategoryId) params.set("sc", String(selectedSubCategoryId));
    else params.delete("sc");

    params.set("page", "1");
    setIsActive(false);
    setOpen(false);
    setIsSearchFocused(false);
    inputRef.current?.blur();

    navigate({ pathname: "/swapping/catalog", search: params.toString() });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const hasActiveSearchOrCategory = searchQuery || selectedCategoryId;

  const showLiveSearchPopover =
    isSearchFocused && debouncedSearchQuery.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animation ? 1.2 : 0, duration: animation ? 0.6 : 0 }}
      className="px-8 lg:px-20 mb-10 mt-10 lg:mt-30 relative z-20 "
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
              setIsSearchFocused(false);
            }}
          />
        )}
      </AnimatePresence>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            {" "}
            <div
              ref={anchorRef}
              onMouseDown={() => setIsActive(true)}
              className="p-2 rounded-2xl lg:rounded-full backdrop-blur-xl bg-white/80 border-2 shadow-2xl flex flex-col lg:flex-row items-center gap-2 relative z-10"
              style={{ borderColor: "var(--swap-secondary)" }}
            >
              {/* Search Input */}
              <div
                className={`flex-1 ${isSearchFocused ? "border-swap-primary" : ""} flex items-center gap-3 px-5 py-3 w-full border-b lg:border-b-0 lg:border-r border-gray-200 relative`}
              >
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("swapping:hero.searchPlaceholder")}
                  className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 font-medium text-base"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      setSearchQuery("");
                      setDebouncedSearchQuery("");
                    }}
                    className="shrink-0 p-0.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Category Trigger */}
              <PopoverTrigger asChild>
                <div
                  tabIndex={0}
                  className="flex-1 w-full flex items-center gap-3 px-5 py-3 cursor-pointer bg-transparent border-none outline-none text-left"
                >
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
                </div>
              </PopoverTrigger>

              {/* Buttons */}
              <div className="flex gap-2 w-full lg:w-auto items-center flex-col lg:flex-row">
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
                  className="flex-1 lg:flex-none w-full lg:w-auto px-5 py-3 rounded-full font-medium flex items-center justify-center gap-2 text-white border-none cursor-pointer"
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
                  className="flex-1 lg:flex-none w-full lg:w-auto px-6 py-3 rounded-full text-white font-medium flex items-center justify-center gap-2 border-none cursor-pointer"
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
            {/* live search popup*/}
            <AnimatePresence>
              {showLiveSearchPopover && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 lg:right-auto lg:w-100 top-[calc(100%+12px)] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20"
                >
                  <div className="p-4">
                    {isLiveSearchLoading ? (
                      <div className="flex items-center gap-2 text-gray-400 justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-medium">
                          Searching...
                        </span>
                      </div>
                    ) : liveSearchData?.content.length ? (
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-gray-400 uppercase px-2">
                          Top Results
                        </p>
                        {liveSearchData.content.map((item: any) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setIsSearchFocused(false);
                              inputRef.current?.blur();

                              navigate(`/swapping/trade-offer?id=${item.id}`);
                            }}
                            className="w-full h-22 flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border-none bg-transparent text-left"
                          >
                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                              <ImageWithFallback
                                src={item.images[0]}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800 text-md line-clamp-1">
                                {item.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {item.categoryName}
                              </span>
                            </div>
                          </button>
                        ))}

                        <button
                          onClick={handleSearchSubmit}
                          className="w-full mt-2 py-2 text-sm font-semibold text-swap-primary hover:bg-(--swap-primary)/10 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                        >
                          View all results
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p className="text-sm">
                          No items found for "{debouncedSearchQuery}"
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
            className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto max-h-[70vh]"
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
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-none text-left ${
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
