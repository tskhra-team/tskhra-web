import { privateInstancePayment } from "@/api";
import type {
  Order,
  OrderHistoryResponse,
  OrderWithPayment,
} from "../types/payment";

export const paymentApi = {
  getOrderHistory: (page = 1, limit = 20) =>
    privateInstancePayment
      .get<OrderHistoryResponse>("/", { params: { page, limit } })
      .then((r) => r.data),

  getOrderDetails: (orderId: string) =>
    privateInstancePayment
      .get<Order>(`/${orderId}`)
      .then((r) => r.data),

  processPayment: (
    orderId: string,
    successRedirectUri?: string,
    failRedirectUri?: string,
  ) => {
    const params: Record<string, string> = {};
    if (successRedirectUri) params.success_redirect_uri = successRedirectUri;
    if (failRedirectUri) params.fail_redirect_uri = failRedirectUri;

    return privateInstancePayment
      .post<OrderWithPayment>(`/${orderId}/pay`, null, { params })
      .then((r) => r.data);
  },

  verifyPayment: (orderId: string) =>
    privateInstancePayment
      .post<OrderWithPayment>(`/${orderId}/verify`)
      .then((r) => r.data),
};
