import type { TFunction } from "i18next";
import * as yup from "yup";

export const createPostItem = (t: TFunction) => {
  const ITEM_CONDITIONS = ["new", "good", "fair", "poor"] as const;
  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const fileValidation = yup
    .mixed<File>()
    .test(
      "fileSize",
      t("swapping:validation.fileSizeTooLarge"),
      (value) => {
        if (!value) return true;
        return value.size <= MAX_FILE_SIZE;
      },
    )
    .test(
      "fileType",
      t("swapping:validation.fileTypeInvalid"),
      (value) => {
        if (!value) return true;
        return ALLOWED_FILE_TYPES.includes(value.type);
      },
    );

  return yup.object({
    title: yup
      .string()
      .required(t("swapping:validation.titleRequired"))
      .min(5, t("swapping:validation.titleMin"))
      .max(40, t("swapping:validation.titleMax")),

    description: yup
      .string()
      .required(t("swapping:validation.descRequired"))
      .min(10, t("swapping:validation.descMin"))
      .max(100, t("swapping:validation.descMax")),

    estimatedValue: yup
      .number()
      .typeError(t("swapping:validation.estValueRequired"))
      .required(t("swapping:validation.estValueRequired"))
      .min(1, t("swapping:validation.priceMin"))
      .max(1000000, t("swapping:validation.priceMax"))
      .test("max-decimals", t("swapping:validation.maxDecimals"), (value) => {
        if (value === undefined || value === null) return true;
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      }),

    categoryId: yup
      .string()
      .required(t("swapping:validation.categoryRequired")),
    subCategoryId: yup
      .string()
      .required(t("swapping:validation.subCategoryRequired")),
    condition: yup
      .string()
      .required(t("swapping:validation.conditionRequired"))
      .oneOf(ITEM_CONDITIONS, t("swapping:validation.conditionInvalid")),

    photos: yup
      .array()
      .of(fileValidation.required())
      .required()
      .min(1, t("swapping:validation.photoMin"))
      .max(5, t("swapping:validation.photoMax")),

    desireCategories: yup
      .array()
      .of(yup.string().required())
      .min(1, t("swapping:validation.desireCatRequired"))
      .required(t("swapping:validation.desireCatRequired")),

    desireMinPrice: yup
      .number()
      .typeError(t("swapping:validation.desirePriceRequired"))
      .required(t("swapping:validation.desirePriceRequired"))
      .min(1, t("swapping:validation.priceMin"))
      .max(1000000, t("swapping:validation.priceMax"))
      .test("max-decimals", t("swapping:validation.maxDecimals"), (value) => {
        if (value === undefined || value === null) return true;
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      }),

    desireMaxPrice: yup
      .number()
      .typeError(t("swapping:validation.desirePriceRequired"))
      .required(t("swapping:validation.desirePriceRequired"))
      .min(1, t("swapping:validation.priceMin"))
      .max(1000000, t("swapping:validation.priceMax"))
      .min(
        yup.ref("desireMinPrice"),
        t("swapping:validation.maxMoreThanMin"),
      )
      .test("max-decimals", t("swapping:validation.maxDecimals"), (value) => {
        if (value === undefined || value === null) return true;
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      }),
  });
};

export type CreatePostItemPostData = yup.InferType<
  ReturnType<typeof createPostItem>
>;
