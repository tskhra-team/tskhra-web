import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/components/ui/use-mobile";
import useGetCitites from "@/shared/api/useGetCities";
import { Check, Crown, SlidersHorizontal, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

interface FilterFormValues {
  cityId: string;
  tradeRange: string;
  condition: string;
  sortByDate: string;
  vipOnly: string;
}

function FilterForm({
  onApplied,
  isMobile,
  hideTitle,
}: {
  onApplied?: () => void;
  isMobile?: boolean;
  hideTitle?: boolean;
}) {
  const { i18n, t } = useTranslation(["swapping"]);
  const { data: cities } = useGetCitites(i18n.language.toUpperCase());
  const [searchParams, setSearchParams] = useSearchParams();

  const { control, watch, handleSubmit, setValue, reset } =
    useForm<FilterFormValues>({
      defaultValues: {
        cityId: searchParams.get("cityId") || "",
        tradeRange: searchParams.get("tradeRange") || "",
        condition: searchParams.get("condition") || "",
        sortByDate: searchParams.get("sortByDate") || "",
        vipOnly: searchParams.get("vipOnly") || "",
      },
    });

  useEffect(() => {
    reset({
      cityId: searchParams.get("cityId") || "",
      tradeRange: searchParams.get("tradeRange") || "",
      condition: searchParams.get("condition") || "",
      sortByDate: searchParams.get("sortByDate") || "",
      vipOnly: searchParams.get("vipOnly") || "",
    });
  }, [searchParams, reset]);

  const formValues = watch();

  const hasActiveFilters = Boolean(
    formValues.cityId ||
    formValues.tradeRange ||
    formValues.condition ||
    formValues.sortByDate ||
    formValues.vipOnly,
  );

  const isFiltersAppliedInUrl = Boolean(
    searchParams.get("cityId") ||
    searchParams.get("tradeRange") ||
    searchParams.get("condition") ||
    searchParams.get("sortByDate") ||
    searchParams.get("vipOnly"),
  );

  const isCityChoosed = formValues.cityId;

  const tradeRangeOptions = useMemo(
    () => [
      {
        value: "CITY_WIDE",
        label: t("swapping:postItem.tradeRangeCityWide"),
      },
      {
        value: "COUNTRY_WIDE",
        label: t("swapping:postItem.tradeRangeCountryWide"),
      },
    ],
    [t],
  );

  const conditionOptions = useMemo(
    () => [
      { value: "NEW", label: t("swapping:postItem.conditionNew") },
      { value: "LIKE_NEW", label: t("swapping:postItem.conditionGood") },
      { value: "USED", label: t("swapping:postItem.conditionFair") },
      { value: "DAMAGED", label: t("swapping:postItem.conditionPoor") },
    ],
    [t],
  );

  const sortOptions = useMemo(
    () => [
      { value: "NEWEST", label: t("swapping:catalog.newest") },
      { value: "OLDEST", label: t("swapping:catalog.oldest") },
    ],
    [t],
  );

  const onSubmit = (data: FilterFormValues) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(data).forEach(([key, value]) => {
      if (value && value !== "ALL") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1");
    setSearchParams(params);
    onApplied?.();
  };

  const handleResetAll = () => {
    const params = new URLSearchParams(searchParams);

    ["cityId", "tradeRange", "condition", "sortByDate", "vipOnly"].forEach(
      (key) => {
        params.delete(key);
      },
    );

    setSearchParams(params);

    reset({
      cityId: "",
      tradeRange: "",
      condition: "",
      sortByDate: "",
      vipOnly: "",
    });
  };

  const activeFilterCount = [
    formValues.cityId,
    formValues.tradeRange,
    formValues.condition,
    formValues.sortByDate,
    formValues.vipOnly,
  ].filter(Boolean).length;

  return (
    <>
      <div
        className={`flex items-center ${!isMobile && !hideTitle ? "justify-between" : "justify-end"} mb-5`}
      >
        {!isMobile && !hideTitle && (
          <h2 className="text-xl font-semibold tracking-tight">
            {t("swapping:catalog.filters")}
          </h2>
        )}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetAll}
                className="text-white/60 hover:text-white hover:bg-white/8 transition-all rounded-lg text-xs gap-1"
              >
                <X className="w-3.5 h-3.5" />
                {t("swapping:catalog.clearAll")}
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 bg-white/15 text-white/80 rounded-full w-5 h-5 text-[10px] inline-flex items-center justify-center font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {!isFiltersAppliedInUrl && hasActiveFilters ? (
          <motion.div
            key="warning-text"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg px-3.5 py-2.5 mb-5">
              <p className="text-[13px] text-amber-200/90 leading-snug">
                {t("swapping:catalog.filtersNotApplied")}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* City Filter */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className="flex items-center justify-between">
            <Label className="text-[13px] font-medium text-white/70 uppercase tracking-wider h-6">
              {t("swapping:catalog.city")}
            </Label>
            {isCityChoosed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                type="button"
                onClick={() => {
                  setValue("cityId", "");
                  setValue("tradeRange", "");
                }}
                className="p-1 rounded-md text-white/60 hover:text-white/80 hover:bg-white/8 transition-all cursor-pointer border-none bg-transparent"
                aria-label="Clear city filter"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>
          <Controller
            name="cityId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(newValue) => {
                  field.onChange(newValue);
                  if (newValue) {
                    setValue("tradeRange", "CITY_WIDE");
                  }
                }}
              >
                <SelectTrigger className="w-full h-10 transition-all bg-white/7 text-white/90 border border-white/8 rounded-lg hover:bg-white/10 hover:border-white/15 focus:ring-1 focus:ring-white/20 focus:border-white/20 data-placeholder:text-white/60">
                  <SelectValue placeholder={t("booking:form.city")} />
                </SelectTrigger>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={String(city.id)}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </motion.div>

        {/* Trade Range */}
        {isCityChoosed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Label className="text-[13px] font-medium text-white/70 uppercase tracking-wider h-6">
              {t("swapping:postItem.tradeRange")}
            </Label>
            <Controller
              name="tradeRange"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  {tradeRangeOptions.map((option) => {
                    const isSelected = field.value === option.value;
                    return (
                      <motion.div
                        key={option.value}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => field.onChange(option.value)}
                          className={`h-10 w-full transition-all text-[13px] rounded-lg ${
                            isSelected
                              ? "bg-white text-swap-primary border-white font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                              : "bg-white/7 text-white/70 border-white/8 hover:bg-white/12 hover:text-white/90"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          {option.label}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            />
          </motion.div>
        )}

        <div className="border-t border-white/6 my-1" />

        {/* Condition Filter */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <Label className="text-[13px] font-medium text-white/70 uppercase tracking-wider h-6">
              {t("swapping:postItem.condition")}
            </Label>
            {watch("condition") && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                type="button"
                onClick={() => setValue("condition", "")}
                className="p-1 rounded-md text-white/40 hover:text-white/80 hover:bg-white/8 transition-all cursor-pointer border-none bg-transparent"
                aria-label="Clear condition filter"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full h-10 transition-all bg-white/7 text-white/90 border border-white/8 rounded-lg hover:bg-white/10 hover:border-white/15 focus:ring-1 focus:ring-white/20 focus:border-white/20 data-placeholder:text-white/60">
                  <SelectValue placeholder={t("swapping:postItem.condition")} />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </motion.div>

        {/* Sort by Date */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className="flex items-center justify-between">
            <Label className="text-[13px] font-medium text-white/70 uppercase tracking-wider h-6">
              {t("swapping:catalog.sortByDate")}
            </Label>
            {watch("sortByDate") && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                type="button"
                onClick={() => setValue("sortByDate", "")}
                className="p-1 rounded-md text-white/40 hover:text-white/80 hover:bg-white/8 transition-all cursor-pointer border-none bg-transparent"
                aria-label="Clear sort filter"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>
          <Controller
            name="sortByDate"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full h-10 transition-all bg-white/7 text-white/90 border border-white/8 rounded-lg hover:bg-white/10 hover:border-white/15 focus:ring-1 focus:ring-white/20 focus:border-white/20 data-placeholder:text-white/60">
                  <SelectValue placeholder={t("swapping:catalog.sortByDate")} />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </motion.div>

        <div className="border-t border-white/6 my-1" />

        {/* VIP Only Filter */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <Label className="text-[13px] font-medium text-white/70 uppercase tracking-wider h-6">
              {t("swapping:catalog.status")}
            </Label>
            {watch("vipOnly") && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                type="button"
                onClick={() => setValue("vipOnly", "")}
                className="p-1 rounded-md text-white/40 hover:text-white/80 hover:bg-white/8 transition-all cursor-pointer border-none bg-transparent"
                aria-label="Clear VIP filter"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>
          <Controller
            name="vipOnly"
            control={control}
            render={({ field }) => (
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (field.value === "true") {
                      setValue("vipOnly", "");
                    } else {
                      field.onChange("true");
                    }
                  }}
                  className={`h-10 transition-all w-full justify-start rounded-lg text-[13px] ${
                    field.value === "true"
                      ? "bg-linear-to-r from-amber-400 to-amber-500 border-amber-400/50 text-amber-950 hover:from-amber-500 hover:to-amber-600 font-semibold shadow-[0_0_24px_rgba(251,191,36,0.15)]"
                      : "bg-white/7 text-white/70 border-white/8 hover:bg-white/12 hover:text-white/90"
                  }`}
                >
                  <Crown
                    className={`w-4 h-4 mr-2 ${
                      field.value === "true"
                        ? "text-amber-950"
                        : "text-amber-400/80"
                    }`}
                  />
                  {t("swapping:catalog.onlyVip")}
                </Button>
              </motion.div>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="pt-2"
        >
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full h-11 bg-white text-swap-primary hover:bg-white/90 font-semibold text-sm rounded-lg shadow-[0_4px_24px_rgba(255,255,255,0.1)] transition-all"
              onClick={() => {
                setTimeout(
                  () =>
                    window.scrollTo({ top: 120, left: 0, behavior: "smooth" }),
                  200,
                );
              }}
            >
              {t("swapping:catalog.applyFilters")}
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </>
  );
}

export default function FilterSwapCatalog() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(["swapping"]);
  const [searchParams] = useSearchParams();

  const activeFilterCount = [
    "cityId",
    "tradeRange",
    "condition",
    "sortByDate",
    "vipOnly",
  ].filter((key) => searchParams.get(key)).length;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <motion.div
            className="fixed bottom-6 right-6 z-40"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="h-13 px-5 bg-swap-primary text-white shadow-[0_8px_32px_rgba(163,22,33,0.4)] hover:bg-swap-primary/90 font-semibold rounded-2xl"
              size="lg"
            >
              <SlidersHorizontal className="w-4.5 h-4.5 mr-2" />
              {t("swapping:catalog.filters")}
              {activeFilterCount > 0 && (
                <span className="ml-1.5 bg-white text-swap-primary rounded-full min-w-5 h-5 px-1.5 text-xs inline-flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </motion.div>
        </DrawerTrigger>
        <DrawerContent className="bg-swap-primary text-white max-h-[85vh] rounded-t-3xl">
          <DrawerHeader className="border-b border-white/8 pb-4">
            <DrawerTitle className="text-xl font-semibold text-white tracking-tight">
              {t("swapping:catalog.filters")}
            </DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-5 py-5">
            <FilterForm isMobile={isMobile} onApplied={() => setOpen(false)} />
          </div>
          <DrawerFooter className="border-t border-white/8 pt-3 pb-4">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full h-11 bg-transparent border-white/20 text-white/80 hover:bg-white/8 hover:text-white rounded-lg text-sm"
              >
                {t("swapping:catalog.close")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="bg-swap-primary lg:block top-8 h-fit lg:w-100 rounded-2xl text-white shadow-[0_8px_40px_rgba(163,22,33,0.2)] overflow-hidden">
      <Accordion
        type="single"
        collapsible
        defaultValue="filters"
        className="w-full"
      >
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="px-7 pt-5 pb-4 hover:no-underline items-center">
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-semibold tracking-tight">
                {t("swapping:catalog.filters")}
              </span>
              {activeFilterCount > 0 && (
                <span className="bg-white/15 text-white/90 rounded-full min-w-5 h-5 px-1.5 text-[11px] inline-flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-7 pb-7">
            <FilterForm hideTitle={true} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
