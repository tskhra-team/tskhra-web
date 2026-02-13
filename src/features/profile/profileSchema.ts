import * as yup from "yup";

const profileSchema = yup.object().shape({
  firstName: yup
    .string()
    .test(
      "min-length",
      "First name must be at least 2 characters",
      (value) => !value || value.length >= 2,
    )
    .default(""),
  lastName: yup
    .string()
    .test(
      "min-length",
      "Last name must be at least 2 characters",
      (value) => !value || value.length >= 2,
    )
    .default(""),
  gender: yup
    .string()
    .test(
      "valid-gender",
      "Please select a valid gender",
      (value) => !value || ["MALE", "FEMALE", "OTHER"].includes(value),
    )
    .default(""),
  birthDate: yup
    .date()
    .test(
      "max-date",
      "Birth date cannot be in the future",
      (value) => !value || value <= new Date(),
    )
    .default(new Date()),
  phoneCountryCode: yup
    .string()
    .required("Country code is required")
    .default(""),
  phoneNumber: yup
    .string()
    .test(
      "phone-format",
      "Phone number must be 9 digits",
      (value) => !value || /^[0-9]{9}$/.test(value),
    )
    .default(""),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;
export { profileSchema, type ProfileFormData };
