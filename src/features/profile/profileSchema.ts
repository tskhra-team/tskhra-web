import * as yup from "yup";

const profileSchema = yup.object().shape({
  firstName: yup
    .string()
    .test(
      "letters-only",
      "First name must contain only letters",
      (value) => !value || /^[a-zA-Z\u00C0-\u024F\u0400-\u04FF\u10A0-\u10FF]*$/.test(value),
    )
    .test(
      "min-length",
      "First name must be at least 2 characters",
      (value) => !value || value.length >= 2,
    )
    .test(
      "max-length",
      "First name must be at most 50 characters",
      (value) => !value || value.length <= 50,
    )
    .default(""),
  lastName: yup
    .string()
    .test(
      "letters-only",
      "Last name must contain only letters",
      (value) => !value || /^[a-zA-Z\u00C0-\u024F\u0400-\u04FF\u10A0-\u10FF]*$/.test(value),
    )
    .test(
      "min-length",
      "Last name must be at least 2 characters",
      (value) => !value || value.length >= 2,
    )
    .test(
      "max-length",
      "Last name must be at most 50 characters",
      (value) => !value || value.length <= 50,
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
      "numbers-only",
      "Phone number must contain only numbers",
      (value) => !value || /^[0-9]*$/.test(value),
    )
    .test(
      "phone-length",
      "Phone number must be exactly 9 digits",
      (value) => !value || value.length === 9,
    )
    .default(""),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;
export { profileSchema, type ProfileFormData };
