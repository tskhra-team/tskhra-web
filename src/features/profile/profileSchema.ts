import * as yup from "yup";

const profileSchema = yup.object().shape({
  firstName: yup
    .string()
    .optional()
    .test(
      "min-length",
      "First name must be at least 2 characters",
      (value) => !value || value.length >= 2
    ),
  lastName: yup
    .string()
    .optional()
    .test(
      "min-length",
      "Last name must be at least 2 characters",
      (value) => !value || value.length >= 2
    ),
  gender: yup
    .string()
    .optional()
    .test(
      "valid-gender",
      "Please select a valid gender",
      (value) => !value || ["male", "female", "other"].includes(value)
    ),
  birthDate: yup
    .date()
    .optional()
    .test(
      "max-date",
      "Birth date cannot be in the future",
      (value) => !value || value <= new Date()
    ),
  personalNumber: yup.string().optional(),
  phoneCountryCode: yup.string().required("Country code is required"),
  phoneNumber: yup
    .string()
    .optional()
    .test(
      "phone-format",
      "Phone number must be 9 digits",
      (value) => !value || /^[0-9]{9}$/.test(value)
    ),
  email: yup.string().email("Invalid email").required("Email is required"),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;
export { profileSchema, type ProfileFormData };
