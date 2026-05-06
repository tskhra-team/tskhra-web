import { useAuth } from "@/context/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { paymentApi } from "../api/paymentApi";
import type {
  Order,
  OrderHistoryResponse,
  OrderWithPayment,
  PaymentApiError,
} from "../types/payment";

export const ORDER_QUERY_KEY = ["ecommerce", "orders"] as const;

function usePaymentErrorHandler() {
  const { t } = useTranslation("ecommerce");

  return (error: AxiosError<PaymentApiError>) => {
    const code = error.response?.data?.error_code;
    switch (code) {
      case "FORBIDDEN":
        toast.error(t("payment.errors.forbidden"));
        break;
      case "NOT_FOUND":
        toast.error(t("payment.errors.notFound"));
        break;
      case "VALIDATION_ERROR":
        toast.error(t("payment.errors.validationError"));
        break;
      case "PAYMENT_FAILED":
        toast.error(t("payment.errors.paymentFailed"));
        break;
      default:
        toast.error(t("payment.errors.generic"));
    }
  };
}

export function useGetOrderHistory(page = 1, limit = 20) {
  const { isAuthenticated } = useAuth();

  return useQuery<OrderHistoryResponse, AxiosError<PaymentApiError>>({
    queryKey: [...ORDER_QUERY_KEY, "history", page, limit],
    queryFn: () => paymentApi.getOrderHistory(page, limit),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetOrderDetails(orderId: string | null) {
  const { isAuthenticated } = useAuth();

  return useQuery<Order, AxiosError<PaymentApiError>>({
    queryKey: [...ORDER_QUERY_KEY, "details", orderId],
    queryFn: () => paymentApi.getOrderDetails(orderId!),
    enabled: isAuthenticated && orderId != null,
    staleTime: 2 * 60 * 1000,
  });
}

export function useProcessPayment() {
  const queryClient = useQueryClient();
  const onError = usePaymentErrorHandler();

  return useMutation<
    OrderWithPayment,
    AxiosError<PaymentApiError>,
    {
      orderId: string;
      successRedirectUri?: string;
      failRedirectUri?: string;
    }
  >({
    mutationFn: ({ orderId, successRedirectUri, failRedirectUri }) =>
      paymentApi.processPayment(orderId, successRedirectUri, failRedirectUri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ORDER_QUERY_KEY] });
    },
    onError,
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  const onError = usePaymentErrorHandler();

  return useMutation<OrderWithPayment, AxiosError<PaymentApiError>, string>({
    mutationFn: (orderId) => paymentApi.verifyPayment(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ORDER_QUERY_KEY] });
    },
    onError,
  });
}
