import * as yup from "yup";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const nameValidation = yup
  .string()
  .test(
    "letters-only",
    "Must contain only letters",
    (value) =>
      !value ||
      /^[a-zA-Z\u00C0-\u024F\u0400-\u04FF\u10A0-\u10FF]*$/.test(value),
  )
  .min(2, "Must be at least 2 characters")
  .max(50, "Must be at most 50 characters")
  .default("");

const avatarFileValidation = yup
  .mixed<File>()
  .default(undefined)
  .nullable()
  .optional()
  .test("fileSize", "File size can't be more than 5MB", (value) => {
    if (!value) return true;
    return value.size <= MAX_FILE_SIZE;
  })
  .test("fileFormat", "Unsupported file format", (value) => {
    if (!value) return true;
    return SUPPORTED_FORMATS.includes(value.type);
  });

const AvatarType = yup.object().shape({
  avatarFile: avatarFileValidation,
});

const profileSchema = yup.object({
  firstName: nameValidation,
  lastName: nameValidation,

  gender: yup
    .string()
    .oneOf(["MALE", "FEMALE", ""], "Please select a valid gender")
    .default(""),

  birthDate: yup
    .date()
    .max(new Date(), "Birth date cannot be in the future")
    .test("min-age", "You must be at least 16 years old", (value) => {
      if (!value) return true;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= 16;
    })
    .default(() => new Date(new Date().getFullYear() - 16, 11)),

  phoneCountryCode: yup
    .string()
    .required("Country code is required")
    .default(""),

  phoneNumber: yup
    .string()
    .matches(/^[0-9]*$/, "Phone number must contain only numbers")
    .length(9, "Phone number must be exactly 9 digits")
    .default(""),

  avatarFile: avatarFileValidation,
});

// Manually define the type because yup.InferType doesn't support optional properties (?)
// This matches the runtime behavior of the schema
type ProfileFormData = {
  firstName: string;
  lastName: string;
  gender: "" | "MALE" | "FEMALE";
  birthDate: Date;
  phoneCountryCode: string;
  phoneNumber: string;
};

// For API calls, omit avatarFile since it's uploaded separately
type ProfileUpdateData = ProfileFormData;

type AvatarTypeData = yup.InferType<typeof AvatarType>;

export {
  AvatarType,
  profileSchema,
  type AvatarTypeData,
  type ProfileFormData,
  type ProfileUpdateData,
};
