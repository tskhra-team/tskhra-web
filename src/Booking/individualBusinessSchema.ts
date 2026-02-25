import * as yup from "yup";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

const fileValidation = yup
  .mixed<File>()
  .test("fileSize", "File size is too large (max 4MB)", (value) => {
    if (!value) return true;
    return value.size <= MAX_FILE_SIZE;
  });

const imagesSchema = yup.object().shape({
  businessPhoto: yup
    .array()
    .of(fileValidation.required())
    .min(1, "Business photo is required")
    .max(1, "You can upload only 1 business photo")
    .required("Business photo is required"),
  galleryPhoto: yup
    .array()
    .of(fileValidation.required())
    .max(4, "You can upload up to 4 photos only")
    .required("At least one gallery photo is required"),
});

const workTimesSchema = yup.object().shape({
  weekDay: yup.string().required("Week day Day is requiered"),
  startTime: yup.number().required("Start time is requiered").min(0).max(1440),
  endTime: yup.number().required("End time is requiered").min(0).max(1440),
});

const serviceSchema = yup.object().shape({
  name: yup
    .string()
    .required("Service name is requiered")
    .min(2, "Service Name should contain at least 2 letters")
    .max(20, "Service Name can't contain more than 20 letters"),
  price: yup
    .number()
    .required("Price is requiered")
    .positive("Price should be more that 0"),
  duration: yup.number().required("Duration is requiered").positive(),
  description: yup.string().optional(),
});

const infoSchema = yup.object({
  phoneNumber: yup.string().optional(),
  instagramUrl: yup.string().optional(),
  facebookUrl: yup.string().optional(),
});

const IndividualBusiessSchema = yup.object().shape({
  businessName: yup
    .string()
    .required("Business name is requiered")
    .min(2, "Business Name should contain at least 2 ")
    .max(40, "Business Name can't contain more than 20 symbols"),
  callType: yup
    .mixed<"outcall" | "onsite" | "both">()
    .oneOf(["outcall", "onsite", "both"])
    .required("Call type is requiered"),
  city: yup.string().required("City is requiered"),
  address: yup.string().when("callType", {
    is: (val: string) => val !== "outcall",
    then: (schema) =>
      schema.required("Address is required when not an outcall"),
    otherwise: (schema) => schema.optional(),
  }),
  description: yup
    .string()
    .required("Description is requiered")
    .min(10, "Description should containt at least 10 lettesr")
    .max(250, "Description can't contain more than 100 letters"),
  images: imagesSchema.required("Photos are requiered"),
  mainCategory: yup.string().required("Main category is requiered"),
  subCategory: yup.string().required("Sub category is requiered"),
  workTimes: yup
    .array()
    .of(workTimesSchema)
    .min(1, "You need to add at least one working day")
    .required(),
  restTimes: yup.array().of(workTimesSchema).optional(),
  services: yup
    .array()
    .of(serviceSchema)
    .min(1, "You need to add at least one service")
    .required(),
  info: infoSchema.required(),
});

type IndividualBusinessFormData = yup.InferType<typeof IndividualBusiessSchema>;
type InfoType = yup.InferType<typeof infoSchema>;
type ServiceType = yup.InferType<typeof serviceSchema>;
type WorkTimeType = yup.InferType<typeof workTimesSchema>;
type ImagesType = yup.InferType<typeof imagesSchema>;
export {
  imagesSchema,
  IndividualBusiessSchema,
  infoSchema,
  serviceSchema,
  workTimesSchema,
  type ImagesType,
  type IndividualBusinessFormData,
  type InfoType,
  type ServiceType,
  type WorkTimeType,
};
