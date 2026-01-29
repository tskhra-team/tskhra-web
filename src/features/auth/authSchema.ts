import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export type RegisterSchema = yup.InferType<typeof registerSchema>