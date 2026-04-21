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
// import { useIsMobile } from "@/components/ui/use-mobile";
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

// Extracted Filter Form Component for reuse
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

  return (
    <>
      <div
        className={`flex items-center ${!isMobile && !hideTitle ? "justify-between" : "justify-end"} mb-6`}
      >
        {!isMobile && !hideTitle && (
          <h2 className="text-2xl font-bold">
            {t("swapping:catalog.filters")}
          </h2>
        )}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4 mr-1" />
            {t("swapping:catalog.clearAll")}
          </Button>
        )}
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
            <div className="bg-white/10 rounded-lg p-3 mb-6">
              <p className="text-sm text-white/80 font-normal">
                {t("swapping:catalog.filtersNotApplied")}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* City Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">
              {t("swapping:catalog.city")}
            </Label>
            {isCityChoosed && (
              <button
                type="button"
                onClick={() => {
                  setValue("cityId", "");
                  setValue("tradeRange", "");
                }}
                className="p-1.5 rounded-lg bg-swap-secondary text-black hover:bg-white/10 transition-colors cursor-pointer border-none hover:text-white"
                aria-label="Clear city filter"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
                <SelectTrigger className="w-full h-11 transition-all bg-swap-secondary text-swap-text2 border-0 hover:bg-opacity-90">
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
        </div>

        {/* Trade Range */}
        {isCityChoosed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Label className="text-base font-semibold">
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
                      <Button
                        key={option.value}
                        type="button"
                        variant="outline"
                        onClick={() => field.onChange(option.value)}
                        className={`h-11 transition-all justify-start ${
                          isSelected
                            ? "bg-white border-white text-swap-text2 font-semibold"
                            : "bg-swap-secondary text-swap-text2 border-0 hover:bg-white/20"
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 mr-2" />}
                        {option.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            />
          </motion.div>
        )}

        {/* Condition Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">
              {t("swapping:postItem.condition")}
            </Label>
            {watch("condition") && (
              <button
                type="button"
                onClick={() => setValue("condition", "")}
                className="p-1.5 rounded-lg bg-swap-secondary text-black hover:bg-white/10 transition-colors cursor-pointer border-none hover:text-white"
                aria-label="Clear condition filter"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full h-11 transition-all bg-swap-secondary text-swap-text2 border-0 hover:bg-opacity-90">
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
        </div>

        {/* Sort by Date */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">
              {t("swapping:catalog.sortByDate")}
            </Label>
            {watch("sortByDate") && (
              <button
                type="button"
                onClick={() => setValue("sortByDate", "")}
                className="p-1.5 rounded-lg bg-swap-secondary text-black hover:bg-white/10 transition-colors cursor-pointer border-none hover:text-white"
                aria-label="Clear sort filter"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <Controller
            name="sortByDate"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full h-11 transition-all bg-swap-secondary text-swap-text2 border-0 hover:bg-opacity-90">
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
        </div>

        {/* VIP Only Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">
              {t("swapping:catalog.status")}
            </Label>
            {watch("vipOnly") && (
              <button
                type="button"
                onClick={() => setValue("vipOnly", "")}
                className="p-1.5 rounded-lg bg-swap-secondary text-black hover:bg-white/10 transition-colors cursor-pointer border-none hover:text-white"
                aria-label="Clear VIP filter"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <Controller
            name="vipOnly"
            control={control}
            render={({ field }) => (
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
                className={`h-11 transition-all w-full justify-start ${
                  field.value === "true"
                    ? "bg-amber-400 border-amber-400 text-amber-900 hover:bg-amber-500 font-semibold"
                    : "bg-swap-secondary text-swap-text2 border-0 hover:bg-white/20"
                }`}
              >
                <Crown
                  className={`w-4 h-4 mr-2 ${
                    field.value === "true" ? "text-amber-900" : "text-amber-400"
                  }`}
                />
                {t("swapping:catalog.onlyVip")}
              </Button>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-white text-swap-text hover:bg-gray-100 font-semibold text-base shadow-lg"
          onClick={() => {
            setTimeout(
              () => window.scrollTo({ top: 120, left: 0, behavior: "smooth" }),
              200,
            );
          }}
        >
          {t("swapping:catalog.applyFilters")}
        </Button>
      </form>
    </>
  );
}

// Main Component with Responsive Design
export default function FilterSwapCatalog() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(["swapping"]);

  // Mobile: Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-40 h-14 px-6 bg-swap-primary text-white shadow-2xl hover:bg-swap-primary/90 font-bold"
            size="lg"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            {t("swapping:catalog.filters")}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-swap-primary text-white max-h-[85vh]">
          <DrawerHeader className="border-b border-white/10">
            <DrawerTitle className="text-2xl font-bold text-white">
              {t("swapping:catalog.filters")}
            </DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 py-6">
            <FilterForm isMobile={isMobile} onApplied={() => setOpen(false)} />
          </div>
          <DrawerFooter className="border-t border-white/10 pt-4">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full h-12 bg-transparent border-white text-white hover:bg-white/10"
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
    <div className="bg-swap-primary lg:sticky top-8 h-fit lg:w-100 rounded-3xl text-white shadow-xl">
      <Accordion
        type="single"
        collapsible
        defaultValue="filters"
        className="w-full"
      >
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="px-8 pt-4 pb-4 hover:no-underline items-center ">
            <span className="text-2xl font-bold">
              {t("swapping:catalog.filters")}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8">
            <FilterForm hideTitle={true} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
