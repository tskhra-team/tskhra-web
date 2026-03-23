import { t as i18nT, type TFunction } from "i18next";

export const STATUSES = {
  BUSINESS_QUANTITY_ERROR: 1000,
};

export const getStatusConfig = (
  type: number | undefined | null,
  t?: TFunction,
) => {
  const translate = t || i18nT;
  const defaultErrorConfig = {
    title: translate("modal:titles.somethingWentWrong"),
    message: translate("modal:messages.pleaseTryAgain"),
    type: "error",
  };

  const statusConfigs = {
    [STATUSES.BUSINESS_QUANTITY_ERROR]: {
      title: translate("modal:titles.businessQuantity"),
      message: translate("modal:messages.businessLimits"),
      type: "error",
    },
  };

  return (
    (type !== undefined && type !== null && statusConfigs[type]) ||
    defaultErrorConfig
  );
};
