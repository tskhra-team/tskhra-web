import type { TFunction } from "i18next";
import * as yup from "yup";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const createServiceSchema = (t: TFunction) => {
  return yup.object().shape({
    name: yup
      .string()
      .required(t("booking:validation.serviceNameRequired"))
      .min(2, t("booking:validation.serviceNameMinChars"))
      .max(40, t("booking:validation.serviceNameMax")),
    price: yup
      .number()
      .typeError(t("booking:validation.servicePriceInvalid"))
      .required(t("booking:validation.servicePriceRequired"))
      .positive(t("booking:validation.servicePricePositiveError"))
      .max(1000000, t("booking:validation.servicePriceMax")),
    duration: yup
      .number()
      .typeError(t("booking:validation.serviceDurationInvalid"))
      .required(t("booking:validation.serviceDurationRequired"))
      .positive(t("booking:validation.serviceDurationPositive"))
      .max(1440, t("booking:validation.serviceDurationMax"))
      .test(
        "is-multiple-of-5",
        t("booking:validation.serviceDurationInterval"),
        (value) => {
          if (value === undefined || value === null || isNaN(value))
            return false;
          return value % 5 === 0;
        },
      ),
    description: yup
      .string()
      .max(70, t("booking:validation.serviceDescriptionMax"))
      .optional(),
  });
};

// Schema for Step 1 - Business Information
export const createIndividualBusinessSchema = (t: TFunction) => {
  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const fileValidation = yup
    .mixed<File>()
    .test("fileSize", t("booking:validation.fileSizeTooLarge"), (value) => {
      if (!value) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test("fileType", t("booking:validation.fileTypeInvalid"), (value) => {
      if (!value) return true;
      return ALLOWED_FILE_TYPES.includes(value.type);
    });

  const workTimesSchema = yup.object().shape({
    weekDay: yup.string().required(t("booking:validation.weekDayRequired")),
    startTime: yup
      .number()
      .typeError(t("booking:validation.startTimeInvalid"))
      .required(t("booking:validation.startTimeRequired"))
      .min(0, t("booking:validation.startTimeNegative"))
      .max(1440, t("booking:validation.startTimeMax"))
      .test(
        "is-multiple-of-5",
        t("booking:validation.startTimeInterval"),
        (value) => {
          if (value === undefined || value === null || isNaN(value))
            return false;
          return value % 5 === 0;
        },
      ),
    endTime: yup
      .number()
      .typeError(t("booking:validation.endTimeInvalid"))
      .required(t("booking:validation.endTimeRequired"))
      .min(0, t("booking:validation.endTimeNegative"))
      .max(1440, t("booking:validation.endTimeMax"))
      .test(
        "is-multiple-of-5",
        t("booking:validation.endTimeInterval"),
        (value) => {
          if (value === undefined || value === null || isNaN(value))
            return false;
          return value % 5 === 0;
        },
      ),
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
      .mixed<"OUTCALL" | "ONSITE" | "BOTH">()
      .oneOf(["OUTCALL", "ONSITE", "BOTH"])
      .required(t("booking:validation.callTypeRequired")),
    city: yup.string().required(t("booking:validation.cityRequired")),
    addressDetails: yup.string().when("callType", {
      is: (val: string) => val !== "OUTCALL",
      then: (schema) =>
        schema.required(t("booking:validation.addressRequired")),
      otherwise: (schema) => schema.optional(),
    }),
    description: yup
      .string()
      .required(t("booking:validation.descriptionRequired"))
      .min(10, t("booking:validation.descriptionMin"))
      .max(250, t("booking:validation.descriptionMax")),
    mainCategory: yup
      .string()
      .required(t("booking:validation.mainCategoryRequired")),
    subCategory: yup
      .string()
      .required(t("booking:validation.subCategoryRequired")),
    workTimes: yup
      .array()
      .of(workTimesSchema)
      .min(1, t("booking:validation.workTimesMin"))
      .required(),
    restTimes: yup.array().of(workTimesSchema).optional(),
    info: infoSchema.required(),
    images: yup.object().shape({
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
    }),
  });
};

// Schema for Step 2 - Services
export const createServicesFormSchema = (t: TFunction) => {
  return yup.object().shape({
    services: yup
      .array()
      .of(createServiceSchema(t))
      .min(1, t("booking:validation.servicesMin"))
      .required(),
  });
};

// Types
export type InfoType = {
  phoneNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
};

export type ServiceType = {
  name: string;
  price: number;
  duration: number;
  description?: string;
};

export type WorkTimeType = {
  weekDay: string;
  startTime: number;
  endTime: number;
};

export type ImagesType = {
  businessPhoto: File[];
  galleryPhoto: File[];
};

export type IndividualBusinessFormData = {
  businessName: string;
  callType: "OUTCALL" | "ONSITE" | "BOTH";
  city: string;
  addressDetails: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  workTimes: WorkTimeType[];
  restTimes?: WorkTimeType[];
  info: InfoType;
  images: ImagesType;
};

export type ServicesFormData = {
  services: ServiceType[];
};
