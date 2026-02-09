import type { TFunction } from "i18next";
import * as yup from "yup";

const getLoginSchema = (t: TFunction) =>
  yup.object({
    username: yup
      .string()
      .required(t("common:validation.emailAndUserRequired")),
    password: yup
      .string()
      .required(t("common:validation.passwordRequired"))
      .matches(/^\S*$/, t("common:validation.passwordNoSpaces"))
      .min(8, t("common:validation.passwordMin")),
  });

type LoginSchemaType = yup.InferType<ReturnType<typeof getLoginSchema>>;

export { getLoginSchema, type LoginSchemaType };

const getRegisterSchema = (t: TFunction) =>
  yup.object({
    username: yup
      .string()
      .trim()
      .required(t("common:validation.nameRequired"))
      .min(2, t("common:validation.nameMin"))
      .max(50, t("common:validation.nameMax")),

    email: yup
      .string()
      .trim()
      .required(t("common:validation.emailRequired"))
      .email(t("common:validation.emailInvalid")),

    password: yup
      .string()
      .required(t("common:validation.passwordRequired"))
      .matches(/^\S*$/, t("common:validation.passwordNoSpaces"))
      .min(8, t("common:validation.passwordMin"))
      .matches(/[a-z]/, t("common:validation.passwordLowercase"))
      .matches(/[A-Z]/, t("common:validation.passwordUppercase"))
      .matches(/[0-9]/, t("common:validation.passwordNumber"))
      .matches(/[^a-zA-Z0-9]/, t("common:validation.passwordSpecial")),

    confirmPassword: yup
      .string()
      .required(t("common:validation.repeatPasswordRequired"))
      .matches(/^\S*$/, t("common:validation.passwordNoSpaces"))
      .oneOf([yup.ref("password")], t("common:validation.passwordsMatch")),
  });

type RegisterSchemaType = yup.InferType<ReturnType<typeof getRegisterSchema>>;

export { getRegisterSchema, type RegisterSchemaType };
