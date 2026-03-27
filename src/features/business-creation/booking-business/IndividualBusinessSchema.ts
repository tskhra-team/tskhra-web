import type { TFunction } from "i18next";
import * as yup from "yup";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// export const createServiceSchema = (t: TFunction, isEnglish = false) => {
//   const ServiceNameSchemaKa = yup
//     .string()
//     .required(t("booking:validation.serviceNameRequiredKa"))
//     .matches(
//       /^\S+(?: \S+)*$/,
//       "Double spaces or leading/trailing spaces are not allowed",
//     )
//     .min(2, t("booking:validation.serviceNameMinChars"))
//     .max(40, t("booking:validation.serviceNameMax"));

//   const ServiceNameSchema = isEnglish
//     ? yup
//         .string()
//         .required(t("booking:validation.serviceNameRequired"))
//         .matches(
//           /^\S+(?: \S+)*$/,
//           "Double spaces or leading/trailing spaces are not allowed",
//         )
//         .min(2, t("booking:validation.serviceNameMinChars"))
//         .max(40, t("booking:validation.serviceNameMax"))
//     : yup.string().optional().default("");

//   const descriptionSchema = yup
//     .string()
//     .max(70, t("booking:validation.serviceDescriptionMax"))
//     .optional();

//   const schema = yup.object({
//     nameKa: ServiceNameSchemaKa,
//     name: ServiceNameSchema,
//     price: yup
//       .number()
//       .required(t("booking:validation.servicePriceRequired"))
//       .typeError(t("booking:validation.servicePriceRequired"))
//       .positive(t("booking:validation.servicePricePositiveError"))
//       .max(1000000, t("booking:validation.servicePriceMax")),
//     duration: yup
//       .number()
//       .required(t("booking:validation.serviceDurationRequired"))
//       .typeError(t("booking:validation.serviceDurationRequired"))
//       .positive(t("booking:validation.serviceDurationPositive"))
//       .max(1440, t("booking:validation.serviceDurationMax"))
//       .test(
//         "is-multiple-of-5",
//         t("booking:validation.serviceDurationInterval"),
//         (value) => {
//           if (value === undefined || value === null || isNaN(value))
//             return false;
//           return value % 5 === 0;
//         },
//       ),
//     descriptionKa: descriptionSchema,
//     description: descriptionSchema,
//   });

//   if (!isEnglish) return schema;

//   return schema.test("description-both-or-none", "", function (value) {
//     const { description, descriptionKa } = value as {
//       description?: string;
//       descriptionKa?: string;
//     };
//     const hasEn = !!description;
//     const hasKa = !!descriptionKa;

//     if (hasEn && !hasKa) {
//       return this.createError({
//         path: "descriptionKa",
//         message: t("booking:validation.serviceDescriptionKaRequired"),
//       });
//     }
//     if (hasKa && !hasEn) {
//       return this.createError({
//         path: "description",
//         message: t("booking:validation.serviceDescriptionRequired"),
//       });
//     }
//     return true;
//   });
// };

export const createServiceSchema = (t: TFunction, isEnglish = false) => {
  // Регулярка: строка не должна содержать два пробела подряд
  const noDoubleSpacesRegex = /^(?!.*\s{2}).*$/;
  const noDoubleSpacesMsgName = t("booking:validation.noDoubleSpaceName");
  const noDoubleSpacesMsgNameKa = t("booking:validation.noDoubleSpaceNameKa");
  const noDoubleSpacesMsgDuration = t("booking:validation.noDoubleSpaceDesc");

  const ServiceNameSchemaKa = yup
    .string()
    .trim() // Убирает пробелы в начале и конце. Строка из одних пробелов станет ""
    .required(t("booking:validation.serviceNameRequiredKa"))
    .matches(noDoubleSpacesRegex, noDoubleSpacesMsgNameKa)
    .min(2, t("booking:validation.serviceNameMinChars"))
    .max(40, t("booking:validation.serviceNameMax"));

  const ServiceNameSchema = isEnglish
    ? yup
        .string()
        .trim()
        .required(t("booking:validation.serviceNameRequired"))
        .matches(noDoubleSpacesRegex, noDoubleSpacesMsgName)
        .min(2, t("booking:validation.serviceNameMinChars"))
        .max(40, t("booking:validation.serviceNameMax"))
    : yup.string().optional().default("");

  const descriptionSchema = yup
    .string()
    .trim()
    .matches(noDoubleSpacesRegex, {
      message: noDoubleSpacesMsgDuration,
      excludeEmptyString: true,
    })
    .max(70, t("booking:validation.serviceDescriptionMax"))
    .optional();

  const schema = yup.object({
    nameKa: ServiceNameSchemaKa,
    name: ServiceNameSchema,
    price: yup
      .number()
      .required(t("booking:validation.servicePriceRequired"))
      .typeError(t("booking:validation.servicePriceRequired"))
      .positive(t("booking:validation.servicePricePositiveError"))
      .max(1000000, t("booking:validation.servicePriceMax"))
      .test("max-decimals", t("booking:validation.maxDecimals"), (value) => {
        if (value === undefined || value === null) return true;
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      }),
    duration: yup
      .number()
      .required(t("booking:validation.serviceDurationRequired"))
      .typeError(t("booking:validation.serviceDurationRequired"))
      .positive(t("booking:validation.serviceDurationPositive"))
      .integer(t("booking:validation.serviceDuration"))
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
    descriptionKa: descriptionSchema,
    description: descriptionSchema,
  });

  if (!isEnglish) return schema;

  return schema.test("description-both-or-none", "", function (value) {
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

  const createEnFieldSchema = (
    requiredMsg: string,
    min?: number,
    max?: number,
  ) => {
    return yup
      .string()
      .default("")
      .when("isEnglish", {
        is: true,
        then: (schema) => {
          let s = schema.required(requiredMsg);
          if (min) s = s.min(min, t("booking:validation.businessNameMin"));
          if (max) s = s.max(max, t("booking:validation.businessNameMax"));
          return s;
        },
        otherwise: (schema) => schema.notRequired(),
      });
  };

  return yup.object({
    isEnglish: yup.boolean().default(false),
    businessNameKa: yup
      .string()
      .required(t("booking:validation.businessNameRequiredKa"))
      .min(2, t("booking:validation.businessNameMin"))
      .max(40, t("booking:validation.businessNameMax")),
    businessName: createEnFieldSchema(
      t("booking:validation.businessNameRequired"),
      2,
      40,
    ),
    callType: yup
      .mixed<"OUTCALL" | "ONSITE" | "BOTH">()
      .oneOf(["OUTCALL", "ONSITE", "BOTH"])
      .required(t("booking:validation.callTypeRequired"))
      .default(null),
    city: yup.string().required(t("booking:validation.cityRequired")),
    addressDetailsKa: yup
      .string()
      .when("callType", {
        is: (val: string) => val !== "OUTCALL",
        then: (s) => s.required(t("booking:validation.addressRequiredKa")),
        otherwise: (s) => s.notRequired(),
      })
      .default(""),
    addressDetails: yup
      .string()
      .when(["isEnglish", "callType"], {
        is: (isEng: boolean, callType: string) =>
          isEng && callType !== "OUTCALL",
        then: (s) => s.required(t("booking:validation.addressRequired")),
        otherwise: (s) => s.notRequired(),
      })
      .default(""),
    descriptionKa: yup
      .string()
      .required(t("booking:validation.descriptionRequiredKa"))
      .min(10, t("booking:validation.descriptionMin"))
      .max(250, t("booking:validation.descriptionMax")),
    description: createEnFieldSchema(
      t("booking:validation.descriptionRequired"),
      10,
      250,
    ),
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
export const createServicesFormSchema = (t: TFunction, isEnglish: boolean) => {
  return yup.object({
    services: yup
      .array()
      .of(createServiceSchema(t, isEnglish))
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
