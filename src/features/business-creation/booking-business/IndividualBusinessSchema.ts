import type { TFunction } from "i18next";
import * as yup from "yup";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const createServiceSchema = (t: TFunction) => {
  const ServiceNameSchemaKa = yup
    .string()
    .required(t("booking:validation.serviceNameRequiredKa"))
    .min(2, t("booking:validation.serviceNameMinChars"))
    .max(40, t("booking:validation.serviceNameMax"));

  const ServiceNameSchema = yup
    .string()
    .required(t("booking:validation.serviceNameRequired"))
    .min(2, t("booking:validation.serviceNameMinChars"))
    .max(40, t("booking:validation.serviceNameMax"));

  return yup.object({
    nameKa: ServiceNameSchemaKa,
    name: ServiceNameSchema,
    price: yup
      .number()
      .required(t("booking:validation.servicePriceRequired"))
      .typeError(t("booking:validation.servicePriceRequired"))
      .positive(t("booking:validation.servicePricePositiveError"))
      .max(1000000, t("booking:validation.servicePriceMax")),
    duration: yup
      .number()
      .required(t("booking:validation.serviceDurationRequired"))
      .typeError(t("booking:validation.serviceDurationRequired"))
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
    descriptionKa: yup
      .string()
      .max(70, t("booking:validation.serviceDescriptionMax"))
      .optional(),
    description: yup
      .string()
      .max(70, t("booking:validation.serviceDescriptionMax"))
      .optional(),
  })
  .test(
    "description-both-or-none",
    "",
    function (value) {
      const { description, descriptionKa } = value as {
        description?: string;
        descriptionKa?: string;
      };
      const hasEn = !!description;
      const hasKa = !!descriptionKa;

      if (hasEn && !hasKa) {
        return this.createError({
          path: "descriptionKa",
          message: t("booking:validation.serviceDescriptionKaRequired"),
        });
      }
      if (hasKa && !hasEn) {
        return this.createError({
          path: "description",
          message: t("booking:validation.serviceDescriptionRequired"),
        });
      }
      return true;
    },
  );
};

// Schema for Step 1 - Business Information
export const createIndividualBusinessSchema = (t: TFunction) => {
  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
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

  const workTimesSchema = yup.object({
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
    phoneNumber: yup
      .string()
      .required(`${t("booking:validation.phoneNumberRequiered")}`)
      .matches(/^\+995\d{9}$/, t("booking:validation.phoneNumberFormat")),
    instagramUrl: yup.string().optional(),
    facebookUrl: yup.string().optional(),
  });

  const businessNameSchemaKa = yup
    .string()
    .required(t("booking:validation.businessNameRequiredKa"))
    .min(2, t("booking:validation.businessNameMin"))
    .max(40, t("booking:validation.businessNameMax"));

  const businessNameSchema = yup
    .string()
    .required(t("booking:validation.businessNameRequired"))
    .min(2, t("booking:validation.businessNameMin"))
    .max(40, t("booking:validation.businessNameMax"));

  const addressDetailsSchemaKa = yup
    .string()
    .when("callType", {
      is: (val: string) => val !== "OUTCALL",
      then: (schema) =>
        schema.required(t("booking:validation.addressRequiredKa")),
      otherwise: (schema) => schema.default(""),
    })
    .notRequired()
    .default(null);

  const addressDetailsSchema = yup
    .string()
    .when("callType", {
      is: (val: string) => val !== "OUTCALL",
      then: (schema) =>
        schema.required(t("booking:validation.addressRequired")),
      otherwise: (schema) => schema.default(""),
    })
    .notRequired()
    .default(null);

  const descriptionSchemaKa = yup
    .string()
    .required(t("booking:validation.descriptionRequiredKa"))
    .min(10, t("booking:validation.descriptionMin"))
    .max(250, t("booking:validation.descriptionMax"));

  const descriptionSchema = yup
    .string()
    .required(t("booking:validation.descriptionRequired"))
    .min(10, t("booking:validation.descriptionMin"))
    .max(250, t("booking:validation.descriptionMax"));

  return yup.object({
    businessNameKa: businessNameSchemaKa,
    businessName: businessNameSchema,
    callType: yup
      .mixed<"OUTCALL" | "ONSITE" | "BOTH">()
      .oneOf(["OUTCALL", "ONSITE", "BOTH"])
      .required(t("booking:validation.callTypeRequired"))
      .default(null),
    city: yup.string().required(t("booking:validation.cityRequired")),
    addressDetailsKa: addressDetailsSchemaKa,
    addressDetails: addressDetailsSchema,
    descriptionKa: descriptionSchemaKa,
    description: descriptionSchema,
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
    restTimes: yup.array().of(workTimesSchema).optional().default([]),
    info: infoSchema.required(),
    images: yup.object({
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
  return yup.object({
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
  nameKa: string;
  price: number;
  duration: number;
  description?: string;
  descriptionKa?: string;
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

export type IndividualBusinessFormData = yup.InferType<
  ReturnType<typeof createIndividualBusinessSchema>
>;

export type ServicesFormData = {
  services: ServiceType[];
};
