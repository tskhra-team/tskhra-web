import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetCitites from "@/shared/api/useGetCities";
import { Check, Crown, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo } from "react";
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

export default function FilterSwapCatalog() {
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
    <div className="bg-swap-primary block lg:sticky top-8 p-8 h-full lg:w-100 rounded-3xl text-white font-bold">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl">{t("swapping:catalog.filters")}</h1>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="text-white/70 hover:text-white hover:bg-white/10 transition-opacity"
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
            <p className="text-sm text-white/50 font-normal pb-5">
              {t("swapping:catalog.filtersNotApplied")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="spacer"
            initial={{ height: 0 }}
            animate={{
              height: "1.25rem",
            }}
            exit={{ height: 0 }}
            className="w-full"
          />
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* City */}
        <div>
          <div className="flex items-center justify-between h-3.5">
            <Label>{t("swapping:catalog.city")}</Label>
            {isCityChoosed && (
              <button
                type="button"
                onClick={() => {
                  setValue("cityId", "");
                  setValue("tradeRange", "");
                }}
                className="p-1 rounded bg-swap-secondary text-black hover:bg-white/10 transition-colors cursor-pointer border-none   hover:text-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
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
                <SelectTrigger className="w-full h-10 transition-all mt-2 bg-swap-secondary text-swap-text2">
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
          <div>
            <div className="flex items-center justify-between h-3.5">
              <Label>{t("swapping:postItem.tradeRange")}</Label>
            </div>
            <Controller
              name="tradeRange"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2 mt-2">
                  {tradeRangeOptions.map((option) => {
                    const isSelected = field.value === option.value;
                    return (
                      <Button
                        key={option.value}
                        type="button"
                        variant="outline"
                        onClick={() => field.onChange(option.value)}
                        className={`h-10 transition-all text-swap-text2 ${
                          isSelected
                            ? "bg-white border-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 mr-1" />}
                        {option.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            />
          </div>
        )}

        {/* Condition */}
        <div>
          <div className="flex items-center justify-between h-3.5">
            <Label>{t("swapping:postItem.condition")}</Label>
            {watch("condition") && (
              <button
                type="button"
                onClick={() => setValue("condition", "")}
                className="p-1 rounded bg-swap-secondary text-black hover:bg-white/10 transition-colors cursor-pointer border-none   hover:text-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full h-10 transition-all mt-2 bg-swap-secondary text-swap-text2">
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
        <div>
          <div className="flex items-center justify-between h-3.5">
            <Label>{t("swapping:catalog.sortByDate")}</Label>
            {watch("sortByDate") && (
              <button
                type="button"
                onClick={() => setValue("sortByDate", "")}
                className="p-1 rounded bg-swap-secondary text-black hover:bg-white/10 transition-colors cursor-pointer border-none   hover:text-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Controller
            name="sortByDate"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full h-10 transition-all mt-2 bg-swap-secondary text-swap-text2">
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

        {/* vipOnly */}
        <div>
          <div className="flex items-center justify-between h-3.5">
            <Label>{t("swapping:catalog.status")}</Label>
            {watch("vipOnly") && (
              <button
                type="button"
                onClick={() => setValue("vipOnly", "")}
                className="p-1 rounded bg-swap-secondary text-black hover:bg-white/10 transition-colors cursor-pointer border-none hover:text-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Controller
            name="vipOnly"
            control={control}
            render={({ field }) => (
              <div className="mt-2">
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
                  className={`flex-1 h-10 transition-all w-full ${
                    field.value === "true"
                      ? "bg-amber-400 border-amber-400 text-amber-900 hover:bg-amber-500"
                      : "text-swap-text2 hover:bg-gray-100"
                  }`}
                >
                  <Crown
                    className={`w-4 h-4 mr-1 ${
                      field.value === "true"
                        ? "text-amber-900"
                        : "text-amber-400"
                    }`}
                  />
                  {t("swapping:catalog.onlyVip")}
                </Button>
              </div>
            )}
          />
        </div>

        <Button
          type="submit"
          className="mt-5 w-full bg-white text-swap-text hover:bg-swap-bg"
          onClick={() =>
            setTimeout(
              () => window.scrollTo({ top: 120, left: 0, behavior: "smooth" }),
              200,
              [],
            )
          }
        >
          {t("swapping:catalog.applyFilters")}
        </Button>
      </form>
    </div>
  );
}
