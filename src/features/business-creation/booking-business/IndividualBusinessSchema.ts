import * as yup from "yup";
import type { TFunction } from "i18next";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export const createIndividualBusinessSchema = (t: TFunction) => {
  const fileValidation = yup
    .mixed<File>()
    .test("fileSize", t("booking:validation.fileSizeTooLarge"), (value) => {
      if (!value) return true;
      return value.size <= MAX_FILE_SIZE;
    });

  const imagesSchema = yup.object().shape({
    businessPhoto: yup
      .array()
      .of(fileValidation.required())
      .min(1, t("booking:validation.businessPhotoRequired"))
      .max(1, t("booking:validation.businessPhotoMax"))
      .required(t("booking:validation.businessPhotoRequired")),
    galleryPhoto: yup
      .array()
      .of(fileValidation.required())
      .min(1, t("booking:validation.galleryPhotoMin"))
      .max(4, t("booking:validation.galleryPhotoMax"))
      .required(t("booking:validation.galleryPhotoMin")),
  });

  const workTimesSchema = yup.object().shape({
    weekDay: yup.string().required(t("booking:validation.weekDayRequired")),
    startTime: yup
      .number()
      .typeError(t("booking:validation.startTimeInvalid"))
      .required(t("booking:validation.startTimeRequired"))
      .min(0, t("booking:validation.startTimeNegative"))
      .max(1440, t("booking:validation.startTimeMax"))
      .test("is-multiple-of-5", t("booking:validation.startTimeInterval"), (value) => {
        if (value === undefined || value === null || isNaN(value)) return false;
        return value % 5 === 0;
      }),
    endTime: yup
      .number()
      .typeError(t("booking:validation.endTimeInvalid"))
      .required(t("booking:validation.endTimeRequired"))
      .min(0, t("booking:validation.endTimeNegative"))
      .max(1440, t("booking:validation.endTimeMax"))
      .test("is-multiple-of-5", t("booking:validation.endTimeInterval"), (value) => {
        if (value === undefined || value === null || isNaN(value)) return false;
        return value % 5 === 0;
      }),
  });

  const serviceSchema = yup.object().shape({
    name: yup
      .string()
      .required(t("booking:validation.serviceNameRequired"))
      .min(2, t("booking:validation.serviceNameMinChars"))
      .max(20, t("booking:validation.serviceNameMax")),
    price: yup
      .number()
      .required(t("booking:validation.servicePriceRequired"))
      .positive(t("booking:validation.servicePricePositiveError")),
    duration: yup.number().required(t("booking:validation.serviceDurationRequired")).positive(),
    description: yup.string().optional(),
  });

  const infoSchema = yup.object({
    phoneNumber: yup.string().optional(),
    instagramUrl: yup.string().optional(),
    facebookUrl: yup.string().optional(),
  });

  return yup.object().shape({
    businessName: yup
      .string()
      .required(t("booking:validation.businessNameRequired"))
      .min(2, t("booking:validation.businessNameMin"))
      .max(40, t("booking:validation.businessNameMax")),
    callType: yup
      .mixed<"outcall" | "onsite" | "both">()
      .oneOf(["outcall", "onsite", "both"])
      .required(t("booking:validation.callTypeRequired")),
    city: yup.string().required(t("booking:validation.cityRequired")),
    address: yup.string().when("callType", {
      is: (val: string) => val !== "outcall",
      then: (schema) =>
        schema.required(t("booking:validation.addressRequired")),
      otherwise: (schema) => schema.optional(),
    }),
    description: yup
      .string()
      .required(t("booking:validation.descriptionRequired"))
      .min(10, t("booking:validation.descriptionMin"))
      .max(250, t("booking:validation.descriptionMax")),
    images: imagesSchema.required(t("booking:validation.photosRequired")),
    mainCategory: yup.string().required(t("booking:validation.mainCategoryRequired")),
    subCategory: yup.string().required(t("booking:validation.subCategoryRequired")),
    workTimes: yup
      .array()
      .of(workTimesSchema)
      .min(1, t("booking:validation.workTimesMin"))
      .required(),
    restTimes: yup.array().of(workTimesSchema).optional(),
    services: yup
      .array()
      .of(serviceSchema)
      .min(1, t("booking:validation.servicesMin"))
      .required(),
    info: infoSchema.required(),
  });
};

// Legacy export for backward compatibility (will use default English messages)
const IndividualBusiessSchema = yup.object().shape({
  businessName: yup
    .string()
    .required("Business name is required")
    .min(2, "Business Name should contain at least 2 characters")
    .max(40, "Business Name can't contain more than 40 symbols"),
  callType: yup
    .mixed<"outcall" | "onsite" | "both">()
    .oneOf(["outcall", "onsite", "both"])
    .required("Call type is required"),
  city: yup.string().required("City is required"),
  address: yup.string().when("callType", {
    is: (val: string) => val !== "outcall",
    then: (schema) =>
      schema.required("Address is required when not an outcall"),
    otherwise: (schema) => schema.optional(),
  }),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description should contain at least 10 characters")
    .max(250, "Description can't contain more than 250 characters"),
  images: yup.object().shape({
    businessPhoto: yup
      .array()
      .min(1, "Business photo is required")
      .max(1, "You can upload only 1 business photo")
      .required("Business photo is required"),
    galleryPhoto: yup
      .array()
      .min(1, "At least one gallery photo is required")
      .max(4, "You can upload up to 4 photos only")
      .required("At least one gallery photo is required"),
  }).required("Photos are required"),
  mainCategory: yup.string().required("Main category is required"),
  subCategory: yup.string().required("Sub category is required"),
  workTimes: yup
    .array()
    .min(1, "You need to add at least one working day")
    .required(),
  restTimes: yup.array().optional(),
  services: yup
    .array()
    .min(1, "You need to add at least one service")
    .required(),
  info: yup.object({
    phoneNumber: yup.string().optional(),
    instagramUrl: yup.string().optional(),
    facebookUrl: yup.string().optional(),
  }).required(),
});

type IndividualBusinessFormData = yup.InferType<typeof IndividualBusiessSchema>;
type InfoType = {
  phoneNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
};
type ServiceType = {
  name: string;
  price: number;
  duration: number;
  description?: string;
};
type WorkTimeType = {
  weekDay: string;
  startTime: number;
  endTime: number;
};
type ImagesType = {
  businessPhoto: File[];
  galleryPhoto: File[];
};

export {
  IndividualBusiessSchema,
  type ImagesType,
  type IndividualBusinessFormData,
  type InfoType,
  type ServiceType,
  type WorkTimeType,
};
