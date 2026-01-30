import * as yup from "yup";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

type LoginSchemaType = yup.InferType<typeof loginSchema>;

export { loginSchema, type LoginSchemaType };

const registerSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must include at least 1 lowercase letter")
    .matches(/[A-Z]/, "Password must include at least 1 uppercase letter")
    .matches(/[0-9]/, "Password must include at least 1 number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must include at least 1 special character",
    ),

  confirmPassword: yup
    .string()
    .required("Repeat password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

type RegisterSchemaType = yup.InferType<typeof registerSchema>;

export { registerSchema, type RegisterSchemaType };
