import * as yup from "yup";

const ITEM_CONDITIONS = ["NEW", "LIKE_NEW", "USED", "DAMAGED"] as const;
const TRADE_RANGE = ["CITY_WIDE", "COUNTRY_WIDE"] as const;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const fileValidation = yup
  .mixed<File>()
  .test("fileSize", "swapping:validation.fileSizeTooLarge", (value) => {
    if (!value) return true;
    return value.size <= MAX_FILE_SIZE;
  })
  .test("fileType", "swapping:validation.fileTypeInvalid", (value) => {
    if (!value) return true;
    return ALLOWED_FILE_TYPES.includes(value.type);
  });

export const createPostItem = yup.object({
  title: yup
    .string()
    .required("swapping:validation.titleRequired")
    .min(5, "swapping:validation.titleMin")
    .max(40, "swapping:validation.titleMax"),

  description: yup
    .string()
    .required("swapping:validation.descRequired")
    .min(10, "swapping:validation.descMin")
    .max(100, "swapping:validation.descMax"),

  cityId: yup.string().required("swapping:validation.cityRequired"),

  tradeRange: yup
    .string()
    .required("swapping:validation.tradeRangeRequired")
    .oneOf([...TRADE_RANGE], "swapping:validation.conditionInvalid"),
  categoryId: yup.string().required("swapping:validation.categoryRequired"),
  subCategoryId: yup
    .string()
    .required("swapping:validation.subCategoryRequired"),
  condition: yup
    .string()
    .required("swapping:validation.conditionRequired")
    .oneOf([...ITEM_CONDITIONS], "swapping:validation.conditionInvalid"),

  photos: yup
    .array()
    .of(fileValidation.required())
    .required("swapping:validation.photoRequiered")
    .min(1, "swapping:validation.photoMin")
    .max(5, "swapping:validation.photoMax"),

  desiredCategories: yup
    .array()
    .of(yup.string().required())
    .min(1, "swapping:validation.desireCatRequired")
    .required("swapping:validation.desireCatRequired"),
});

export type CreatePostItemPostData = yup.InferType<typeof createPostItem>;
